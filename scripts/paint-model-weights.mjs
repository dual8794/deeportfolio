// Paints the animation weights used by src/components/modelAnimation.ts onto
// the original Meshy export, as a custom _ANIM vertex attribute (vec4):
//   x = right forearm + hand, y = left forearm + hand, z = cat tail, w = tail curl
//
// Usage (needs the original, uncompressed GLB):
//   npm i --no-save @gltf-transform/core sharp
//   node scripts/paint-model-weights.mjs original.glb weighted.glb
//   npx @gltf-transform/cli optimize weighted.glb public/models/duaa.glb \
//     --compress meshopt --texture-compress webp --texture-size 2048 \
//     --simplify-ratio 0.15 --simplify-error 0.002
//
// Parts are found by growing a region from a seed point through vertices of
// the right texture colour (skin for the arms, orange for the tail).
import { NodeIO } from '@gltf-transform/core'
import sharp from 'sharp'

const [input, output] = process.argv.slice(2)
const io = new NodeIO()
const doc = await io.read(input)
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0]
const pos = prim.getAttribute('POSITION').getArray()
const uv = prim.getAttribute('TEXCOORD_0').getArray()
const idx = prim.getIndices().getArray()
const n = pos.length / 3

const tex = prim.getMaterial().getBaseColorTexture()
const SIZE = 2048
const img = await sharp(Buffer.from(tex.getImage()), { limitInputPixels: false })
  .resize(SIZE, SIZE).removeAlpha().raw().toBuffer()
const color = (i) => {
  const u = Math.min(Math.max(uv[2 * i], 0), 1)
  const v = Math.min(Math.max(uv[2 * i + 1], 0), 1)
  const px = Math.min(SIZE - 1, Math.floor(u * SIZE))
  const py = Math.min(SIZE - 1, Math.floor(v * SIZE)) // glTF UV origin is top-left
  const o = (py * SIZE + px) * 3
  return [img[o] / 255, img[o + 1] / 255, img[o + 2] / 255]
}
const smooth = (a, b, t) => {
  const x = Math.min(Math.max((t - a) / (b - a), 0), 1)
  return x * x * (3 - 2 * x)
}
const isHair = ([r, g, b]) => r < 0.72 && g < 0.42 && b < 0.3
const isOrange = ([r, g, b]) => r > 0.8 && g > 0.38 && g < 0.78 && b < 0.5 && r - b > 0.4

// mesh adjacency (the model is one connected mesh)
const nbrStart = new Uint32Array(n + 1)
for (let t = 0; t < idx.length; t++) nbrStart[idx[t] + 1] += 2
for (let i = 0; i < n; i++) nbrStart[i + 1] += nbrStart[i]
const fill = nbrStart.slice(0, n)
const nbrs = new Uint32Array(nbrStart[n])
for (let t = 0; t < idx.length; t += 3) {
  const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]]
  nbrs[fill[a]++] = b; nbrs[fill[a]++] = c
  nbrs[fill[b]++] = a; nbrs[fill[b]++] = c
  nbrs[fill[c]++] = a; nbrs[fill[c]++] = b
}
// UV seams split vertices that share a position; link them as neighbours too
const twins = new Map()
const twinOf = new Int32Array(n).fill(-1)
for (let i = 0; i < n; i++) {
  const k = `${pos[3 * i].toFixed(5)},${pos[3 * i + 1].toFixed(5)},${pos[3 * i + 2].toFixed(5)}`
  if (twins.has(k)) { const j = twins.get(k); twinOf[i] = j; if (twinOf[j] < 0) twinOf[j] = i } else twins.set(k, i)
}
const forNeighbours = (i, fn) => {
  for (let j = nbrStart[i]; j < nbrStart[i + 1]; j++) fn(nbrs[j])
  if (twinOf[i] >= 0) fn(twinOf[i])
}
const nearest = (x, y, z) => {
  let best = 0, bd = Infinity
  for (let i = 0; i < n; i++) {
    const d = (pos[3 * i] - x) ** 2 + (pos[3 * i + 1] - y) ** 2 + (pos[3 * i + 2] - z) ** 2
    if (d < bd) { bd = d; best = i }
  }
  return best
}
// Grow a region from a seed vertex through vertices that pass `accept`, then
// close small holes (vertices mostly surrounded by the region join it).
const colors = new Array(n)
for (let i = 0; i < n; i++) colors[i] = color(i)
const grow = (seed, accept) => {
  const inRegion = new Uint8Array(n)
  const queue = [seed]; inRegion[seed] = 1
  while (queue.length) {
    const i = queue.pop()
    forNeighbours(i, (j) => { if (!inRegion[j] && accept(j)) { inRegion[j] = 1; queue.push(j) } })
  }
  for (let it = 0; it < 3; it++) {
    const add = []
    for (let i = 0; i < n; i++) {
      if (inRegion[i]) continue
      let inside = 0, total = 0
      forNeighbours(i, (j) => { total++; inside += inRegion[j] })
      if (total && inside / total > 0.5) add.push(i)
    }
    for (const i of add) inRegion[i] = 1
  }
  return inRegion
}
const P = (i) => [pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]]
const armRegion = (side) => grow(nearest(0.53 * side, 0.24, 0.06), (i) => {
  const [x, y, z] = P(i)
  return x * side > 0.3 && y > -0.06 && y < 0.34 && z > -0.05 && !isHair(colors[i])
})
const tailRegion = grow(nearest(-0.42, 0.68, -0.2), (i) => {
  const [x, y, z] = P(i)
  return x < -0.12 && y > 0.4 && y < 0.78 && z < -0.14 && isOrange(colors[i])
})
const rightArm = armRegion(1), leftArm = armRegion(-1)

