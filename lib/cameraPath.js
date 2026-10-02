import * as THREE from "three";

// Camera keyframes along scroll progress (0..1). The car faces +X.
const KEYS = [
  { p: 0, pos: [4.6, 1, 5.4], look: [0.4, 0.55, 0] }, // low front three-quarter
  { p: 0.3, pos: [0.6, 1.1, 7.2], look: [0, 0.6, 0] }, // side profile
  { p: 0.55, pos: [-5.2, 1.5, 4.6], look: [0, 0.6, 0] }, // rear three-quarter
  { p: 0.8, pos: [-0.8, 6.8, 3.2], look: [0, 0.2, 0] }, // top view
  { p: 1, pos: [3.4, 1.5, 4], look: [0.8, 0.6, 0] }, // close front shot
];
const A = new THREE.Vector3();
const B = new THREE.Vector3();

/** Writes the smoothstep-interpolated camera position and look target for progress p. */
export function sampleCamera(p, outPos, outLook) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const k0 = KEYS[i],
    k1 = KEYS[i + 1];
  let t = THREE.MathUtils.clamp((p - k0.p) / (k1.p - k0.p), 0, 1);
  t = t * t * (3 - 2 * t);
  outPos.fromArray(k0.pos).lerp(B.fromArray(k1.pos), t);
  outLook.fromArray(k0.look).lerp(A.fromArray(k1.look), t);
}
