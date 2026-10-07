import * as THREE from "three"

// The Meshy model is a single static mesh, so it is animated in the shader.
// The GLB carries a custom `_ANIM` vertex attribute (painted offline from the
// texture colours) with one weight per moving part:
//   x = right forearm + hand, y = left forearm + hand, z = cat tail, w = tail curl
// Coordinates below are in the model's own space (Y up, facing +Z).
const RIGHT_ELBOW = "vec2(0.34, 0.07)"
const LEFT_ELBOW = "vec2(-0.34, 0.07)"
const TAIL_BASE = "vec3(-0.13, 0.49, -0.25)"
const TAIL_BEND = "vec2(-0.36, 0.50)"
const EYES = [
  "vec2(-0.100, 0.289)", // girl's right eye (left in front view)
  "vec2(0.109, 0.305)",
]
const EYE_RADIUS = "vec2(0.03, 0.04)"
// sRGB colours, converted to linear in the shader
const EYELID_SKIN = "vec3(0.97, 0.83, 0.73)"
const LASH = "vec3(0.36, 0.17, 0.1)"

type ModelAnimationUniforms = {
  uWave: { value: number }
  uTailLift: { value: number }
  uTailSwing: { value: number }
  uTailCurl: { value: number }
  uBlink: { value: number }
}

function createModelAnimationUniforms(): ModelAnimationUniforms {
  return {
    uWave: { value: 0 },
    uTailLift: { value: 0 },
    uTailSwing: { value: 0 },
    uTailCurl: { value: 0 },
    uBlink: { value: 0 },
  }
}

const vertexHeader = /* glsl */ `
attribute vec4 animWeights;
uniform float uWave;
uniform float uTailLift;
uniform float uTailSwing;
uniform float uTailCurl;
varying vec3 vRestPosition;

vec2 rotate2d(vec2 v, float a) {
  float c = cos(a), s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// Rotates around the Z axis (in the front plane) about a pivot.
vec3 rotateZ(vec3 p, vec2 pivot, float a) {
  return vec3(pivot + rotate2d(p.xy - pivot, a), p.z);
}

// Rotates around the Y axis (swinging forward and back) about a pivot.
vec3 rotateY(vec3 p, vec3 pivot, float a) {
  vec2 xz = pivot.xz + rotate2d(p.xz - pivot.xz, a);
  return vec3(xz.x, p.y, xz.y);
}

// Linear blend skinning with one rotation per part. Pivots are ignored for
// normals by passing them through with pivot = origin.
vec3 animatePoint(vec3 p, bool isNormal) {
  vec3 o = isNormal ? vec3(0.0) : vec3(1.0);
  vec3 q = p;
  q = mix(q, rotateZ(q, ${RIGHT_ELBOW} * o.xy, uWave), animWeights.x);
  q = mix(q, rotateZ(q, ${LEFT_ELBOW} * o.xy, -uWave), animWeights.y);
  q = mix(q, rotateZ(q, ${TAIL_BEND} * o.xy, uTailCurl), animWeights.w);
  vec3 tail = rotateY(rotateZ(q, ${TAIL_BASE}.xy * o.xy, uTailLift), ${TAIL_BASE} * o, uTailSwing);
  return mix(q, tail, animWeights.z);
}
`

const fragmentHeader = /* glsl */ `
uniform float uBlink;
varying vec3 vRestPosition;

// Paints closed eyelids over the eyes. The lid edge curves up at the corners
// so the closed eye reads as a happy little arc.
vec3 applyEyelids(vec3 color, vec3 p) {
  if (uBlink <= 0.0 || p.z < 0.1) return color;
  vec2 centers[2] = vec2[2](${EYES.join(", ")});
  vec3 lid = pow(${EYELID_SKIN}, vec3(2.2));
  vec3 lash = pow(${LASH}, vec3(2.2));
  for (int i = 0; i < 2; i++) {
    vec2 local = (p.xy - centers[i]) / ${EYE_RADIUS};
    float r = length(local);
    if (r > 1.0) continue;
    float fade = smoothstep(1.0, 0.82, r);
    float curve = 0.35 * local.x * local.x * uBlink;
    float top = mix(1.05, -0.3, uBlink) + curve;
    float bottom = mix(-1.05, -0.3, uBlink) + curve;
    if (abs(local.y - top) < 0.11 && abs(local.x) < 0.8) return mix(color, lash, fade);
    if (local.y > top || local.y < bottom) return mix(color, lid, fade);
  }
  return color;
}
`

