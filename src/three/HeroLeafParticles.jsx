import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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

// Samples the real logo's alpha channel into a point cloud — particles only
// exist where the actual brand mark has pixels, so the silhouette is exact.
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
      const positions = new Float32Array(total * 3)
      const sizes = new Float32Array(total)
      const seeds = new Float32Array(total)
      const tints = new Float32Array(total)

      for (let i = 0; i < total; i++) {
        const idx = Math.floor((i / total) * candidates.length + (Math.random() * candidates.length) / total) % candidates.length
        const [px_, py_] = candidates[idx]
        const nx = (px_ / w - 0.5) * 2.4
        const ny = -(py_ / h - 0.5) * 2.4 * (h / w)
        positions[i * 3] = nx + (Math.random() - 0.5) * 0.02
        positions[i * 3 + 1] = ny + (Math.random() - 0.5) * 0.02
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.14
        sizes[i] = 2.2 + Math.random() * 3.2
        seeds[i] = Math.random()
        tints[i] = Math.random() > 0.88 ? 1 : 0
      }
      setData({ positions, sizes, seeds, tints })
    }
    return () => { cancelled = true }
  }, [src, count])

  return data
}

// Degrees of swing to each side from center. Kept well under 90° so the
// cloud never goes edge-on/flat — it always reads as the leaf shape.
const SWING_AMPLITUDE = (70 * Math.PI) / 180
const SWING_PERIOD = 22 // seconds for one full left-right-left cycle
const MOUSE_YAW = (18 * Math.PI) / 180
const MOUSE_TILT = (10 * Math.PI) / 180

function ParticleCloud({ data }) {
  const groupRef = useRef()
  const matRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothed = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(data.sizes, 1))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(data.seeds, 1))
    geo.setAttribute('aTint', new THREE.BufferAttribute(data.tints, 1))
    return geo
  }, [data])

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

export default function HeroLeafParticles() {
  const data = useLogoParticles('/images/logo-green.png', 6500)
  return (
    <Canvas
      camera={{ position: [0, 0, 3.2], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>{data && <ParticleCloud data={data} />}</Suspense>
    </Canvas>
  )
}