const w = new Float32Array(n * 4)
const stats = { rArm: 0, lArm: 0, tail: 0 }
const skin = []
for (let i = 0; i < n; i++) {
  const [x, y, z] = P(i)
  const c = colors[i]
  if (rightArm[i]) { w[4 * i] = smooth(0.3, 0.46, x); stats.rArm++ }
  if (leftArm[i]) { w[4 * i + 1] = smooth(0.3, 0.46, -x); stats.lArm++ }
  if (tailRegion[i]) {
    w[4 * i + 2] = smooth(-0.14, -0.24, x)
    w[4 * i + 3] = x < -0.27 ? smooth(0.5, 0.58, y) : 0
    stats.tail++
  }
  // skin around the girl's eyes, for the eyelid colour
  for (const [cx, cy] of [[-0.1, 0.289], [0.109, 0.305]]) {
    const d = Math.hypot((x - cx) / 0.022, (y - cy) / 0.03)
    if (z > 0.1 && d > 1.3 && d < 1.8 && !isHair(c)) skin.push(c)
  }
}

// Hair right behind a forearm would poke through it as the arm moves, so let
// vertices very close to an arm follow it.
const CELL = 0.03
const grid = new Map()
const cellKey = (x, y, z) => `${Math.floor(x / CELL)},${Math.floor(y / CELL)},${Math.floor(z / CELL)}`
for (let i = 0; i < n; i++) {
  if (!rightArm[i] && !leftArm[i]) continue
  const k = cellKey(...P(i))
  if (!grid.has(k)) grid.set(k, [])
  grid.get(k).push(i)
}
let followers = 0
for (let i = 0; i < n; i++) {
  if (rightArm[i] || leftArm[i]) continue
  const [x, y, z] = P(i)
  if (Math.abs(x) < 0.3 || y < -0.08 || y > 0.36) continue
  let best = Infinity, bestJ = -1
  const [cx, cy, cz] = [Math.floor(x / CELL), Math.floor(y / CELL), Math.floor(z / CELL)]
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
    for (const j of grid.get(`${cx + dx},${cy + dy},${cz + dz}`) ?? []) {
      const d = Math.hypot(pos[3 * j] - x, pos[3 * j + 1] - y, pos[3 * j + 2] - z)
      if (d < best) { best = d; bestJ = j }
    }
  }
  if (best > 0.025) continue
  const f = smooth(0.025, 0.008, best)
  w[4 * i] = w[4 * bestJ] * f
  w[4 * i + 1] = w[4 * bestJ + 1] * f
  followers++
}
stats.followers = followers

// soften region borders so neighbouring vertices don't tear apart
let cur = w
for (let it = 0; it < 3; it++) {
  const next = new Float32Array(cur.length)
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < 4; k++) {
      let sum = cur[4 * i + k] * 2, cnt = 2
      forNeighbours(i, (j) => { sum += cur[4 * j + k]; cnt++ })
      // keep strongly-weighted vertices rigid, only soften the borders
      next[4 * i + k] = Math.max(cur[4 * i + k] > 0.98 ? cur[4 * i + k] : 0, sum / cnt)
    }
  }
  cur = next
}

// vertices split along UV seams must move together or the seam opens up
const groups = new Map()
for (let i = 0; i < n; i++) {
  const k = `${pos[3 * i].toFixed(5)},${pos[3 * i + 1].toFixed(5)},${pos[3 * i + 2].toFixed(5)}`
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push(i)
}
let seamFixes = 0
for (const g of groups.values()) {
  if (g.length < 2) continue
  for (let k = 0; k < 4; k++) {
    const m = Math.max(...g.map((i) => cur[4 * i + k]))
    for (const i of g) { if (cur[4 * i + k] !== m) seamFixes++; cur[4 * i + k] = m }
  }
}
stats.seamFixes = seamFixes

const acc = doc.createAccessor('anim').setType('VEC4').setArray(cur)
  .setBuffer(doc.getRoot().listBuffers()[0])
prim.setAttribute('_ANIM', acc)
await io.write(output, doc)

const avg = [0, 1, 2].map((k) => skin.reduce((s, c) => s + c[k], 0) / skin.length)
console.log('vertices', n, stats, 'eyelid skin rgb', avg.map((v) => v.toFixed(3)).join(','), 'samples', skin.length)
