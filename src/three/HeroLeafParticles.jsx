import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HERO_BG_IMAGE } from '../data/heroImage.js'

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
    // the blades are open sheets drawn on both sides, so a back face arrives
    // with its normal pointing away — without flipping it those leaves shade
    // as though unlit and the mark comes out blotchy
    if (!gl_FrontFacing) n = -n;
    float diff = max(dot(n, normalize(vec3(0.45, 0.6, 0.65))), 0.0);
    float diff2 = max(dot(n, normalize(vec3(-0.4, -0.2, -0.3))), 0.0) * 0.3;
    float light = 0.6 + diff * 0.65 + diff2;
    gl_FragColor = vec4(texColor * light, 1.0);
  }
`

// The outline every leaf in here is cut from, flat or solid. y runs -1 at the
// stem to +1 at the tip, and the return value is the blade's half-width there.
//
// The two exponents are the whole trick, and the reason this reads as a leaf
// where a symmetric lens (the obvious "two overlapping circles" shape) reads as
// an almond: the tip exponent is the larger of the two, so the tip closes to a
// real point while the base stays blunt, and the widest span lands about a
// third of the way below centre — exactly where it sits on a real blade.
const LEAF_SHAPE = /* glsl */ `
  float leafHalfWidth(float y) {
    float toTip  = clamp((1.0 - y) * 0.5, 0.0, 1.0);
    float toBase = clamp((1.0 + y) * 0.5, 0.0, 1.0);
    return 1.15 * pow(toTip, 0.85) * pow(toBase, 0.42);
  }
`

const DOT_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  varying float vTwinkle;
  varying vec2 vRot;
  varying float vCurl;
  void main() {
    float tw = 0.55 + 0.45 * sin(uTime * 1.6 + aSeed * 6.2831);
    vTwinkle = tw;
    // its own resting angle, drifting a couple of degrees as if on a breeze
    float a = aSeed * 6.2831 + sin(uTime * 0.45 + aSeed * 11.0) * 0.18;
    vRot = vec2(cos(a), sin(a));
    // and its own curve, signed so roughly half the blades bend the other way
    vCurl = (fract(aSeed * 37.0) - 0.5) * 0.44;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // a blade fills far less of its sprite than a disc did, so the sprite grows
    // to keep the cloud's density where it was
    gl_PointSize = aSize * tw * (13.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`
