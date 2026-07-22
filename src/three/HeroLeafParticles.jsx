import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

// Each particle — sphere or dot — is a peephole onto a photo that's fixed to
// the screen behind everything (not part of the rotating group). Sampling by
// gl_FragCoord (the actual screen pixel) rather than any object-space UV means
// the image never moves or rotates with the logo; only the holes do, so as
// they swing/fly they scan across whatever patch of the photo sits behind them.
const SPHERE_VERTEX = /* glsl */ `
  varying vec3 vWorldNormal;
  void main() {
    vec3 worldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    vWorldNormal = worldNormal;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`
const SPHERE_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec3 vWorldNormal;
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  void main() {
    vec2 screenUV = gl_FragCoord.xy / uResolution;
    float sAR = uResolution.x / uResolution.y;
    float iAR = uImageAspect;
    vec2 ratio = vec2(min(sAR / iAR, 1.0), min(iAR / sAR, 1.0));
    vec2 coverUV = vec2(
      screenUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
      screenUV.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec3 texColor = texture2D(uMap, coverUV).rgb;
    vec3 n = normalize(vWorldNormal);
    float diff = max(dot(n, normalize(vec3(0.45, 0.6, 0.65))), 0.0);
    float diff2 = max(dot(n, normalize(vec3(-0.4, -0.2, -0.3))), 0.0) * 0.3;
    float light = 0.6 + diff * 0.65 + diff2;
    gl_FragColor = vec4(texColor * light, 1.0);
  }
`

const DOT_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  varying float vTwinkle;
  void main() {
    float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831);
    vTwinkle = tw;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * tw * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`
const DOT_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vTwinkle;
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float falloff = smoothstep(0.5, 0.0, d);

    vec2 screenUV = gl_FragCoord.xy / uResolution;
    float sAR = uResolution.x / uResolution.y;
    float iAR = uImageAspect;
    vec2 ratio = vec2(min(sAR / iAR, 1.0), min(iAR / sAR, 1.0));
    vec2 coverUV = vec2(
      screenUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
      screenUV.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec3 texColor = texture2D(uMap, coverUV).rgb;
    gl_FragColor = vec4(texColor * (0.82 + 0.18 * vTwinkle), falloff);
  }
`

const BASE_DISTANCE = 3.2
const BASE_FOV = 34

// How thick the blade gets at its core, and how far from the silhouette edge
// (in world units) it takes to ramp up to full thickness — small REF_EDGE_DIST
// means a sharper edge-to-core transition (sharp rim, thick middle).
const MAX_THICKNESS = 0.26
const REF_EDGE_DIST = 0.055
const CURVE_AMOUNT = 0.1

const RAY_DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [0.7071, 0.7071], [-0.7071, 0.7071], [0.7071, -0.7071], [-0.7071, -0.7071],
]
const MAX_RAY = 26

// Samples the real logo's alpha channel into a point cloud. Each point also
// gets an approximate distance-to-silhouette-edge (via short ray marches),
// which drives (a) a domed thickness profile — sharp at the outline, thick
// through the core, for genuine curved 3D volume — (b) whether it's a sphere
// or a flat dot: deep-interior points are bigger spheres, fading out toward
// dots near the edge — and (c) an "edge weight" used for a continuous ambient
// flicker on the outermost dots, like flames/breeze around the silhouette. A
// swooping bezier control point per particle gives the "blown in on the wind"
// flight path on arrival.
function useLogoParticles(src, count = 9000) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src
    img.onload = () => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      const w = 220
      const h = Math.round((img.height / img.width) * w)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)
      const { data: px } = ctx.getImageData(0, 0, w, h)
      const alphaAt = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : px[(y * w + x) * 4 + 3])

      const candidates = []
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (alphaAt(x, y) > 80) candidates.push([x, y])
        }
      }

      const edgeDistPx = (px_, py_) => {
        let minDist = MAX_RAY
        for (const [dx, dy] of RAY_DIRS) {
          let d = 0
          while (d < MAX_RAY) {
            d++
            if (alphaAt(Math.round(px_ + dx * d), Math.round(py_ + dy * d)) <= 80) break
          }
          if (d < minDist) minDist = d
        }
        return minDist
      }

      const worldPerPx = 2.4 / w
      const total = Math.min(count, candidates.length)
      const targets = new Float32Array(total * 3)
      const sizes = new Float32Array(total)
      const seeds = new Float32Array(total)
      const delays = new Float32Array(total)
      const isSphere = new Uint8Array(total)
      const edgeWeight = new Float32Array(total)
      const edgeDir = new Float32Array(total * 2)
      const swoop = new Float32Array(total * 3)

      for (let i = 0; i < total; i++) {
        const idx = Math.floor((i / total) * candidates.length + (Math.random() * candidates.length) / total) % candidates.length
        const [px_, py_] = candidates[idx]
        const nx = (px_ / w - 0.5) * 2.4
        const ny = -(py_ / h - 0.5) * 2.4 * (h / w)

        const edgeWorld = edgeDistPx(px_, py_) * worldPerPx
        const domeT = Math.min(edgeWorld / REF_EDGE_DIST, 1)
        const domeFactor = Math.sin((domeT * Math.PI) / 2)
        const curveZ = CURVE_AMOUNT * Math.sin(ny * 1.3)
        const volumeZ = (Math.random() * 2 - 1) * MAX_THICKNESS * domeFactor

        targets[i * 3] = nx + (Math.random() - 0.5) * 0.015
        targets[i * 3 + 1] = ny + (Math.random() - 0.5) * 0.015
        targets[i * 3 + 2] = volumeZ + curveZ

        const angle = Math.random() * Math.PI * 2
        edgeDir[i * 2] = Math.cos(angle)
        edgeDir[i * 2 + 1] = Math.sin(angle)

        const swoopAngle = Math.random() * Math.PI * 2
        swoop[i * 3] = Math.cos(swoopAngle)
        swoop[i * 3 + 1] = Math.sin(swoopAngle)
        swoop[i * 3 + 2] = (Math.random() - 0.5) * 0.7

        // deep interior (domeFactor -> 1) reads as bigger spheres; near the
        // edge (domeFactor -> 0) it fades into flat dots, with more of the
        // budget pushed toward dots in the transition band
        isSphere[i] = Math.random() < Math.pow(domeFactor, 2.6) ? 1 : 0
        const sizeMultiplier = 0.42 + 1.15 * Math.pow(domeFactor, 1.6)
        sizes[i] = (0.85 + Math.random() * 1.2) * sizeMultiplier
        edgeWeight[i] = Math.pow(1 - domeFactor, 1.3)
        seeds[i] = Math.random()
        delays[i] = Math.random() * 0.9
      }
      setData({ targets, edgeDir, swoop, sizes, seeds, delays, isSphere, edgeWeight })
    }
    return () => { cancelled = true }
  }, [src, count])

  return data
}

const INTRO_DURATION = 2.1 // seconds each particle takes to arrive, once its delay elapses
const INTRO_MAX_DELAY = 0.9 // matches the random spread used for per-particle `delays`

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
function smoothstep01(x) {
  const t = Math.min(Math.max(x, 0), 1)
  return t * t * (3 - 2 * t)
}

// Degrees of swing to each side from center. Kept well under 90° so the
// cloud never goes edge-on/flat — it always reads as the leaf shape. Much
// slower than a typical UI animation on purpose — this is ambient/idle motion.
const SWING_AMPLITUDE = (70 * Math.PI) / 180
const MOVE_DURATION = 14 // seconds to sweep between center and an extreme
const PAUSE_DURATION = 9 // seconds paused at center each time through
const SWING_CYCLE = MOVE_DURATION * 4 + PAUSE_DURATION * 2

// left extreme -> center -> pause -> right extreme -> center -> pause -> left extreme -> ...
function swingAngle(t) {
  const local = t % SWING_CYCLE
  const M = MOVE_DURATION
  const P = PAUSE_DURATION
  if (local < M) return -SWING_AMPLITUDE * (1 - smoothstep01(local / M))
  if (local < M + P) return 0
  if (local < 2 * M + P) return SWING_AMPLITUDE * smoothstep01((local - (M + P)) / M)
  if (local < 3 * M + P) return SWING_AMPLITUDE * (1 - smoothstep01((local - (2 * M + P)) / M))
  if (local < 3 * M + 2 * P) return 0
  return -SWING_AMPLITUDE * smoothstep01((local - (3 * M + 2 * P)) / M)
}

// Click-and-drag rotation sensitivity (radians per pixel dragged), and how
// far pitch is allowed to tip before clamping (avoids flipping upside down).
const DRAG_SENSITIVITY = 0.008
const MAX_DRAG_PITCH = (60 * Math.PI) / 180

// Hover-magnify: particles near the cursor push outward AND grow larger,
// like a lens bulging over them, tapering back to normal at the radius edge
// — springs back once the cursor leaves/moves on.
const REPEL_RADIUS = 0.1
const REPEL_STRENGTH = 0.09
const MAGNIFY_BOOST = 0.85 // extra size at the very center of the bulge (1 + this)

const TRAIL_POOL = 70
const TRAIL_SPHERE_POOL = 26
const TRAIL_LIFETIME = 1.2 // seconds
const TRAIL_MIN_SPACING = 10 // px between spawned trail marks
const TRAIL_SPHERE_CHANCE = 0.35 // fraction of spawned trail marks that render as spheres

function ParticleCloud({ data, anchorPx, boxRef, heroFrameRef, photoTexture, imageAspect }) {
  const { size, gl } = useThree()
  const groupRef = useRef()
  const meshRef = useRef()
  const sphereMatRef = useRef()
  const dotMatRef = useRef()
  const trailMatRef = useRef()
  const trailSphereMeshRef = useRef()
  const trailSphereMatRef = useRef()
  const introDone = useRef(false)

  const hoveringBox = useRef(false)
  const isDragging = useRef(false)
  const dragLast = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ yaw: 0, pitch: 0 })
  const currentTimeRef = useRef(0)
  const mouseClient = useRef({ x: -9999, y: -9999 })
  const frameRectRef = useRef(null)
  const repelIntensity = useRef(0)
  const repelVecTmp = useMemo(() => new THREE.Vector3(), [])
  const lastSpawn = useRef({ x: null, y: null })
  const trailSlots = useRef(Array.from({ length: TRAIL_POOL }, () => ({ active: false, x: 0, y: 0, z: 0, spawnTime: -999, baseSize: 0 })))
  const trailCursor = useRef(0)
  const trailSphereSlots = useRef(Array.from({ length: TRAIL_SPHERE_POOL }, () => ({ active: false, x: 0, y: 0, z: 0, spawnTime: -999, baseSize: 0 })))
  const trailSphereCursor = useRef(0)

  // Scales the whole scene so the logo keeps its original on-screen size even
  // though the canvas now spans the full hero instead of a small box, and
  // positions the group so the logo forms exactly where it used to sit.
  const layout = useMemo(() => {
    const scaleFactor = Math.max(size.height / anchorPx.boxHeight, 0.0001)
    const distance = BASE_DISTANCE * scaleFactor
    const halfHeight = distance * Math.tan((BASE_FOV / 2) * (Math.PI / 180))
    const halfWidth = halfHeight * (size.width / size.height)
    const ndcX = (anchorPx.x / size.width) * 2 - 1
    const ndcY = -((anchorPx.y / size.height) * 2 - 1)
    return {
      distance,
      halfWidth,
      halfHeight,
      scaleFactor,
      anchorWorldX: ndcX * halfWidth,
      anchorWorldY: ndcY * halfHeight,
    }
  }, [size, anchorPx])

  // Converts a raw viewport pixel position to this canvas's world space
  // (independent of the rotating group's own anchor offset).
  const pxToWorld = (clientX, clientY, frameRect) => {
    const localX = clientX - frameRect.left
    const localY = clientY - frameRect.top
    const ndcX = (localX / size.width) * 2 - 1
    const ndcY = -((localY / size.height) * 2 - 1)
    return { x: ndcX * layout.halfWidth, y: ndcY * layout.halfHeight }
  }

  useEffect(() => {
    const onMove = (e) => {
      mouseClient.current.x = e.clientX
      mouseClient.current.y = e.clientY

      const boxEl = boxRef.current
      const frameEl = heroFrameRef.current
      if (!boxEl || !frameEl) return
      const boxRect = boxEl.getBoundingClientRect()
      const frameRect = frameEl.getBoundingClientRect()
      frameRectRef.current = frameRect

      const inBox = e.clientX >= boxRect.left && e.clientX <= boxRect.right && e.clientY >= boxRect.top && e.clientY <= boxRect.bottom
      if (inBox) {
        hoveringBox.current = true
        if (isDragging.current) {
          const dx = e.clientX - dragLast.current.x
          const dy = e.clientY - dragLast.current.y
          dragOffset.current.yaw += dx * DRAG_SENSITIVITY
          dragOffset.current.pitch = Math.max(-MAX_DRAG_PITCH, Math.min(MAX_DRAG_PITCH, dragOffset.current.pitch - dy * DRAG_SENSITIVITY))
          dragLast.current = { x: e.clientX, y: e.clientY }
        }
        return
      }
      hoveringBox.current = false

      const heroVisible = frameRect.top < window.innerHeight && frameRect.bottom > 0
      const inFrameY = e.clientY >= 0 && e.clientY <= window.innerHeight
      if (!heroVisible || !inFrameY) return

      const last = lastSpawn.current
      const moved = last.x === null || Math.hypot(e.clientX - last.x, e.clientY - last.y) >= TRAIL_MIN_SPACING
      if (!moved) return
      lastSpawn.current = { x: e.clientX, y: e.clientY }

      const world = pxToWorld(e.clientX, e.clientY, frameRect)
      if (Math.random() < TRAIL_SPHERE_CHANCE) {
        const slot = trailSphereSlots.current[trailSphereCursor.current]
        slot.active = true
        slot.x = world.x
        slot.y = world.y
        slot.z = (Math.random() - 0.5) * 0.05
        slot.spawnTime = currentTimeRef.current
        slot.baseSize = (0.05 + Math.random() * 0.03) * layout.scaleFactor
        trailSphereCursor.current = (trailSphereCursor.current + 1) % TRAIL_SPHERE_POOL
      } else {
        const slot = trailSlots.current[trailCursor.current]
        slot.active = true
        slot.x = world.x
        slot.y = world.y
        slot.z = (Math.random() - 0.5) * 0.05
        slot.spawnTime = currentTimeRef.current
        slot.baseSize = (100 + Math.random() * 60) * layout.scaleFactor
        trailCursor.current = (trailCursor.current + 1) % TRAIL_POOL
      }
    }
    const onDown = (e) => {
      const boxEl = boxRef.current
      if (!boxEl) return
      const r = boxEl.getBoundingClientRect()
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        isDragging.current = true
        dragLast.current = { x: e.clientX, y: e.clientY }
      }
    }
    const onUp = () => {
      isDragging.current = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxRef, heroFrameRef, layout])

  // Resolves each particle's true edge-of-screen starting point (in world
  // space, independent of the anchor), then converts to the group's local
  // space by subtracting the anchor offset — so particles genuinely start at
  // the hero's visible edges and swoop in toward the logo's anchored spot.
  const startsLocal = useMemo(() => {
    const total = data.sizes.length
    const out = new Float32Array(total * 3)
    const margin = 1.12
    for (let i = 0; i < total; i++) {
      const dx = data.edgeDir[i * 2]
      const dy = data.edgeDir[i * 2 + 1]
      const tx = dx !== 0 ? layout.halfWidth / Math.abs(dx) : Infinity
      const ty = dy !== 0 ? layout.halfHeight / Math.abs(dy) : Infinity
      const t = Math.min(tx, ty) * margin
      const worldX = dx * t
      const worldY = dy * t
      out[i * 3] = worldX - layout.anchorWorldX
      out[i * 3 + 1] = worldY - layout.anchorWorldY
      out[i * 3 + 2] = (Math.random() - 0.5) * 0.6 * layout.scaleFactor
    }
    return out
  }, [data, layout])

  const controlsLocal = useMemo(() => {
    const total = data.sizes.length
    const out = new Float32Array(total * 3)
    for (let i = 0; i < total; i++) {
      const i3 = i * 3
      const sx = startsLocal[i3]
      const sy = startsLocal[i3 + 1]
      const sz = startsLocal[i3 + 2]
      const tgx = data.targets[i3]
      const tgy = data.targets[i3 + 1]
      const tgz = data.targets[i3 + 2]
      const segLen = Math.hypot(tgx - sx, tgy - sy, tgz - sz)
      const swoopMag = segLen * (0.28 + (data.seeds[i] % 1) * 0.5)
      out[i3] = (sx + tgx) / 2 + data.swoop[i3] * swoopMag
      out[i3 + 1] = (sy + tgy) / 2 + data.swoop[i3 + 1] * swoopMag
      out[i3 + 2] = (sz + tgz) / 2 + data.swoop[i3 + 2] * swoopMag * 0.4
    }
    return out
  }, [data, startsLocal])

  // splits particles into the sphere group and the flat-dot group, and
  // records where each particle's result lands within its group's buffer
  const groups = useMemo(() => {
    const total = data.sizes.length
    const slot = new Int32Array(total)
    let sphereCount = 0
    let dotCount = 0
    for (let i = 0; i < total; i++) {
      if (data.isSphere[i]) slot[i] = sphereCount++
      else slot[i] = dotCount++
    }
    return { slot, sphereCount, dotCount }
  }, [data])

  const dotPositions = useMemo(() => new Float32Array(groups.dotCount * 3), [groups])
  const dotSizes = useMemo(() => new Float32Array(groups.dotCount), [groups])
  const dotSeeds = useMemo(() => {
    const arr = new Float32Array(groups.dotCount)
    for (let i = 0; i < data.sizes.length; i++) {
      if (!data.isSphere[i]) arr[groups.slot[i]] = data.seeds[i]
    }
    return arr
  }, [data, groups])

  const dotGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(dotSizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(dotSeeds, 1))
    return geo
  }, [dotPositions, dotSizes, dotSeeds])

  const trailGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_POOL * 3), 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(TRAIL_POOL), 1))
    const seeds = new Float32Array(TRAIL_POOL)
    for (let i = 0; i < TRAIL_POOL; i++) seeds[i] = Math.random()
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useEffect(() => {
    introDone.current = false
  }, [data, layout])

  useEffect(() => {
    if (groupRef.current) groupRef.current.position.set(layout.anchorWorldX, layout.anchorWorldY, 0)
  }, [layout])

  useEffect(() => {
    const res = [gl.domElement.width, gl.domElement.height]
    if (sphereMatRef.current) sphereMatRef.current.uniforms.uResolution.value.set(...res)
    if (dotMatRef.current) dotMatRef.current.uniforms.uResolution.value.set(...res)
    if (trailMatRef.current) trailMatRef.current.uniforms.uResolution.value.set(...res)
    if (trailSphereMatRef.current) trailSphereMatRef.current.uniforms.uResolution.value.set(...res)
  }, [size, gl])

  const sphereUniforms = useMemo(
    () => ({
      uMap: { value: photoTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
    }),
    [photoTexture, imageAspect]
  )
  const dotUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMap: { value: photoTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
    }),
    [photoTexture, imageAspect]
  )
  const trailUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMap: { value: photoTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
    }),
    [photoTexture, imageAspect]
  )
  const trailSphereUniforms = useMemo(
    () => ({
      uMap: { value: photoTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
    }),
    [photoTexture, imageAspect]
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    currentTimeRef.current = t

    if (!introDone.current && meshRef.current) {
      let allArrived = true
      const wobbleAmp = 0.09 * layout.scaleFactor
      const radiusUnit = 0.0028 * layout.scaleFactor
      for (let i = 0; i < data.delays.length; i++) {
        const local = (t - data.delays[i]) / INTRO_DURATION
        if (local < 1) allArrived = false
        const clamped = Math.min(Math.max(local, 0), 1)
        const eased = easeOutCubic(clamped)
        const i3 = i * 3
        const omt = 1 - eased
        const bx = omt * omt * startsLocal[i3] + 2 * omt * eased * controlsLocal[i3] + eased * eased * data.targets[i3]
        const by = omt * omt * startsLocal[i3 + 1] + 2 * omt * eased * controlsLocal[i3 + 1] + eased * eased * data.targets[i3 + 1]
        const bz = omt * omt * startsLocal[i3 + 2] + 2 * omt * eased * controlsLocal[i3 + 2] + eased * eased * data.targets[i3 + 2]
        const flutter = (1 - eased) * wobbleAmp
        const seed = data.seeds[i]
        const px = bx + Math.sin(t * 3.2 + seed * 6.283) * flutter
        const py = by + Math.cos(t * 2.6 + seed * 9.42) * flutter
        const pz = bz
        const growth = 0.2 + 0.8 * eased

        if (data.isSphere[i]) {
          dummy.position.set(px, py, pz)
          dummy.scale.setScalar(data.sizes[i] * growth * radiusUnit)
          dummy.updateMatrix()
          meshRef.current.setMatrixAt(groups.slot[i], dummy.matrix)
        } else {
          const s3 = groups.slot[i] * 3
          dotPositions[s3] = px
          dotPositions[s3 + 1] = py
          dotPositions[s3 + 2] = pz
          dotSizes[groups.slot[i]] = data.sizes[i] * growth
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      dotGeometry.attributes.position.needsUpdate = true
      dotGeometry.attributes.aSize.needsUpdate = true
      if (allArrived && t > INTRO_MAX_DELAY + INTRO_DURATION) introDone.current = true
    } else if (meshRef.current) {
      // idle: settled dots get a continuous ambient flicker (flame/breeze
      // fringe around the edge), and everything gets a small temporary
      // repel away from the cursor while it hovers over the box, springing
      // back once the cursor leaves
      repelIntensity.current += ((hoveringBox.current && !isDragging.current ? 1 : 0) - repelIntensity.current) * 0.08
      let repelLocal = null
      if (repelIntensity.current > 0.01 && frameRectRef.current && groupRef.current) {
        groupRef.current.updateMatrixWorld()
        const world = pxToWorld(mouseClient.current.x, mouseClient.current.y, frameRectRef.current)
        repelVecTmp.set(world.x, world.y, 0)
        groupRef.current.worldToLocal(repelVecTmp)
        repelLocal = repelVecTmp
      }
      const radiusUnit = 0.0028 * layout.scaleFactor
      const flutterAmp = 0.16 * layout.scaleFactor
      const repelRadius = REPEL_RADIUS * layout.scaleFactor
      const repelStrength = REPEL_STRENGTH * layout.scaleFactor

      for (let i = 0; i < data.delays.length; i++) {
        const i3 = i * 3
        let px = data.targets[i3]
        let py = data.targets[i3 + 1]
        const pz = data.targets[i3 + 2]

        if (!data.isSphere[i]) {
          const w = data.edgeWeight[i]
          const seed = data.seeds[i]
          px += Math.sin(t * 0.7 + seed * 6.283) * flutterAmp * w
          py += Math.cos(t * 0.55 + seed * 9.42) * flutterAmp * w
        }

        // magnify bulge: particles near the cursor push outward and grow
        // larger, like a lens, tapering smoothly back to normal at the edge
        let magnify = 1
        if (repelLocal) {
          const dx = px - repelLocal.x
          const dy = py - repelLocal.y
          const dist = Math.hypot(dx, dy)
          if (dist < repelRadius && dist > 0.0001) {
            const bulge = 1 - dist / repelRadius
            const bulge2 = bulge * bulge
            const push = bulge2 * repelStrength * repelIntensity.current
            px += (dx / dist) * push
            py += (dy / dist) * push
            magnify = 1 + MAGNIFY_BOOST * bulge2 * repelIntensity.current
          }
        }

        if (data.isSphere[i]) {
          dummy.position.set(px, py, pz)
          dummy.scale.setScalar(data.sizes[i] * radiusUnit * magnify)
          dummy.updateMatrix()
          meshRef.current.setMatrixAt(groups.slot[i], dummy.matrix)
        } else {
          const s3 = groups.slot[i] * 3
          const w = data.edgeWeight[i]
          const seed = data.seeds[i]
          dotPositions[s3] = px
          dotPositions[s3 + 1] = py
          dotPositions[s3 + 2] = pz
          dotSizes[groups.slot[i]] = data.sizes[i] * (1 + 0.35 * w * Math.sin(t * 2.6 + seed * 5.1)) * magnify
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      dotGeometry.attributes.position.needsUpdate = true
      dotGeometry.attributes.aSize.needsUpdate = true
    }

    // trail markers in the side background zones — spawned on mousemove,
    // rendered here as a short-lived fading/growing-then-shrinking reveal
    {
      const posAttr = trailGeometry.attributes.position
      const sizeAttr = trailGeometry.attributes.aSize
      for (let i = 0; i < TRAIL_POOL; i++) {
        const slot = trailSlots.current[i]
        if (!slot.active) {
          sizeAttr.array[i] = 0
          continue
        }
        const age = t - slot.spawnTime
        if (age > TRAIL_LIFETIME) {
          slot.active = false
          sizeAttr.array[i] = 0
          continue
        }
        const lifeT = Math.min(age / TRAIL_LIFETIME, 1)
        const envelope = Math.sin(lifeT * Math.PI)
        posAttr.array[i * 3] = slot.x
        posAttr.array[i * 3 + 1] = slot.y
        posAttr.array[i * 3 + 2] = slot.z
        sizeAttr.array[i] = slot.baseSize * envelope
      }
      posAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
    }

    // trail spheres — same spawn stream as the trail dots, some fraction
    // rendered as tiny shaded spheres so the background reveal reads with
    // the same mixed spheres+dots character as the logo itself
    if (trailSphereMeshRef.current) {
      for (let i = 0; i < TRAIL_SPHERE_POOL; i++) {
        const slot = trailSphereSlots.current[i]
        if (!slot.active) {
          dummy.position.set(0, 0, -9999)
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          trailSphereMeshRef.current.setMatrixAt(i, dummy.matrix)
          continue
        }
        const age = t - slot.spawnTime
        if (age > TRAIL_LIFETIME) {
          slot.active = false
          dummy.position.set(0, 0, -9999)
          dummy.scale.setScalar(0)
          dummy.updateMatrix()
          trailSphereMeshRef.current.setMatrixAt(i, dummy.matrix)
          continue
        }
        const lifeT = Math.min(age / TRAIL_LIFETIME, 1)
        const envelope = Math.sin(lifeT * Math.PI)
        dummy.position.set(slot.x, slot.y, slot.z)
        dummy.scale.setScalar(slot.baseSize * envelope)
        dummy.updateMatrix()
        trailSphereMeshRef.current.setMatrixAt(i, dummy.matrix)
      }
      trailSphereMeshRef.current.instanceMatrix.needsUpdate = true
    }

    if (groupRef.current) {
      // ambient swing continues underneath; drag adds a persistent offset
      // on top, so nudging it keeps swinging from wherever you left it
      groupRef.current.rotation.y = swingAngle(t) + dragOffset.current.yaw
      groupRef.current.rotation.x = dragOffset.current.pitch
    }
    if (dotMatRef.current) dotMatRef.current.uniforms.uTime.value = t
    if (trailMatRef.current) trailMatRef.current.uniforms.uTime.value = t
  })

  return (
    <>
      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, groups.sphereCount]}>
          <sphereGeometry args={[1, 8, 6]} />
          <shaderMaterial ref={sphereMatRef} vertexShader={SPHERE_VERTEX} fragmentShader={SPHERE_FRAGMENT} uniforms={sphereUniforms} />
        </instancedMesh>
        <points geometry={dotGeometry}>
          <shaderMaterial
            ref={dotMatRef}
            vertexShader={DOT_VERTEX}
            fragmentShader={DOT_FRAGMENT}
            uniforms={dotUniforms}
            transparent
            depthWrite={false}
            blending={THREE.NormalBlending}
          />
        </points>
      </group>
      {/* cursor-follow reveal trail in the side background zones — not part of
          the rotating group, positioned directly in world/screen space */}
      <points geometry={trailGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={trailMatRef}
          vertexShader={DOT_VERTEX}
          fragmentShader={DOT_FRAGMENT}
          uniforms={trailUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.NormalBlending}
        />
      </points>
      <instancedMesh ref={trailSphereMeshRef} args={[undefined, undefined, TRAIL_SPHERE_POOL]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <shaderMaterial ref={trailSphereMatRef} vertexShader={SPHERE_VERTEX} fragmentShader={SPHERE_FRAGMENT} uniforms={trailSphereUniforms} depthTest={false} />
      </instancedMesh>
    </>
  )
}

function CameraRig({ anchorPx }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const scaleFactor = Math.max(size.height / anchorPx.boxHeight, 0.0001)
    camera.position.set(0, 0, BASE_DISTANCE * scaleFactor)
    camera.fov = BASE_FOV
    camera.updateProjectionMatrix()
  }, [camera, size, anchorPx])
  return null
}

const REVEAL_PHOTO = '/images/photos/field-maize-rows.jpg'

// Loads the fixed reveal photo and its aspect ratio inside the R3F tree
// (needs Suspense for useLoader) before handing off to the particle cloud.
function PhotoParticles({ data, anchorPx, boxRef, heroFrameRef }) {
  const photoTexture = useLoader(THREE.TextureLoader, REVEAL_PHOTO)
  const imageAspect = photoTexture.image.width / photoTexture.image.height
  return (
    <ParticleCloud
      data={data}
      anchorPx={anchorPx}
      boxRef={boxRef}
      heroFrameRef={heroFrameRef}
      photoTexture={photoTexture}
      imageAspect={imageAspect}
    />
  )
}

export default function HeroLeafParticles({ anchorPx, boxRef, heroFrameRef }) {
  const data = useLogoParticles('/images/logo-green.png', 21000)
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        {anchorPx && <CameraRig anchorPx={anchorPx} />}
        {data && anchorPx && <PhotoParticles data={data} anchorPx={anchorPx} boxRef={boxRef} heroFrameRef={heroFrameRef} />}
      </Suspense>
    </Canvas>
  )
}
