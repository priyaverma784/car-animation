import * as THREE from "three";

/* Procedural supercar. Returns { group, wheels }. Swap for a .glb loader to use a real model. */
/* Sculpted supercar: smooth lofted body (cross-sections along the length), nose toward +X */
function cr(k, u) {
  var i = 0;
  while (i < k.length - 2 && u > k[i + 1][0]) i++;
  var p0 = k[Math.max(i - 1, 0)][1],
    p1 = k[i][1],
    p2 = k[i + 1][1],
    p3 = k[Math.min(i + 2, k.length - 1)][1];
  var t = THREE.MathUtils.clamp((u - k[i][0]) / (k[i + 1][0] - k[i][0]), 0, 1),
    t2 = t * t,
    t3 = t2 * t;
  return (
    0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}
function se(v, e) {
  return Math.sign(v) * Math.pow(Math.abs(v), e);
}
function loft(u0, u1, Wk, Tk, Bk, pw) {
  var NU = 100,
    NV = 56,
    L = 4.6,
    P = [],
    I = [],
    i,
    j;
  for (i = 0; i <= NU; i++) {
    var u = u0 + ((u1 - u0) * i) / NU,
      w = cr(Wk, u),
      t = cr(Tk, u),
      bt = cr(Bk, u),
      ym = (t + bt) / 2,
      h = Math.max((t - bt) / 2, 0.001);
    for (j = 0; j <= NV; j++) {
      var a = (j / NV) * Math.PI * 2 - Math.PI / 2;
      P.push(-2.3 + L * u, ym + h * se(Math.sin(a), 2 / pw), w * se(Math.cos(a), 2 / pw));
    }
  }
  for (i = 0; i < NU; i++)
    for (j = 0; j < NV; j++) {
      var q = i * (NV + 1) + j,
        r = q + NV + 1;
      I.push(q, r, q + 1, r, r + 1, q + 1);
    }
  var g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
  g.setIndex(I);
  g.computeVertexNormals();
  return g;
}
var WK = [
    [0, 0.5],
    [0.04, 0.76],
    [0.14, 0.92],
    [0.32, 0.96],
    [0.5, 0.9],
    [0.72, 0.84],
    [0.9, 0.7],
    [1, 0.3],
  ],
  TK = [
    [0, 0.62],
    [0.06, 0.8],
    [0.2, 0.87],
    [0.4, 0.85],
    [0.6, 0.74],
    [0.8, 0.6],
    [0.94, 0.47],
    [1, 0.38],
  ],
  BK = [
    [0, 0.3],
    [0.1, 0.26],
    [0.5, 0.22],
    [0.9, 0.24],
    [1, 0.28],
  ];
var bodyGeo = loft(0, 1, WK, TK, BK, 2.5);
var cabGeo = loft(
  0.26,
  0.68,
  [
    [0.26, 0.4],
    [0.3, 0.6],
    [0.4, 0.68],
    [0.52, 0.64],
    [0.62, 0.55],
    [0.68, 0.4],
  ],
  [
    [0.26, 0.8],
    [0.32, 1],
    [0.42, 1.14],
    [0.52, 1.12],
    [0.6, 1],
    [0.68, 0.78],
  ],
  [
    [0.26, 0.7],
    [0.68, 0.7],
  ],
  2.2,
);
var halfW = function (x) {
  return cr(WK, (x + 2.3) / 4.6);
};

export function buildCar(real) {
  var g = new THREE.Group(),
    wheels = [];
  var paint = new THREE.MeshPhysicalMaterial({
    color: 0xff5a00,
    metalness: 0.8,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.5,
  });
  var glass = new THREE.MeshPhysicalMaterial({
    color: 0x03050a,
    metalness: 1,
    roughness: 0.04,
    clearcoat: 1,
    envMapIntensity: 2,
  });
  var dark = new THREE.MeshStandardMaterial({ color: 0x0b0b0e, roughness: 0.5, metalness: 0.5 });
  var rubber = new THREE.MeshStandardMaterial({ color: 0x090909, roughness: 0.95 });
  var alloy = new THREE.MeshStandardMaterial({ color: 0xd5dae4, metalness: 1, roughness: 0.16 });
  var red = new THREE.MeshStandardMaterial({ color: 0xd01010, roughness: 0.4, metalness: 0.3 });
  var led = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xdfeaff, emissiveIntensity: 4 });
  function add(geo, mat, x, y, z, rx, ry, rz) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rx) m.rotation.x = rx;
    if (ry) m.rotation.y = ry;
    if (rz) m.rotation.z = rz;
    m.castShadow = real;
    g.add(m);
    return m;
  }
  var B = function (x, y, z) {
    return new THREE.BoxGeometry(x, y, z);
  };
  add(bodyGeo, paint, 0, 0, 0);
  add(cabGeo, glass, 0, 0, 0);
  add(B(0.1, 0.36, 1.06), dark, -2.3, 0.46, 0);
  add(B(0.08, 0.1, 0.26), dark, 2.3, 0.34, 0); /* end caps */
  add(B(0.8, 0.04, 1.9), dark, 2.2, 0.2, 0);
  add(B(0.6, 0.12, 1.2), dark, -2.3, 0.2, 0); /* splitter, diffuser */
  add(B(0.46, 0.04, 1.9), dark, -2.25, 1.12, 0); /* wing */
  [-1, 1].forEach(function (z) {
    add(B(0.08, 0.32, 0.05), dark, -2.2, 0.95, z * 0.5);
    add(B(0.5, 0.14, 0.03), dark, -2.25, 1.1, z * 0.95); /* uprights, end plates */
    add(B(0.8, 0.14, 0.03), dark, -0.3, 0.5, z * (halfW(-0.3) + 0.005)); /* side intakes */
    add(B(2.2, 0.05, 0.06), dark, 0, 0.26, z * (halfW(0) - 0.02)); /* sills */
    add(B(0.22, 0.1, 0.2), paint, 0.85, 0.98, z * 0.8); /* mirrors */
    add(B(0.36, 0.035, 0.16), led, 2.12, 0.47, z * 0.52, 0, 0, -0.28); /* LED headlights */
  });
  add(
    B(0.04, 0.05, 1.0),
    new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff0000, emissiveIntensity: 4 }),
    -2.36,
    0.56,
    0,
  );
  [-1.7, -1.55, -1.4].forEach(function (x) {
    add(B(0.08, 0.02, 0.7), dark, x, 0.86, 0);
  }); /* engine cover slats */
  /* wheels */
  var tg = new THREE.CylinderGeometry(0.4, 0.4, 0.36, 48),
    rg = new THREE.CylinderGeometry(0.29, 0.29, 0.38, 40),
    dg2 = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32),
    spg = new THREE.BoxGeometry(0.5, 0.03, 0.04),
    arch = new THREE.CircleGeometry(0.47, 40);
  [[1.4], [-1.4]].forEach(function (px) {
    [1, -1].forEach(function (sg) {
      var wz = halfW(px[0]) - 0.02,
        w = new THREE.Group();
      var t = new THREE.Mesh(tg, rubber);
      t.rotation.x = Math.PI / 2;
      var r = new THREE.Mesh(rg, alloy);
      r.rotation.x = Math.PI / 2;
      var d = new THREE.Mesh(dg2, dark);
      d.rotation.x = Math.PI / 2;
      d.position.z = 0.13 * sg;
      w.add(t, r, d);
      for (var i = 0; i < 10; i++) {
        var q = new THREE.Mesh(spg, dark);
        q.position.z = 0.2 * sg;
        q.rotation.z = (i / 10) * Math.PI;
        w.add(q);
      }
      w.position.set(px[0], 0.4, sg * wz);
      w.traverse(function (o) {
        o.castShadow = real;
      });
      g.add(w);
      wheels.push(w);
      var ar = new THREE.Mesh(arch, new THREE.MeshBasicMaterial({ color: 0x020203, side: THREE.DoubleSide }));
      ar.position.set(px[0], 0.4, sg * (wz + 0.02));
      g.add(ar); /* wheel-well shadow */
      add(B(0.2, 0.12, 0.05), red, px[0] + 0.06, 0.56, sg * (wz - 0.05)); /* brake caliper */
    });
  });
  return { group: g, wheels: wheels };
}
