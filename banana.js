(function () {
  'use strict';

  // Wait for the render container to come into view before initialising THREE.js
  const container = document.getElementById('render-container');
  if (!container) return;

  // Use IntersectionObserver to lazily create the scene the first time the
  // banana section is at least 25% visible.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          initScene();
        }
      });
    },
    { threshold: 0.25 },
  );

  observer.observe(container);

  function initScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting ------------------------------------------------------------
    const bottomLight = new THREE.PointLight(0xffa500, 2, 100);
    bottomLight.position.set(0, 0, 0);
    scene.add(bottomLight);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    // Banana mesh ---------------------------------------------------------
    let banana;
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./banana/Banana.mtl', (materials) => {
      materials.preload();
      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('./banana/Banana.obj', (object) => {
        object.scale.set(100, 100, 100);
        banana = object;
        scene.add(banana);
      });
    });

    // Animation loop ------------------------------------------------------
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (banana) {
        banana.rotation.z += 0.01;
        banana.rotation.y = 1;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Scroll progress controls banana trajectory -------------------------
    let startScroll = null;

    const handleScroll = () => {
      if (startScroll === null) startScroll = window.scrollY;

      const maxScroll =
        document.body.scrollHeight - window.innerHeight - startScroll;
      const effectiveScroll = Math.max(0, window.scrollY - startScroll);
      const progress = Math.min(1, effectiveScroll / maxScroll);
      updateBananaPosition(progress);
    };

    function updateBananaPosition(progress) {
      if (!banana) return;
      const startPos = new THREE.Vector3(-10, 10, -10);
      const midPos = new THREE.Vector3(-2, 2, -5);
      const endPos = new THREE.Vector3(0, -2, 1);

      if (progress < 0.5) {
        banana.position.lerpVectors(startPos, midPos, progress / 0.5);
      } else {
        banana.position.lerpVectors(midPos, endPos, (progress - 0.5) / 0.5);
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Resize handler ------------------------------------------------------
    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onResize);

    // Pause rendering when the tab is hidden -----------------------------
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        animate();
      }
    });
  }
})();