export type ModelAnimation = {
  uniforms: ModelAnimationUniforms
  blink: (time: number) => number
}

// useGLTF caches the scene, so the animation is set up once and stored on it.
export function getModelAnimation(scene: THREE.Object3D): ModelAnimation {
  if (!scene.userData.animation) {
    const uniforms = createModelAnimationUniforms()
    scene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) applyModelAnimation(object as THREE.Mesh, uniforms)
    })
    scene.userData.animation = { uniforms, blink: createBlinker() }
  }
  return scene.userData.animation
}

function applyModelAnimation(mesh: THREE.Mesh, uniforms: ModelAnimationUniforms) {
  const geometry = mesh.geometry
  if (!geometry.getAttribute("_anim")) return

  // The GLB is quantized (positions stored as normalized ints with the scale on
  // the node). Bake that into float geometry so the shader works in model space.
  for (const name of ["position", "normal"]) {
    const attr = geometry.getAttribute(name)
    const floats = new Float32Array(attr.count * 3)
    for (let i = 0; i < attr.count; i++) {
      floats[i * 3] = attr.getX(i)
      floats[i * 3 + 1] = attr.getY(i)
      floats[i * 3 + 2] = attr.getZ(i)
    }
    geometry.setAttribute(name, new THREE.BufferAttribute(floats, 3))
  }
  mesh.updateMatrix()
  geometry.applyMatrix4(mesh.matrix)
  mesh.position.set(0, 0, 0)
  mesh.quaternion.identity()
  mesh.scale.set(1, 1, 1)
  geometry.setAttribute("animWeights", geometry.getAttribute("_anim"))
  geometry.deleteAttribute("_anim")
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()

  const material = mesh.material as THREE.MeshStandardMaterial
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${vertexHeader}`)
      .replace(
        "#include <beginnormal_vertex>",
        "#include <beginnormal_vertex>\nobjectNormal = normalize(animatePoint(objectNormal, true));"
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvRestPosition = transformed;\ntransformed = animatePoint(transformed, false);"
      )
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\n${fragmentHeader}`)
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        diffuseColor.rgb = applyEyelids(diffuseColor.rgb, vRestPosition);`
      )
  }
  material.customProgramCacheKey = () => "duaa-model-animation"
  material.needsUpdate = true
}

// Returns how closed the eyes are (0 to 1). Blinks every 2.5 to 5 seconds,
// and sometimes blinks twice in a row.
function createBlinker() {
  const duration = 0.18
  let blinkStart = 1.5

  return (time: number) => {
    let t = (time - blinkStart) / duration
    if (t >= 1) {
      const doubleBlink = Math.random() < 0.25
      blinkStart = time + (doubleBlink ? 0.1 : 2.5 + Math.random() * 2.5)
      t = -1
    }
    if (t < 0) return 0
    // close quickly, open a little slower
    return t < 0.4 ? t / 0.4 : 1 - (t - 0.4) / 0.6
  }
}

export function updateModelAnimation(animation: ModelAnimation, t: number) {
  const { uniforms, blink } = animation
  // both hands wave together, between the resting pose and a little higher
  uniforms.uWave.value = 0.12 + 0.18 * Math.sin(t * 6.5)
  uniforms.uTailLift.value = -0.1 + 0.12 * Math.sin(t * 1.6)
  uniforms.uTailSwing.value = 0.3 * Math.sin(t * 2.2)
  uniforms.uTailCurl.value = 0.4 * Math.sin(t * 2.2 - 0.9)
  uniforms.uBlink.value = blink(t)
}
