import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Center, OrbitControls, useGLTF } from "@react-three/drei"

const MODEL_URL = "/models/duaa.glb"

function Model() {
  const { scene } = useGLTF(MODEL_URL)
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

export default function ModelViewer() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 3.4], fov: 35 }}
      dpr={[1, 2]}
      aria-label="3D model of Duaa"
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#cbcbff" />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  )
}

useGLTF.preload(MODEL_URL)
