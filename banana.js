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
    const bottomLight = new THREE.PointLight(0xffb742, 1.5, 100);
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
        object.scale.set(40, 40, 40);
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

    // Position the banana subtly in background (no scroll trajectory)
    function positionBanana() {
      if (!banana) return;
      banana.position.set(3, -2, -6);
    }

    // Run once banana mesh is ready
    const checkReady = setInterval(() => {
      if (banana) {
        positionBanana();
        clearInterval(checkReady);
      }
    }, 50);

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