const DOT_FRAGMENT = /* glsl */ `
  precision mediump float;
  varying float vTwinkle;
  varying vec2 vRot;
  varying float vCurl;
  uniform sampler2D uMap;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  ${LEAF_SHAPE}
  void main() {
    vec2 p = (gl_PointCoord - vec2(0.5)) * 2.0;
    p.y = -p.y;                 // gl_PointCoord grows downward; put the tip up
    // into the blade's own frame, then bend it along its length
    p = vec2(p.x * vRot.x + p.y * vRot.y, -p.x * vRot.y + p.y * vRot.x);
    p.x -= vCurl * (1.0 - p.y * p.y);

    if (abs(p.y) > 1.0) discard;
    // guarded so the vanishing width at each end can't blow up the divide —
    // it narrowing to nothing is what gives the tip its point for free
    float w = max(leafHalfWidth(p.y), 0.004);
    float acrossBlade = abs(p.x) / w;
    if (acrossBlade > 1.0) discard;
    float alpha = smoothstep(1.0, 0.70, acrossBlade);
    float midrib = smoothstep(0.26, 0.0, acrossBlade);

    vec2 screenUV = gl_FragCoord.xy / uResolution;
    float sAR = uResolution.x / uResolution.y;
    float iAR = uImageAspect;
    vec2 ratio = vec2(min(sAR / iAR, 1.0), min(iAR / sAR, 1.0));
    vec2 coverUV = vec2(
      screenUV.x * ratio.x + (1.0 - ratio.x) * 0.5,
      screenUV.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    vec3 texColor = texture2D(uMap, coverUV).rgb;
    // the vein catching a little more light is most of what makes a small green
    // shape read as a leaf rather than a smudge
    vec3 col = texColor * (0.82 + 0.18 * vTwinkle) * (1.0 + midrib * 0.16);
    gl_FragColor = vec4(col, alpha);
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
// Only ever needs to reach far enough for the dome factor to saturate, which
// happens about 5px in (REF_EDGE_DIST over the world-per-pixel scale). Marching
// to 26 was ~3x the work for a result that clamped to the same value, and this
// loop runs 21k times before the logo can appear — it is the main thing standing
// between page load and the formation starting.
const MAX_RAY = 8

// Samples the real logo's alpha channel into a point cloud. Each point also
// gets an approximate distance-to-silhouette-edge (via short ray marches),
// which drives (a) a domed thickness profile — sharp at the outline, thick
// through the core, for genuine curved 3D volume — (b) whether it's a sphere
// or a flat dot: deep-interior points are bigger spheres, fading out toward
// dots near the edge — and (c) an "edge weight" used for a continuous ambient
// flicker on the outermost dots, like flames/breeze around the silhouette. A
// swooping bezier control point per particle gives the "blown in on the wind"
// flight path on arrival.
// Keeps trying to load the logo mask until it actually succeeds — on a slow
// or flaky mobile connection a plain <img onerror> is not enough, since a
// stalled request may never fire load OR error. Each attempt gets its own
// timeout; a fresh Image() + cache-busted URL is retried with backoff
// (capped) until it lands, so the logo eventually forms no matter how bad
// the connection is, instead of silently never forming at all.
function loadImageForever(src, onSuccess, isCancelled) {
  let attempt = 0
  const attemptLoad = () => {
    if (isCancelled()) return
    const img = new Image()
    // Deliberately NOT crossOrigin. These assets are same-origin, so the canvas
    // never gets tainted — and asking for CORS here would put this fetch in a
    // different HTTP cache bucket from the same file requested by the nav <img>
    // and the CSS background, which meant the browser downloaded each of them
    // twice on a cold load.
    let settled = false
    const timeoutMs = Math.min(5000 + attempt * 1500, 12000)
    const timer = setTimeout(() => {
      if (settled || isCancelled()) return
      settled = true
      img.onload = null
      img.onerror = null
      scheduleRetry()
    }, timeoutMs)
    img.onload = () => {
      if (settled || isCancelled()) return
      settled = true
      clearTimeout(timer)
      onSuccess(img)
    }
    img.onerror = () => {
      if (settled || isCancelled()) return
      settled = true
      clearTimeout(timer)
      scheduleRetry()
    }
    img.src = attempt === 0 ? src : `${src}${src.includes('?') ? '&' : '?'}retry=${attempt}`
  }
  const scheduleRetry = () => {
    attempt++
    setTimeout(() => {
      if (!isCancelled()) attemptLoad()
    }, Math.min(600 * attempt, 8000))
  }
  attemptLoad()
}

function useLogoParticles(src, count = 9000) {
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadImageForever(
      src,
      (img) => {
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

        // Bowed by a shared prevailing wind rather than a uniformly random
        // direction: with every particle bowing its own way the arrival read as
        // a swarm converging, where leaves caught in one gust all bend broadly
        // the same way. The spread keeps it from looking mechanical.
        const swoopAngle = 2.55 + (Math.random() - 0.5) * 2.0
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
        delays[i] = Math.random() * INTRO_MAX_DELAY
      }
      setData({ targets, edgeDir, swoop, sizes, seeds, delays, isSphere, edgeWeight })
      },
      () => cancelled
    )
    return () => { cancelled = true }
  }, [src, count])

  return data
}

// The flight is the whole point now, not a transition to get past — leaves come
// in off the page edges and take their time about it. Stagger plus flight lands
// the last arrival around 3.6s, and because the stagger is a good fraction of
// the flight, there are always leaves still on their way in while others have
// already landed, which is what stops it looking like one synchronised swarm.
const INTRO_DURATION = 2.8 // seconds each particle takes to arrive, once its delay elapses
const INTRO_MAX_DELAY = 0.8 // random per-particle stagger, spread over this many seconds

// Cubic rather than quartic. Over a flight this long a quartic launches too
// hard and then crawls; cubic keeps the leaf moving through the middle of its
// arc, where the tumble and the curve are actually visible.
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
const SWING_AMPLITUDE = (30 * Math.PI) / 180
const MOVE_DURATION = 22 // seconds to sweep between center and an extreme
const PAUSE_DURATION = 14 // seconds paused at center each time through
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

// Hover-ripple: particles near the cursor bounce away like knocking into
// them, then spring back to their resting spot — a little underdamped so
// the return has a small bounce/overshoot of its own, like play rather
// than a mechanical snap-back. The push itself ripples outward in time
// rather than hitting the whole radius at once: the nearest particles
// start moving first, and the motion reaches progressively farther ones a
// beat later, like a wave passing through them, before the whole area
// gently subsides again. Only runs while the cursor is actively moving
// (see the movement-gating around isHovering below) — holding it still
// over the logo does nothing.
const REPEL_RADIUS = 0.032
const REPEL_STRENGTH = 3.2
const SPRING_STIFFNESS = 90
const SPRING_DAMPING = 21
const RIPPLE_DELAY_MAX = 0.5 // seconds for the wave to reach the radius edge from the cursor
const RIPPLE_RISE_TIME = 0.35 // seconds for the effect to ease in once the wave reaches a particle

const TRAIL_POOL = 220
const TRAIL_LIFETIME = 1.9 // seconds — how far the tail reaches behind the cursor
const TRAIL_WAVE_AMP = 0.055 // sideways sway amplitude, world units (pre-scale)
const TRAIL_WAVE_FREQ = 1.5 // radians/sec of the sway oscillation
const TRAIL_DRIFT_SPEED = 0.05 // world units/sec carried along the movement direction, like wind
const TRAIL_MIN_SPACING = 10 // px between spawned trail marks
const TRAIL_DOT_SIZE = [14, 9] // [base, random-add] point-size units — kept small

// Once the mark has settled, the trail signs the founder's initials across the
// hero on its own, then afterwards a gust blows through every so often. Both
// reuse the cursor trail wholesale — same pool, same leaves, same fade — so it
// reads as the same wind that follows your pointer, just doing it unprompted.
//
// One unbroken cursive gesture through Y-M-K rather than three separate block
// letters — the pen never lifts, so it flows the way initials are actually
// signed. Anchors run left to right in a box roughly 2.6 wide by 1 tall, with y
// pointing up; the retraces (back down a stem before throwing the next arm) are
// deliberate, since that is what a hand does and it's what stops the shape
// looking like geometry.
const MONOGRAM_ANCHORS = [
  // Y — down into the valley, up the second arm, then the descending tail
  [0.0, 0.94], [0.16, 0.62], [0.31, 0.4], [0.47, 0.72], [0.6, 0.95],
  [0.52, 0.5], [0.45, 0.16], [0.36, 0.0],
  // flick across into the M
  [0.56, 0.06], [0.72, 0.3],
  // M — up, down into the notch, up again, and away
  [0.78, 0.04], [0.86, 0.88], [1.06, 0.34], [1.28, 0.88], [1.38, 0.06],
  // link into the K
  [1.54, 0.14], [1.68, 0.42],
  // K — stem up, retrace down, throw the arm, retrace, then the leg out
  [1.78, 0.04], [1.85, 0.9], [1.85, 0.52], [2.24, 0.86],
  [1.92, 0.46], [2.34, 0.04], [2.44, 0.02],
]
// signatures lean; upright initials read as a logo, not as someone's hand
const MONOGRAM_SLANT = 0.16
const WRITE_START_DELAY = 0.9 // s after the intro settles before the pen starts
const WRITE_DURATION = 2.6 // s to sign all three letters
// How long the finished signature stays up after the last stroke lands. Every
// mark is given a life that expires at this one shared moment rather than a
// fixed span from its own birth, so the whole monogram goes at once instead of
// disappearing stroke by stroke in the order it was written.
const SIGN_HOLD = 3.4
const BREEZE_FIRST_DELAY = 5.0 // s after signing before the first gust
const BREEZE_INTERVAL = 13.0 // s between gusts
const BREEZE_DURATION = 5.2 // s for a gust to cross the hero — slow reads as air

// Ambient floating dots — a dense field of small motes licking upward from
// across the whole logo shape, like the leaf itself is gently on fire. Each
// one only climbs a short distance before fading back out (a flame tip, not
// a mote drifting off into the sky), so the effect hugs the silhouette
// instead of dissipating upward and away. Independent of mouse/drag.
const FLOAT_POOL = 280
const FLOAT_LIFETIME = 1.6 // seconds for one full rise-and-fade cycle
const FLOAT_RISE = 0.3 // world units climbed over one lifetime — a short lick, not a long drift
const FLOAT_DRIFT = 0.1 // subtle sideways flicker amplitude

function ParticleCloud({ data, anchorPx, boxRef, heroFrameRef, photoTexture, imageAspect }) {
  const { size, gl } = useThree()
  const groupRef = useRef()
  const meshRef = useRef()
  const sphereMatRef = useRef()
  const dotMatRef = useRef()
  const trailMatRef = useRef()
  const floatMatRef = useRef()
  const introDone = useRef(false)
  const introStartTime = useRef(null)
  const swingStartTime = useRef(null)

  const hoveringBox = useRef(false)
  const isDragging = useRef(false)
  const dragLast = useRef({ x: 0, y: 0 })
  const dragOffset = useRef({ yaw: 0, pitch: 0 })
  const currentTimeRef = useRef(0)
  const mouseClient = useRef({ x: -9999, y: -9999 })
  const lastMouseClient = useRef({ x: -9999, y: -9999 })
  const frameRectRef = useRef(null)
  const repelIntensity = useRef(0)
  const hoverElapsed = useRef(0)
  const repelVecTmp = useMemo(() => new THREE.Vector3(), [])
  const repelOriginTmp = useMemo(() => new THREE.Vector3(), [])
  const repelDirTmp = useMemo(() => new THREE.Vector3(), [])
  const repelInvQuatTmp = useMemo(() => new THREE.Quaternion(), [])
  const lastSpawn = useRef({ x: null, y: null })
  const trailSlots = useRef(
    Array.from({ length: TRAIL_POOL }, () => ({
      active: false,
      x: 0,
      y: 0,
      z: 0,
      spawnTime: -999,
      baseSize: 0,
      dirX: 1,
      dirY: 0,
      seed: 0,
      life: TRAIL_LIFETIME,
      hold: false,
    }))
  )
  const trailCursor = useRef(0)

  // Held in a ref and refreshed each render so both the pointer handler (inside
  // an effect that must not re-subscribe on every layout change) and the frame
  // loop can spawn through the exact same path.
  const spawnTrail = useRef(null)
  spawnTrail.current = (worldX, worldY, dirX, dirY, count = 2, life = TRAIL_LIFETIME, hold = false, sizeScale = 1) => {
    for (let n = 0; n < count; n++) {
      const slot = trailSlots.current[trailCursor.current]
      slot.active = true
      slot.x = worldX
      slot.y = worldY
      slot.z = (Math.random() - 0.5) * 0.05
      slot.spawnTime = currentTimeRef.current
      slot.baseSize =
        (TRAIL_DOT_SIZE[0] + Math.random() * TRAIL_DOT_SIZE[1]) * layout.scaleFactor * sizeScale
      slot.dirX = dirX
      slot.dirY = dirY
      slot.seed = Math.random() * Math.PI * 2
      slot.life = life
      slot.hold = hold
      trailCursor.current = (trailCursor.current + 1) % TRAIL_POOL
    }
  }

  // Where the signing pen has got to, and when the next gust is due.
  const autoTrail = useRef({ settledAt: null, penIndex: 0, gustAt: null, gustIndex: 0, gustSeed: 0, gustAngle: 0, gustCX: 0, gustCY: 0 })

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

  // The strip of hero that the mark doesn't occupy, between its base and the
  // bottom edge. Both the signature and the gusts live in here so neither ever
  // has to compete with the logo for the same pixels.
  // The mark's own footprint, as an ellipse in world space. The gusts cross the
  // whole hero but skip anything that falls inside this, so the wind reads as
  // flowing around the logo instead of straight through it.
  const logoFootprint = useMemo(() => {
    const boxH = anchorPx.boxHeight
    const boxW = boxH * (456 / 371)
    return {
      cx: layout.anchorWorldX,
      cy: layout.anchorWorldY,
      // 0.82 because the measured box is the spacer, which is a little larger
      // than the visible mark inside it
      rx: (boxW / size.width) * layout.halfWidth * 0.82,
      ry: (boxH / size.height) * layout.halfHeight * 0.82,
    }
  }, [layout, anchorPx, size])

  const outsideLogo = (x, y) => {
    const dx = (x - logoFootprint.cx) / logoFootprint.rx
    const dy = (y - logoFootprint.cy) / logoFootprint.ry
    return dx * dx + dy * dy > 1
  }

  // The monogram as one ordered list of evenly spaced world-space points.
  // Three passes: place and slant the anchors, round the corners off with a
  // Catmull-Rom spline so the gesture curves instead of turning in hard angles,
  // then walk that curve at a fixed step so the leaves land evenly however
  // sharply it happens to be turning. Precomputing all of it means the frame
  // loop only advances an index, and the pen keeps one constant speed.
  const penPath = useMemo(() => {
    // Wide and generous — these are the founder's initials, so legibility beats
    // subtlety. The aspect is held while clamping to the hero's width, so a
    // narrow window shrinks the whole monogram instead of squashing it.
    const ASPECT = 3.2
    let height = layout.halfHeight * 0.42
    let width = height * ASPECT
    const maxWidth = layout.halfWidth * 1.7
    if (width > maxWidth) {
      width = maxWidth
      height = width / ASPECT
    }

    // Signed straight across the company name — measured, not guessed, so it
    // follows the wordmark wherever the layout puts it. The glyph anchors run
    // roughly -0.2 to 0.95 about the baseline, so the baseline is dropped by
    // just under half that span to sit the monogram centred on the name.
    const wordmarkY =
      anchorPx.wordmarkCenter != null
        ? -((anchorPx.wordmarkCenter / size.height) * 2 - 1) * layout.halfHeight
        : logoFootprint.cy - logoFootprint.ry
    const baseY = wordmarkY - height * 0.38
    const originX = layout.anchorWorldX - width / 2

    // measured off the anchors rather than hardcoded, so editing the gesture
    // (dropping the closing flourish, say) can't quietly leave the monogram
    // scaled against a span it no longer has
    let spanMin = Infinity
    let spanMax = -Infinity
    for (const [ax] of MONOGRAM_ANCHORS) {
      if (ax < spanMin) spanMin = ax
      if (ax > spanMax) spanMax = ax
    }
    const spanX = Math.max(spanMax - spanMin, 0.0001)

    const placed = MONOGRAM_ANCHORS.map(([ax, ay]) => ({
      x: originX + ((ax - spanMin) / spanX) * width + ay * height * MONOGRAM_SLANT,
      y: baseY + ay * height,
    }))

    // Catmull-Rom through the anchors
    const at = (i) => placed[Math.max(0, Math.min(placed.length - 1, i))]
    const curve = []
    for (let i = 0; i < placed.length - 1; i++) {
      const p0 = at(i - 1)
      const p1 = at(i)
      const p2 = at(i + 1)
      const p3 = at(i + 2)
      for (let s = 0; s < 12; s++) {
        const t = s / 12
        const t2 = t * t
        const t3 = t2 * t
        curve.push({
          x:
            0.5 *
            (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
              (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          y:
            0.5 *
            (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
              (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
        })
      }
    }
    curve.push(placed[placed.length - 1])

    // Resampled at a fixed step so stroke density doesn't bunch on the curves.
    // Stepped wider than the stroke is thick on purpose: the letters read better
    // as a line of separate leaves with air between them than as a solid ribbon,
    // where neighbouring blades merge and the strokes close up.
    const spacing = 0.05 * layout.scaleFactor
    const points = [{ ...curve[0], penDown: false }]
    let carried = 0
    for (let i = 1; i < curve.length; i++) {
      const a = curve[i - 1]
      const b = curve[i]
      const segLen = Math.hypot(b.x - a.x, b.y - a.y)
      if (segLen < 1e-6) continue
      let travelled = spacing - carried
      while (travelled <= segLen) {
        const f = travelled / segLen
        points.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, penDown: true })
        travelled += spacing
      }
      carried = segLen - (travelled - spacing)
    }
    return points
  }, [layout, anchorPx, size, logoFootprint])

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
      // movement direction (screen space, Y flipped to match world/NDC's
      // up-positive Y) — each mark rides this heading outward as it sways,
      // like it's being carried off on the wind it was drawn into
      let dirX = 1
      let dirY = 0
      if (last.x !== null) {
        const ddx = e.clientX - last.x
        const ddy = -(e.clientY - last.y)
        const dlen = Math.hypot(ddx, ddy)
        if (dlen > 0.0001) {
          dirX = ddx / dlen
          dirY = ddy / dlen
        }
      }
      lastSpawn.current = { x: e.clientX, y: e.clientY }

      const world = pxToWorld(e.clientX, e.clientY, frameRect)
      // two marks per move, both starting at the same spot — the second
      // trails the first with its own random size/wave pacing, so the
      // reveal reads fuller without just being one thicker trail
      spawnTrail.current(world.x, world.y, dirX, dirY, 2)
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
    // just outside the frame: far enough that leaves cross the edge already
    // moving rather than popping into being on it, but not so far that the first
    // stretch of the flight happens off-screen where nobody can see it
    const margin = 1.14
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
      // Each path bows perpendicular to its *own* approach rather than along one
      // shared wind direction. The shared direction was the reason the arrival
      // looked like it came from a single side: whichever edge a leaf started
      // from, its path curved the same way, so they all ended up sweeping across
      // in one direction. Curving relative to its own run lets leaves arc in
      // from every edge, and biasing the handedness by seed gives the whole
      // flight a gentle swirl instead of random scatter.
      const runX = tgx - sx
      const runY = tgy - sy
      const runLen = Math.hypot(runX, runY) || 1
      const handed = (data.seeds[i] % 1) < 0.62 ? 1 : -1
      const swoopMag = segLen * (0.26 + (data.seeds[i] % 1) * 0.42) * handed
      out[i3] = (sx + tgx) / 2 + (-runY / runLen) * swoopMag
      out[i3 + 1] = (sy + tgy) / 2 + (runX / runLen) * swoopMag
      out[i3 + 2] = (sz + tgz) / 2 + data.swoop[i3 + 2] * Math.abs(swoopMag) * 0.4
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

  // Per-particle elastic scatter state (mass-spring-damper) driving the
  // hover-bounce effect — persists across frames so a displaced particle
  // keeps easing/overshooting back to rest even after the cursor moves on.
  const scatter = useMemo(() => {
    const total = data.sizes.length
    return {
      offsetX: new Float32Array(total),
      offsetY: new Float32Array(total),
      velX: new Float32Array(total),
      velY: new Float32Array(total),
    }
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

  // Static per-particle scatter/timing for the ambient "flame" motes: each
  // one is rooted at a random point sampled from the logo's own particle
  // positions (so they cover the whole silhouette, not just a strip below
  // it), and licks upward a short distance from there on its own timer,
  // looping back to its root once it fades out.
  const floatParticles = useMemo(() => {
    const out = []
    const totalTargets = data.targets.length / 3
    for (let i = 0; i < FLOAT_POOL; i++) {
      const srcIdx = Math.floor(Math.random() * totalTargets)
      const rootX = data.targets[srcIdx * 3]
      const rootY = data.targets[srcIdx * 3 + 1]
      const rootZ = data.targets[srcIdx * 3 + 2]
      out.push({
        baseX: layout.anchorWorldX + rootX,
        baseZ: rootZ,
        bottomY: layout.anchorWorldY + rootY,
        phase: Math.random() * FLOAT_LIFETIME,
        seed: Math.random(),
        size: (0.3 + Math.random() * 0.45) * layout.scaleFactor,
      })
    }
    return out
  }, [data, layout])

  const floatGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(FLOAT_POOL * 3), 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(FLOAT_POOL), 1))
    const seeds = new Float32Array(FLOAT_POOL)
    for (let i = 0; i < FLOAT_POOL; i++) seeds[i] = floatParticles[i].seed
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [floatParticles])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const tumbleEuler = useMemo(() => new THREE.Euler(), [])
  const tumbleQuat = useMemo(() => new THREE.Quaternion(), [])

  // The solid counterpart to the flat blades, cut from the same outline as the
  // shader's leafHalfWidth so the two kinds of leaf are the same shape. Built
  // as a curved sheet rather than a solid of revolution: a lathed teardrop is
  // radially symmetric, which is why it never quite looked like a leaf. This is
  // a real blade — domed across its width, ridged along the midrib, and curled
  // a little down its length so it catches light unevenly the way a leaf does.
  const leafBladeGeometry = useMemo(() => {
    const ROWS = 14
    const COLS = 6
    const halfWidth = (y) => {
      const toTip = Math.max((1 - y) * 0.5, 0)
      const toBase = Math.max((1 + y) * 0.5, 0)
      return 1.15 * Math.pow(toTip, 0.85) * Math.pow(toBase, 0.42)
    }

    const positions = []
    for (let r = 0; r <= ROWS; r++) {
      const y = -1 + (2 * r) / ROWS
      const w = halfWidth(y)
      for (let c = 0; c <= COLS; c++) {
        const u = -1 + (2 * c) / COLS
        // dome scaled by local width, so the narrow ends stay flat instead of
        // pinching into a spike
        const dome = (1 - u * u) * w * 0.34
        const ridge = Math.exp(-(u * u) / 0.02) * 0.05
        const curl = (y * y - 0.35) * 0.12
        positions.push(u * w, y, dome + ridge + curl)
      }
    }

    const indices = []
    const stride = COLS + 1
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const i0 = r * stride + c
        indices.push(i0, i0 + stride, i0 + 1, i0 + 1, i0 + stride, i0 + stride + 1)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    // a blade covers less of its footprint than a sphere of the same scale, so
    // it's widened a touch to keep the mark as dense as it was
    geo.scale(1.3, 1.05, 1.3)
    geo.computeVertexNormals()
    return geo
  }, [])

  useEffect(() => () => leafBladeGeometry.dispose(), [leafBladeGeometry])

  // One resting orientation per blade, taken from its seed so it never changes
  // frame to frame. Spin in the screen plane is free — the blade stays face-on —
  // but the out-of-plane tilt is kept small on purpose: fully random 3D rotation
  // turns too many blades edge-on and thins the mark out into patches.
  const leafQuats = useMemo(() => {
    const out = new Array(groups.sphereCount)
    const euler = new THREE.Euler()
    const quat = new THREE.Quaternion()
    for (let i = 0; i < data.seeds.length; i++) {
      if (!data.isSphere[i]) continue
      const s = data.seeds[i]
      euler.set(Math.sin(s * 31.7) * 0.4, Math.cos(s * 17.3) * 0.4, s * Math.PI * 2)
      out[groups.slot[i]] = quat.setFromEuler(euler).clone()
    }
    return out
  }, [data, groups])

  // Only replay the fly-in when the logo's actual particle data changes —
  // NOT on every `layout` recompute. `layout` depends on the canvas's
  // measured `size`, which changes any time the browser's address bar/toolbar
  // shows or hides — something mobile browsers do constantly on scroll (their
  // "dynamic toolbar" resizing the viewport). Resetting on layout too meant
  // the logo scattered back to the edges and reformed on almost any scroll
  // gesture on mobile. Position/scale still update live via the effect below;
  // only the intro's start/done state must stay put once it has run.
  useEffect(() => {
    introDone.current = false
    introStartTime.current = null
    swingStartTime.current = null
    // so the initials get signed again on a real revisit, not just the once
    autoTrail.current = { settledAt: null, penIndex: 0, gustAt: null, gustIndex: 0, gustSeed: 0, gustAngle: 0, gustCX: 0, gustCY: 0 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useEffect(() => {
    if (groupRef.current) groupRef.current.position.set(layout.anchorWorldX, layout.anchorWorldY, 0)
  }, [layout])

  useEffect(() => {
    const res = [gl.domElement.width, gl.domElement.height]
    if (sphereMatRef.current) sphereMatRef.current.uniforms.uResolution.value.set(...res)
    if (dotMatRef.current) dotMatRef.current.uniforms.uResolution.value.set(...res)
    if (trailMatRef.current) trailMatRef.current.uniforms.uResolution.value.set(...res)
    if (floatMatRef.current) floatMatRef.current.uniforms.uResolution.value.set(...res)
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
  const floatUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMap: { value: photoTexture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: imageAspect },
    }),
    [photoTexture, imageAspect]
  )

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30)
    const t = state.clock.elapsedTime
    currentTimeRef.current = t

    if (!introDone.current && meshRef.current) {
      // anchors the intro to whenever the cloud actually starts running,
      // not to the R3F clock's own t=0 — if the logo mask / photo took a
      // moment to load, the clock is already past 0 by the time we get
      // here, and using it directly would skip that much of the fly-in
      if (introStartTime.current === null) introStartTime.current = t
      const introT = t - introStartTime.current
      let allArrived = true
      // a touch more flutter, since it now has time to be seen
      const wobbleAmp = 0.13 * layout.scaleFactor
      const radiusUnit = 0.0028 * layout.scaleFactor
      for (let i = 0; i < data.delays.length; i++) {
        const local = (introT - data.delays[i]) / INTRO_DURATION
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
        // Leaves start at a bit over half size rather than a fifth. At 0.2 they
        // were effectively specks for most of the flight, which is why the
        // arrival never read as leaves blowing in from the edges — you simply
        // couldn't see them until they were nearly home. Mid-small on the way
        // in, full size once landed.
        const growth = 0.72 + 0.28 * eased

        if (data.isSphere[i]) {
          dummy.position.set(px, py, pz)
          // Tumbling in on the wind, then settling. They're leaves, so arriving
          // at a fixed angle looked like assembly rather than weather; each one
          // now spins on its own axes in flight and eases into its resting
          // angle as it lands (eased² so the settle happens late, near the end).
          if (eased < 1) {
            tumbleEuler.set(
              seed * 11 + t * (2.2 + seed * 3.4),
              seed * 7 + t * (1.6 + seed * 2.6),
              seed * 5 + t * (2.6 + seed * 2.2)
            )
            tumbleQuat.setFromEuler(tumbleEuler)
            dummy.quaternion.copy(tumbleQuat).slerp(leafQuats[groups.slot[i]], eased * eased)
          } else {
            dummy.quaternion.copy(leafQuats[groups.slot[i]])
          }
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
      if (allArrived && introT > INTRO_MAX_DELAY + INTRO_DURATION) {
        introDone.current = true
        swingStartTime.current = t
      }
    } else if (meshRef.current) {
      // idle: settled dots get a continuous ambient flicker (flame/breeze
      // fringe around the edge), and everything gets a little bounce-away
      // ripple while the cursor is actively moving over the logo — holding
      // it still does nothing, gliding back smoothly the moment it stops
      const cursorMoved =
        Math.hypot(mouseClient.current.x - lastMouseClient.current.x, mouseClient.current.y - lastMouseClient.current.y) > 0.4
      lastMouseClient.current = { x: mouseClient.current.x, y: mouseClient.current.y }
      const isHovering = hoveringBox.current && !isDragging.current && cursorMoved
      repelIntensity.current += ((isHovering ? 1 : 0) - repelIntensity.current) * 0.08
      // resets the instant movement stops so each fresh stretch of motion
      // ripples outward from scratch, rather than snapping the whole radius on
      hoverElapsed.current = isHovering ? hoverElapsed.current + dt : 0
      let repelLocal = null
      if (repelIntensity.current > 0.01 && frameRectRef.current && groupRef.current) {
        groupRef.current.updateMatrixWorld()
        // Cast the camera-to-cursor ray into the group's local space and
        // intersect it with the local z=0 plane (the blade's own reference
        // plane) — a fixed world z=0 assumption only lines up with the
        // particles when the logo is unrotated, so under yaw/pitch it must
        // be resolved in local space instead, or the bulge drifts off the
        // cursor and stops registering at other viewing angles.
        const world = pxToWorld(mouseClient.current.x, mouseClient.current.y, frameRectRef.current)
        const cam = state.camera
        repelInvQuatTmp.copy(groupRef.current.quaternion).invert()
        repelOriginTmp.copy(cam.position).sub(groupRef.current.position).applyQuaternion(repelInvQuatTmp)
        repelDirTmp
          .set(world.x - cam.position.x, world.y - cam.position.y, -cam.position.z)
          .applyQuaternion(repelInvQuatTmp)
        if (Math.abs(repelDirTmp.z) > 1e-6) {
          const tParam = -repelOriginTmp.z / repelDirTmp.z
          repelVecTmp.set(repelOriginTmp.x + tParam * repelDirTmp.x, repelOriginTmp.y + tParam * repelDirTmp.y, 0)
          repelLocal = repelVecTmp
        }
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

        // bounce-off scatter: a particle within reach of the cursor gets
        // knocked outward (an impulse added to its velocity), but not all at
        // once — particles right at the cursor start moving almost
        // immediately, while ones nearer the radius edge only start once
        // the ripple has had time to travel out to them, so the motion
        // visibly spreads from the cursor to its neighbors rather than the
        // whole area reacting in lockstep. Every particle — reached or not
        // — is continuously pulled back toward its rest spot by a damped
        // spring, so it all settles smoothly once the wave passes.
        if (repelLocal) {
          const dx = px - repelLocal.x
          const dy = py - repelLocal.y
          const dist = Math.hypot(dx, dy)
          if (dist < repelRadius && dist > 0.0001) {
            const falloff = 1 - dist / repelRadius
            const delay = (dist / repelRadius) * RIPPLE_DELAY_MAX
            const wavePhase = hoverElapsed.current - delay
            if (wavePhase > 0) {
              const rise = Math.min(wavePhase / RIPPLE_RISE_TIME, 1)
              const eased = rise * rise * (3 - 2 * rise)
              const kick = eased * falloff * falloff * repelStrength * repelIntensity.current
              scatter.velX[i] += (dx / dist) * kick
              scatter.velY[i] += (dy / dist) * kick
            }
          }
        }
        const ax = -SPRING_STIFFNESS * scatter.offsetX[i] - SPRING_DAMPING * scatter.velX[i]
        const ay = -SPRING_STIFFNESS * scatter.offsetY[i] - SPRING_DAMPING * scatter.velY[i]
        scatter.velX[i] += ax * dt
        scatter.velY[i] += ay * dt
        scatter.offsetX[i] += scatter.velX[i] * dt
        scatter.offsetY[i] += scatter.velY[i] * dt
        px += scatter.offsetX[i]
        py += scatter.offsetY[i]

        if (data.isSphere[i]) {
          dummy.position.set(px, py, pz)
          dummy.quaternion.copy(leafQuats[groups.slot[i]])
          dummy.scale.setScalar(data.sizes[i] * radiusUnit)
          dummy.updateMatrix()
          meshRef.current.setMatrixAt(groups.slot[i], dummy.matrix)
        } else {
          const s3 = groups.slot[i] * 3
          const w = data.edgeWeight[i]
          const seed = data.seeds[i]
          dotPositions[s3] = px
          dotPositions[s3 + 1] = py
          dotPositions[s3 + 2] = pz
          dotSizes[groups.slot[i]] = data.sizes[i] * (1 + 0.35 * w * Math.sin(t * 2.6 + seed * 5.1))
        }
      }
      meshRef.current.instanceMatrix.needsUpdate = true
      dotGeometry.attributes.position.needsUpdate = true
      dotGeometry.attributes.aSize.needsUpdate = true
    }

    // Unprompted trail: sign the initials once the mark has settled, then let a
    // gust cross the hero every so often. Both just feed the same spawn path the
    // cursor uses, so nothing downstream needs to know the difference.
    if (introDone.current) {
      const auto = autoTrail.current
      if (auto.settledAt === null) auto.settledAt = t

      const sinceSettled = t - auto.settledAt
      const writeElapsed = sinceSettled - WRITE_START_DELAY

      if (auto.penIndex < penPath.length) {
        if (writeElapsed > 0) {
          // constant pen speed: how far along the path we should be by now
          const target = Math.min(
            penPath.length,
            Math.ceil((writeElapsed / WRITE_DURATION) * penPath.length)
          )
          for (; auto.penIndex < target; auto.penIndex++) {
            const p = penPath[auto.penIndex]
            const prev = penPath[auto.penIndex - 1]
            let dx = 0
            let dy = 1
            if (p.penDown && prev) {
              const len = Math.hypot(p.x - prev.x, p.y - prev.y)
              if (len > 1e-5) {
                dx = (p.x - prev.x) / len
                dy = (p.y - prev.y) / len
              }
            }
            // smaller than a wind leaf — a signature is written with a fine nib,
            // and small blades keep the letterforms crisp instead of fattening
            // the strokes until they run together. Life is measured to a common
            // deadline, so the first stroke of the Y and the last of the K
            // disappear on the same frame rather than one at a time.
            const signEnds = auto.settledAt + WRITE_START_DELAY + WRITE_DURATION + SIGN_HOLD
            spawnTrail.current(p.x, p.y, dx, dy, 1, Math.max(signEnds - t, 0.1), true, 0.5)
          }
        }
      } else {
        // signing finished — schedule and run gusts from here on
        if (auto.gustAt === null) {
          auto.gustAt = t + BREEZE_FIRST_DELAY
            // A fresh heading and origin each time. Kept within ~35 degrees of
            // horizontal in either direction, because near-vertical wind reads
            // as falling rather than blowing — but it may now come from the
            // right as readily as the left.
            const fromLeft = Math.random() < 0.5
            const tilt = (Math.random() * 2 - 1) * 0.62
            auto.gustAngle = fromLeft ? tilt : Math.PI - tilt
            auto.gustCX = (Math.random() * 0.5 - 0.25) * layout.halfWidth
            auto.gustCY = (Math.random() * 1.3 - 0.55) * layout.halfHeight
        }
        const gustElapsed = t - auto.gustAt
        if (gustElapsed >= 0) {
          if (gustElapsed <= BREEZE_DURATION) {
            const STEPS = 80
            const target = Math.min(STEPS, Math.ceil((gustElapsed / BREEZE_DURATION) * STEPS))
            for (; auto.gustIndex < target; auto.gustIndex++) {
              const raw = auto.gustIndex / STEPS
              // eased so the gust gathers, runs, and trails off rather than
              // crossing at one flat speed — most of what makes it read as air
              // rather than as something being drawn
              const f = raw * raw * (3 - 2 * raw)
              // Travels along its own heading rather than always left to right,
              // so successive gusts come from different quarters. The reach is
              // the hero's diagonal, so a gust still crosses fully at any angle.
              const dirX = Math.cos(auto.gustAngle)
              const dirY = Math.sin(auto.gustAngle)
              const reach = Math.hypot(layout.halfWidth, layout.halfHeight) * 1.15
              const along = -reach + 2 * reach * f
              // A long, lazy wavelength instead of a tight wiggle, and three
              // strands offset across the heading: one line of leaves reads as a
              // stroke, several drifting together read as moving air.
              const phase = f * 2.1 + auto.gustSeed
              for (let s = 0; s < 3; s++) {
                const wave =
                  (s - 1) * layout.halfHeight * 0.07 +
                  Math.sin(phase + s * 0.85) * layout.halfHeight * 0.1
                // offset perpendicular to the direction of travel
                const x = auto.gustCX + dirX * along - dirY * wave
                const y = auto.gustCY + dirY * along + dirX * wave
                // skipped over the mark itself, so the wind flows around it
                if (outsideLogo(x, y)) {
                  const drift = Math.cos(phase + s * 0.85) * 0.3
                  spawnTrail.current(
                    x, y,
                    dirX - dirY * drift,
                    dirY + dirX * drift,
                    1, TRAIL_LIFETIME, false, 0.72
                  )
                }
              }
            }
          } else {
            auto.gustAt = t + BREEZE_INTERVAL
            auto.gustIndex = 0
            auto.gustSeed = Math.random() * Math.PI * 2
            // A fresh heading and origin each time. Kept within ~35 degrees of
            // horizontal in either direction, because near-vertical wind reads
            // as falling rather than blowing — but it may now come from the
            // right as readily as the left.
            const fromLeft = Math.random() < 0.5
            const tilt = (Math.random() * 2 - 1) * 0.62
            auto.gustAngle = fromLeft ? tilt : Math.PI - tilt
            auto.gustCX = (Math.random() * 0.5 - 0.25) * layout.halfWidth
            auto.gustCY = (Math.random() * 1.3 - 0.55) * layout.halfHeight
          }
        }
      }
    }

    // trail dots in the side background zones — spawned on mousemove, each
    // one riding a sideways wave along its own heading as it fades, like a
    // gust of wind carrying it off rather than sitting still and shrinking
    {
      const posAttr = trailGeometry.attributes.position
      const sizeAttr = trailGeometry.attributes.aSize
      const waveAmp = TRAIL_WAVE_AMP * layout.scaleFactor
      const driftSpeed = TRAIL_DRIFT_SPEED * layout.scaleFactor
      for (let i = 0; i < TRAIL_POOL; i++) {
        const slot = trailSlots.current[i]
        if (!slot.active) {
          sizeAttr.array[i] = 0
          continue
        }
        const age = t - slot.spawnTime
        // per-mark, not one global constant: the signature has to outlive the
        // time it takes to write it or its first letter is gone before its last
        // is drawn, while the cursor trail stays short
        if (age > slot.life) {
          slot.active = false
          sizeAttr.array[i] = 0
          continue
        }
        const lifeT = Math.min(age / slot.life, 1)
        // A held mark never drifts or sways. That motion is what gives the
        // cursor trail its life, but on a letter it smears the stroke out of
        // shape faster than the word can be read.
        const release = slot.hold ? 0 : 1
        // Size is the only channel these have, so any fade reads as a shrink,
        // and a shrinking signature looks like it's being rubbed out. Held marks
        // snap to full size, stay there, and are simply gone when their shared
        // life runs out. Free wind leaves still breathe in and out with sin().
        const envelope = slot.hold ? Math.min(age / 0.12, 1) : Math.sin(lifeT * Math.PI)
        const sway = Math.sin(age * TRAIL_WAVE_FREQ + slot.seed) * waveAmp * envelope * release
        const drift = driftSpeed * age * release
        const perpX = -slot.dirY
        const perpY = slot.dirX
        posAttr.array[i * 3] = slot.x + perpX * sway + slot.dirX * drift
        posAttr.array[i * 3 + 1] = slot.y + perpY * sway + slot.dirY * drift
        posAttr.array[i * 3 + 2] = slot.z
        sizeAttr.array[i] = slot.baseSize * envelope
      }
      posAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
    }

    // ambient floating motes — lick upward from their rooted spot on the
    // logo, fading in and back out over a short quick cycle like flame tips,
    // looping continuously and independent of drag/hover
    {
      const posAttr = floatGeometry.attributes.position
      const sizeAttr = floatGeometry.attributes.aSize
      const rise = FLOAT_RISE * layout.scaleFactor
      const drift = FLOAT_DRIFT * layout.scaleFactor
      for (let i = 0; i < FLOAT_POOL; i++) {
        const p = floatParticles[i]
        const lifeT = ((t + p.phase) % FLOAT_LIFETIME) / FLOAT_LIFETIME
        const envelope = Math.sin(lifeT * Math.PI)
        posAttr.array[i * 3] = p.baseX + Math.sin(t * 2.2 + p.seed * 6.283) * drift * lifeT
        posAttr.array[i * 3 + 1] = p.bottomY + rise * lifeT
        posAttr.array[i * 3 + 2] = p.baseZ
        sizeAttr.array[i] = p.size * envelope
      }
      posAttr.needsUpdate = true
      sizeAttr.needsUpdate = true
    }

    if (groupRef.current) {
      // stays front-facing while the particles are still flying in; the
      // ambient swing only starts once the logo has fully formed, timed
      // from that moment (not from mount) so it always begins at center.
      // drag adds a persistent offset on top once swinging, so nudging it
      // keeps swinging from wherever you left it
      if (introDone.current) {
        // swingAngle's own t=0 sits at an extreme (see its cycle comment);
        // offsetting by MOVE_DURATION lands the swing's t=0 in its "paused
        // at center" segment instead, so it always starts centered and still
        // and only begins sweeping outward from there.
        groupRef.current.rotation.y = swingAngle(t - swingStartTime.current + MOVE_DURATION) + dragOffset.current.yaw
        groupRef.current.rotation.x = dragOffset.current.pitch
      } else {
        groupRef.current.rotation.y = 0
        groupRef.current.rotation.x = 0
      }
    }
    if (dotMatRef.current) dotMatRef.current.uniforms.uTime.value = t
    if (trailMatRef.current) trailMatRef.current.uniforms.uTime.value = t
    if (floatMatRef.current) floatMatRef.current.uniforms.uTime.value = t
  })

  return (
    <>
      <group ref={groupRef}>
        <instancedMesh ref={meshRef} args={[undefined, undefined, groups.sphereCount]}>
          <primitive object={leafBladeGeometry} attach="geometry" />
          {/* a blade is an open sheet, not a closed volume, so both faces have
              to draw or half of them vanish depending on which way they turned */}
          <shaderMaterial
            ref={sphereMatRef}
            vertexShader={SPHERE_VERTEX}
            fragmentShader={SPHERE_FRAGMENT}
            uniforms={sphereUniforms}
            side={THREE.DoubleSide}
          />
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
      {/* ambient evaporating-mist motes around the logo — also outside the
          rotating group so "up" always means up on screen */}
      <points geometry={floatGeometry} frustumCulled={false}>
        <shaderMaterial
          ref={floatMatRef}
          vertexShader={DOT_VERTEX}
          fragmentShader={DOT_FRAGMENT}
          uniforms={floatUniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.NormalBlending}
        />
      </points>
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

const REVEAL_PHOTO = HERO_BG_IMAGE

// A tiny placeholder texture (a flat field-green) so the particle cloud can
// mount and start flying in the instant the logo mask + layout are ready,
// without waiting on the (larger, network-fetched) reveal photo. Loaded
// manually rather than via useLoader/Suspense — that would otherwise block
// the whole cloud, including its intro clock, on the photo's fetch time,
// which is exactly the "formation starts a second or two late" gap this
// fixes. The real photo swaps into the same uniform once it's ready.
function createPlaceholderTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2
  canvas.height = 2
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#5b7a4a'
  ctx.fillRect(0, 0, 2, 2)
  const tex = new THREE.CanvasTexture(canvas)
  return tex
}

function useHeroPhotoTexture(src) {
  const [state, setState] = useState(() => ({ texture: createPlaceholderTexture(), imageAspect: 1 }))
  useEffect(() => {
    let cancelled = false
    loadImageForever(
      src,
      (img) => {
        if (cancelled) return
        const tex = new THREE.Texture(img)
        tex.needsUpdate = true
        setState({ texture: tex, imageAspect: img.width / img.height })
      },
      () => cancelled
    )
    return () => {
      cancelled = true
    }
  }, [src])
  return state
}

// Checked once, before anything tries to mount a Canvas. On a machine with no
// WebGL — an old browser, a locked-down device, a driver that refuses — R3F
// would throw while creating the renderer and take the whole hero down with it.
// Here we simply decline, and the static mark in Hero.jsx stays where it is.
function hasWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const probe = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (probe.getContext('webgl2') || probe.getContext('webgl')))
  } catch {
    return false
  }
}

// Fires on the first frame the scene actually draws at a real size. This only
// mounts once R3F has measured its container, so reaching a frame here is the
// honest signal that the hero can retire its static mark.
function CanvasVitals({ onReady }) {
  const size = useThree((s) => s.size)
  const reported = useRef(false)
  useFrame(() => {
    if (!reported.current && size.width > 1 && size.height > 1) {
      reported.current = true
      onReady?.()
    }
  })
  return null
}

export default function HeroLeafParticles({ anchorPx, boxRef, heroFrameRef, onReady }) {
  const data = useLogoParticles('/images/logo-green.png', 21000)
  const { texture: photoTexture, imageAspect } = useHeroPhotoTexture(REVEAL_PHOTO)
  const [webglOK] = useState(hasWebGL)
  const hostRef = useRef(null)

  // R3F only mounts the scene once react-use-measure reports a non-zero size for
  // its wrapper, and it re-measures on ResizeObserver/window-resize alone. If
  // that first reading comes back empty — a layout that hadn't settled, a
  // container measured mid-transition — nothing ever asks again, and the hero is
  // left with a bare 300x150 canvas and no logo in it for the whole visit. That
  // has turned up repeatedly in testing, so it gets a watchdog rather than
  // trust: compare the canvas against the box it sits in a few times a second
  // and, when they disagree, fire the one event that makes R3F look again. It
  // lives outside the Canvas on purpose — in the failure case there is no scene
  // mounted to run inside.
  useEffect(() => {
    if (!webglOK) return undefined
    const tick = () => {
      const host = hostRef.current
      if (!host) return
      const el = host.querySelector('canvas')
      const want = host.clientWidth
      if (el && want > 1 && Math.abs(el.clientWidth - want) > 2) {
        window.dispatchEvent(new Event('resize'))
      }
    }
    const id = setInterval(tick, 250)
    tick()
    return () => clearInterval(id)
  }, [webglOK])

  if (!webglOK) return null
  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
        // R3F sets pointerEvents:'auto' on this element by default, which
        // overrides the pointer-events-none on its wrapping div — combined
        // with touchAction:'none' that made the canvas swallow every touch
        // gesture across the full hero height, so mobile visitors couldn't
        // scroll past the hero at all. Our drag/hover/trail interactions are
        // all wired via window-level pointer listeners (see ParticleCloud),
        // not canvas hit-testing, so the canvas itself never needs to receive
        // pointer events — forcing it back to none/auto here is safe and
        // restores normal touch-scrolling without affecting desktop, where
        // mouse wheel scroll was never touch-action-gated in the first place.
        style={{ pointerEvents: 'none', touchAction: 'auto', width: '100%', height: '100%' }}
      >
        {/* only once there is something to draw — a mask still downloading on a
            bad connection must keep the static mark up, not blank the hero */}
        {data && anchorPx && <CanvasVitals onReady={onReady} />}
        {anchorPx && <CameraRig anchorPx={anchorPx} />}
        {data && anchorPx && (
          <ParticleCloud
            data={data}
            anchorPx={anchorPx}
            boxRef={boxRef}
            heroFrameRef={heroFrameRef}
            photoTexture={photoTexture}
            imageAspect={imageAspect}
          />
        )}
      </Canvas>
    </div>
  )
}
