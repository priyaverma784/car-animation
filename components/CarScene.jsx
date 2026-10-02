"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildCar } from "@/lib/buildCar";
import { sampleCamera } from "@/lib/cameraPath";


export default function CarScene({ stateRef }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const S = stateRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tmx = 0,
      tmy = 0,
      mx = 0,
      my = 0,
      raf,
      ro;
    const onMove = (e) => {
      tmx = (e.clientX / innerWidth) * 2 - 1;
      tmy = (e.clientY / innerHeight) * 2 - 1;
    };
    addEventListener("pointermove", onMove);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    /* ---- scene, lights, road, streaks ---- */
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0d14, 10, 32);

    /* Studio softboxes become the car's reflections */
    var envS = new THREE.Scene();
    envS.background = new THREE.Color(0x0d121c);
    [
      [0, 8, 0, 14, 0.2, 6, 7],
      [-9, 3, 0, 0.2, 4, 14, 3.5],
      [9, 3, 0, 0.2, 4, 14, 3.5],
      [0, 3, -9, 16, 3, 0.2, 5],
      [0, 2, 9, 10, 2, 0.2, 2],
    ].forEach(function (p) {
      var m = new THREE.Mesh(
        new THREE.BoxGeometry(p[3], p[4], p[5]),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.97, 0.92).multiplyScalar(p[6]) }),
      );
      m.position.set(p[0], p[1], p[2]);
      envS.add(m);
    });
    var pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(envS, 0.035).texture;

    var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);

    var key = new THREE.DirectionalLight(0xfff1e0, 1.7);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    var sc = key.shadow.camera;
    sc.left = -6;
    sc.right = 6;
    sc.top = 6;
    sc.bottom = -6;
    sc.near = 1;
    sc.far = 20;
    key.shadow.bias = -0.0004;
    var rimL = new THREE.DirectionalLight(0x6f9bff, 2);
    rimL.position.set(-6, 3, -5);
    var under = new THREE.PointLight(0xff6a00, 1.6, 7);
    under.position.set(0, 0.15, 0); /* warm underglow */
    scene.add(key, rimL, under);

    /* Glossy transparent road so the mirrored car shows through as a reflection */
    function floor(w, h, y, col, rough, metal, op) {
      var m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshStandardMaterial({
          color: col,
          roughness: rough,
          metalness: metal,
          transparent: true,
          opacity: op,
          depthWrite: false,
        }),
      );
      m.rotation.x = -Math.PI / 2;
      m.position.y = y;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    }
    floor(90, 90, 0, 0x0d1119, 0.9, 0.1, 0.9);
    floor(90, 5.6, 0.004, 0x14171d, 0.2, 0.7, 0.8);

    var GAP = 4,
      dashes = new THREE.Group(),
      dg = new THREE.PlaneGeometry(1.4, 0.08),
      dm = new THREE.MeshBasicMaterial({ color: 0xcfd5df });
    for (var i = 0; i < 26; i++)
      [2.4, -2.4].forEach(function (z) {
        var d = new THREE.Mesh(dg, dm);
        d.rotation.x = -Math.PI / 2;
        d.position.set((i - 13) * GAP, 0.012, z);
        dashes.add(d);
      });
    scene.add(dashes);

    /* Speed streaks: thin lines that stretch and brighten with scroll velocity */
    var N = 140,
      sp = [],
      pos = new Float32Array(N * 6);
    for (var i = 0; i < N; i++)
      sp.push({
        x: Math.random() * 40 - 20,
        y: 0.15 + Math.random() * 3.2,
        z: (Math.random() < 0.5 ? -1 : 1) * (2.8 + Math.random() * 6),
        l: 1 + Math.random() * 3,
      });
    var sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var smat = new THREE.LineBasicMaterial({
      color: 0xffb27a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    var streaks = new THREE.LineSegments(sg, smat);
    streaks.frustumCulled = false;
    scene.add(streaks);

    /* ---- car, glow, camera, render loop ---- */
    var main = buildCar(true),
      mirror = buildCar(false);
    mirror.group.scale.y = -1; /* mirrored copy = fake floor reflection */
    var car = new THREE.Group();
    car.add(main.group, mirror.group);
    scene.add(car);

    /* Additive glow sprites (cheap bloom) */
    var cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    var cx = cv.getContext("2d"),
      gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(0.25, "rgba(255,255,255,.35)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    cx.fillStyle = gr;
    cx.fillRect(0, 0, 128, 128);
    var gtex = new THREE.CanvasTexture(cv);
    function glow(col, x, y, z, sx, sy) {
      var s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: gtex,
          color: col,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          fog: false,
          transparent: true,
          opacity: 0.85,
        }),
      );
      s.position.set(x, y, z);
      s.scale.set(sx, sy, 1);
      car.add(s);
    }
    glow(0xcfe0ff, 2.25, 0.5, 0.52, 1.6, 1.6);
    glow(0xcfe0ff, 2.25, 0.5, -0.52, 1.6, 1.6);
    glow(0xff2a1a, -2.5, 0.56, 0, 2.4, 0.7);

    function resize() {
      var w = mount.clientWidth,
        h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    var cp = new THREE.Vector3(),
      cl = new THREE.Vector3(),
      smooth = 0,
      sv = 0,
      drive = 0,
      last = performance.now();
    (function tick(now) {
      var dt = Math.min((now - last) / 1000 || 0.016, 0.05);
      last = now;
      smooth += (S.progress - smooth) * (reduced ? 1 : 0.07);
      sv += (Math.min(Math.abs(S.vel) / 2500, 1) - sv) * 0.08; /* smoothed scroll speed 0..1 */
      mx += (tmx - mx) * 0.05;
      my += (tmy - my) * 0.05;
      sampleCamera(smooth, cp, cl);
      var k = camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.9 : 1;
      cp.sub(cl).multiplyScalar(k).add(cl);
      cp.x += mx * 0.45;
      cp.y += -my * 0.25; /* mouse parallax */
      cp.y += Math.sin(now * 0.0012) * 0.015 * (1 - sv); /* idle breathing */
      camera.position.copy(cp);
      camera.lookAt(cl);
      camera.fov = 38 + sv * 9;
      camera.updateProjectionMatrix(); /* speed stretch */

      var dist = smooth * 90;
      car.position.x = S.introX;
      drive += S.introX < -0.01 ? dt * (8 + Math.abs(S.introX)) : 0; /* wheels spin during the drive-in */
      main.wheels.forEach(function (w, i) {
        w.rotation.z = -(dist + drive) / 0.4;
        mirror.wheels[i].rotation.z = w.rotation.z;
      });
      dashes.position.x = -((dist + drive) % GAP);
      car.rotation.y = Math.sin(smooth * 8) * 0.035 - mx * 0.04;
      car.rotation.z = -sv * 0.012 * Math.sign(S.vel || 1);
      main.group.position.y = mirror.group.position.y = Math.sin(dist * 1.6) * 0.008;
      under.intensity = 1.2 + sv * 1.8;

      var p = sg.attributes.position.array,
        v = (0.25 + sv * 1.6 + (S.introX < -0.01 ? 0.4 : 0)) * dt * 30;
      for (var i = 0; i < N; i++) {
        var s = sp[i];
        s.x -= v;
        if (s.x < -20) s.x += 40;
        var L = s.l * (0.4 + sv * 3);
        p[i * 6] = s.x;
        p[i * 6 + 1] = s.y;
        p[i * 6 + 2] = s.z;
        p[i * 6 + 3] = s.x + L;
        p[i * 6 + 4] = s.y;
        p[i * 6 + 5] = s.z;
      }
      sg.attributes.position.needsUpdate = true;
      smat.opacity = 0.08 + sv * 0.7;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    })(performance.now());

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      ro.disconnect();
      pm.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [stateRef]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
