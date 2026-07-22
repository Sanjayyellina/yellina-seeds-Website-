import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute float aTint;
  uniform float uTime;
  varying float vTint;
  varying float vTwinkle;
  void main() {
    vTint = aTint;
    float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831);
    vTwinkle = tw;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * tw * (9.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vTint;
  varying float vTwinkle;
  uniform vec3 uColorDark;
  uniform vec3 uColorGold;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float falloff = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorDark, uColorGold, vTint);
    gl_FragColor = vec4(color, falloff * (0.55 + 0.45 * vTwinkle));
  }
`

const BASE_DISTANCE = 3.2
const BASE_FOV = 34

// Samples the real logo's alpha channel into a point cloud, and precomputes a
// swooping bezier control point per particle for the "blown in on the wind"
// flight path — particles arc in rather than travel in straight lines.
function useLogoParticles(src, count = 3600) {
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

      const candidates = []
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = px[(y * w + x) * 4 + 3]
          if (alpha > 80) candidates.push([x, y])
        }
      }

      const total = Math.min(count, candidates.length)
      const targets = new Float32Array(total * 3)
      const sizes = new Float32Array(total)
      const seeds = new Float32Array(total)
      const tints = new Float32Array(total)
      const delays = new Float32Array(total)
      // edge-anchored direction each particle flies in from, stored as a unit
      // vector + margin so the actual world position can be resolved once the
      // viewport/anchor is known (see resolveEdgeStarts below)
      const edgeDir = new Float32Array(total * 2)
      const swoop = new Float32Array(total * 3)

      for (let i = 0; i < total; i++) {
        const idx = Math.floor((i / total) * candidates.length + (Math.random() * candidates.length) / total) % candidates.length
        const [px_, py_] = candidates[idx]
        const nx = (px_ / w - 0.5) * 2.4
        const ny = -(py_ / h - 0.5) * 2.4 * (h / w)
        targets[i * 3] = nx + (Math.random() - 0.5) * 0.02
        targets[i * 3 + 1] = ny + (Math.random() - 0.5) * 0.02
        targets[i * 3 + 2] = (Math.random() - 0.5) * 0.14

        const angle = Math.random() * Math.PI * 2
        edgeDir[i * 2] = Math.cos(angle)
        edgeDir[i * 2 + 1] = Math.sin(angle)

        const swoopAngle = Math.random() * Math.PI * 2
        swoop[i * 3] = Math.cos(swoopAngle)
        swoop[i * 3 + 1] = Math.sin(swoopAngle)
        swoop[i * 3 + 2] = (Math.random() - 0.5) * 0.7

        sizes[i] = 2.2 + Math.random() * 3.2
        seeds[i] = Math.random()
        tints[i] = Math.random() > 0.88 ? 1 : 0
        delays[i] = Math.random() * 0.9
      }
      setData({ targets, edgeDir, swoop, sizes, seeds, tints, delays })
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

// Degrees of swing to each side from center. Kept well under 90° so the
// cloud never goes edge-on/flat — it always reads as the leaf shape.
const SWING_AMPLITUDE = (70 * Math.PI) / 180
const SWING_PERIOD = 22 // seconds for one full left-right-left cycle
const MOUSE_YAW = (18 * Math.PI) / 180
const MOUSE_TILT = (10 * Math.PI) / 180

function ParticleCloud({ data, anchorPx }) {
  const { size } = useThree()
  const groupRef = useRef()
  const matRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })
  const introDone = useRef(false)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

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
      // push to whichever screen edge this direction reaches first
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

  const liveGeo = useMemo(() => ({
    positions: startsLocal.slice(),
    sizes: new Float32Array(data.sizes.length),
  }), [data, startsLocal])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(liveGeo.positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(liveGeo.sizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1))
    geo.setAttribute('aTint', new THREE.BufferAttribute(data.tints, 1))
    return geo
  }, [data, liveGeo])

  useEffect(() => {
    introDone.current = false
  }, [data, layout])

  useEffect(() => {
    if (groupRef.current) groupRef.current.position.set(layout.anchorWorldX, layout.anchorWorldY, 0)
  }, [layout])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDark: { value: new THREE.Color('#2F8B49') },
      uColorGold: { value: new THREE.Color('#C9A227') },
    }),
    []
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (!introDone.current) {
      const posAttr = geometry.attributes.position
      const sizeAttr = geometry.attributes.aSize
      let allArrived = true
      const wobbleAmp = 0.09 * layout.scaleFactor
      for (let i = 0; i < data.delays.length; i++) {
        const local = (t - data.delays[i]) / INTRO_DURATION
        if (local < 1) allArrived = false
        const clamped = Math.min(Math.max(local, 0), 1)
        const eased = easeOutCubic(clamped)
        const i3 = i * 3
        const omt = 1 - eased
        // quadratic bezier: start -> swoop control -> target
        const bx = omt * omt * startsLocal[i3] + 2 * omt * eased * controlsLocal[i3] + eased * eased * data.targets[i3]
        const by = omt * omt * startsLocal[i3 + 1] + 2 * omt * eased * controlsLocal[i3 + 1] + eased * eased * data.targets[i3 + 1]
        const bz = omt * omt * startsLocal[i3 + 2] + 2 * omt * eased * controlsLocal[i3 + 2] + eased * eased * data.targets[i3 + 2]
        // decaying flutter riding the path, like a gust — fades out on arrival
        const flutter = (1 - eased) * wobbleAmp
        const seed = data.seeds[i]
        posAttr.array[i3] = bx + Math.sin(t * 3.2 + seed * 6.283) * flutter
        posAttr.array[i3 + 1] = by + Math.cos(t * 2.6 + seed * 9.42) * flutter
        posAttr.array[i3 + 2] = bz
        sizeAttr.array[i] = data.sizes[i] * (0.2 + 0.8 * eased)
      }
      posAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
      if (allArrived && t > INTRO_MAX_DELAY + INTRO_DURATION) introDone.current = true
    }

    smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.05
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.05
    if (groupRef.current) {
      const swing = Math.sin((t / SWING_PERIOD) * Math.PI * 2) * SWING_AMPLITUDE
      groupRef.current.rotation.y = swing + smoothed.current.x * MOUSE_YAW
      groupRef.current.rotation.x = -smoothed.current.y * MOUSE_TILT
    }
    if (matRef.current) matRef.current.uniforms.uTime.value = t
  })

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          ref={matRef}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
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

export default function HeroLeafParticles({ anchorPx }) {
  const data = useLogoParticles('/images/logo-green.png', 6500)
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        {anchorPx && <CameraRig anchorPx={anchorPx} />}
        {data && anchorPx && <ParticleCloud data={data} anchorPx={anchorPx} />}
      </Suspense>
    </Canvas>
  )
}
