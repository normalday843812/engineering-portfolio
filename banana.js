(function () {
  'use strict';
  const container = document.getElementById('render-container');
  if (!container) return;

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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    container.appendChild(renderer.domElement);

    const bottomLight = new THREE.PointLight(0xffb742, 0.5, 100);
    bottomLight.position.set(0, 0, 0);
    scene.add(bottomLight);

    const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.2);
    hemiLight.position.set(0, 2, 0);
    scene.add(hemiLight);

    let banana;
    const mtlLoader = new THREE.MTLLoader();
    mtlLoader.load('./banana/Banana.mtl', (materials) => {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load('./banana/Banana.obj', (object) => {
        object.scale.set(2.5, 2.5, 2.5);
        banana = object;
        scene.add(banana);
        document.dispatchEvent(new Event('bananaLoaded'));
      });
    });

    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (banana) {
        banana.rotation.x += 0.0025;
        banana.rotation.y = -2.5;
      }
      renderer.render(scene, camera);
    };
    animate();

    function positionBanana() {
      if (!banana) return;
      banana.position.set(4, -2.5, -7);
    }

    const checkReady = setInterval(() => {
      if (banana) {
        positionBanana();
        clearInterval(checkReady);
      }
    }, 50);

    function onResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        animate();
      }
    });
  }
})();