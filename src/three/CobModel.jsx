import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'

// Stylized maize cob: ellipsoid core studded with instanced kernels, husk leaves at the base.
function MaizeCob({ kernel = '#E8912A', husk = '#7B9E5A', height = 1 }) {
  const kernelColor = useMemo(() => new THREE.Color(kernel), [kernel])
  const h = 1.35 * height
  const rows = 16
  const cols = 13

  const kernels = useMemo(() => {
    const dummy = new THREE.Object3D()
    const list = []
    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1)
      const y = (v - 0.5) * h
      // cob silhouette: fat middle, tapered tip
      const radius = 0.34 * Math.sin(Math.PI * (0.12 + v * 0.82)) * (1 - v * 0.18)
      for (let c = 0; c < cols; c++) {
        const a = (c / cols) * Math.PI * 2 + (r % 2) * (Math.PI / cols)
        dummy.position.set(Math.cos(a) * radius, y, Math.sin(a) * radius)
        dummy.lookAt(0, y, 0)
        const s = 0.085 * (0.85 + Math.random() * 0.3)
        dummy.scale.set(s, s, s * 1.35)
        dummy.updateMatrix()
        list.push(dummy.matrix.clone())
      }
    }
    return list
  }, [h])

  const huskGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.16, 1.2, 7, 4, true)
    geo.translate(0, 0.6, 0)
    geo.scale(1, 1, 0.45)
    return geo
  }, [])

  return (
    <group>
      {/* core */}
      <mesh>
        <sphereGeometry args={[0.34, 20, 24]} />
        <meshStandardMaterial color={kernelColor} roughness={0.5} />
      </mesh>
      <mesh scale={[1, h * 1.45, 1]}>
        <sphereGeometry args={[0.32, 20, 24]} />
        <meshStandardMaterial color={kernelColor.clone().multiplyScalar(0.85)} roughness={0.55} />
      </mesh>
      {/* kernels */}
      <instancedMesh
        args={[undefined, undefined, kernels.length]}
        ref={(mesh) => {
          if (mesh && !mesh.userData.filled) {
            kernels.forEach((m, i) => mesh.setMatrixAt(i, m))
            mesh.instanceMatrix.needsUpdate = true
            mesh.userData.filled = true
          }
        }}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial color={kernelColor} roughness={0.35} metalness={0.08} />
      </instancedMesh>
      {/* husk leaves */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          geometry={huskGeo}
          position={[Math.cos((i / 5) * Math.PI * 2) * 0.18, -h * 0.62, Math.sin((i / 5) * Math.PI * 2) * 0.18]}
          rotation={[0.5 * Math.cos((i / 5) * Math.PI * 2 + Math.PI / 2) * 0.9, (i / 5) * Math.PI * 2, -0.45 * Math.cos((i / 5) * Math.PI * 2)]}
        >
          <meshStandardMaterial color={husk} roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* silk tassel */}
      <mesh position={[0, h * 0.72, 0]} rotation={[0, 0, 0.15]}>
        <coneGeometry args={[0.05, 0.3, 8]} />
        <meshStandardMaterial color="#E5C585" roughness={0.5} />
      </mesh>
    </group>
  )
}

// Stylized paddy panicle: arching stems with drooping grain clusters.
function PaddyPanicle({ kernel = '#EFE6B5', husk = '#A4B86B', height = 1 }) {
  const grainColor = useMemo(() => new THREE.Color(kernel), [kernel])

  const panicles = useMemo(() => {
    const dummy = new THREE.Object3D()
    const grains = []
    const stems = []
    const nP = 5
    for (let p = 0; p < nP; p++) {
      const baseAngle = (p / nP) * Math.PI * 2
      const lean = 0.35 + (p % 2) * 0.18
      const start = new THREE.Vector3(0, -0.85 * height, 0)
      const midPt = new THREE.Vector3(Math.cos(baseAngle) * 0.22, 0.45 * height, Math.sin(baseAngle) * 0.22)
      const end = new THREE.Vector3(Math.cos(baseAngle) * (0.55 + lean * 0.4), 0.62 * height - lean * 0.35, Math.sin(baseAngle) * (0.55 + lean * 0.4))
      const curve = new THREE.QuadraticBezierCurve3(start, midPt, end)
      stems.push(curve)
      // grains hang along the top 45% of each arc
      const nG = 11
      for (let g = 0; g < nG; g++) {
        const t = 0.55 + (g / (nG - 1)) * 0.45
        const pt = curve.getPoint(t)
        dummy.position.set(pt.x + (Math.random() - 0.5) * 0.05, pt.y - 0.04 - Math.random() * 0.04, pt.z + (Math.random() - 0.5) * 0.05)
        dummy.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.6)
        dummy.scale.set(0.035, 0.075, 0.035)
        dummy.updateMatrix()
        grains.push(dummy.matrix.clone())
      }
    }
    return { grains, stems }
  }, [height])

  return (
    <group position={[0, 0.1, 0]}>
      {panicles.stems.map((curve, i) => (
        <mesh key={i}>
          <tubeGeometry args={[curve, 20, 0.014, 6, false]} />
          <meshStandardMaterial color={husk} roughness={0.65} />
        </mesh>
      ))}
      <instancedMesh
        args={[undefined, undefined, panicles.grains.length]}
        ref={(mesh) => {
          if (mesh && !mesh.userData.filled) {
            panicles.grains.forEach((m, i) => mesh.setMatrixAt(i, m))
            mesh.instanceMatrix.needsUpdate = true
            mesh.userData.filled = true
          }
        }}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color={grainColor} roughness={0.4} metalness={0.05} />
      </instancedMesh>
      {/* leaf blades */}
      {[[-0.6, 0.35], [0.55, -0.4]].map(([rz, ry], i) => (
        <mesh key={i} position={[0, -0.6 * height, 0]} rotation={[0, ry, rz]}>
          <coneGeometry args={[0.09, 1.1 * height, 5, 3, true]} />
          <meshStandardMaterial color={husk} roughness={0.75} side={THREE.DoubleSide} transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  )
}

function Spinner({ children }) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.45
  })
  return <group ref={ref}>{children}</group>
}

export default function CobViewer({ cob }) {
  return (
    <Canvas
      camera={{ position: [0, 0.25, 2.9], fov: 40 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      style={{ touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} color="#FFEEC9" />
        <directionalLight position={[4, 5, 3]} intensity={1.8} color="#F4C766" />
        <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#5A8168" />
        <Float speed={2} rotationIntensity={0.12} floatIntensity={0.35}>
          <Spinner>
            {cob?.paddy ? <PaddyPanicle {...cob} /> : <MaizeCob {...cob} />}
          </Spinner>
        </Float>
        <Sparkles count={30} scale={3.4} size={2.4} speed={0.4} color="#F2E0B5" opacity={0.65} />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.7} />
      </Suspense>
    </Canvas>
  )
}
