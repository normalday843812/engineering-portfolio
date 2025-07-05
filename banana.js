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
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      './banana/Banana.glb',
      (gltf) => {
        banana = gltf.scene;
        banana.scale.set(2.5, 2.5, 2.5);
        scene.add(banana);
        document.dispatchEvent(new Event('bananaLoaded'));
      },
      undefined,
      (error) => {
        console.error('Failed to load Banana.glb', error);
      },
    );

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
      
      const aspectRatio = container.clientWidth / container.clientHeight;
      
      const mobilePosition = { x: 0, y: -4, z: -7 };
      const desktopPosition = { x: 4.5, y: -2.5, z: -7 };
      
      const minAspectRatio = 0.6;
      const maxAspectRatio = 1.8;
      
      // Clamp aspect ratio to our range
      const clampedRatio = Math.max(minAspectRatio, Math.min(maxAspectRatio, aspectRatio));
      
      const t = (clampedRatio - minAspectRatio) / (maxAspectRatio - minAspectRatio);

      const easedT = t * t * (3 - 2 * t);
      const x = mobilePosition.x + (desktopPosition.x - mobilePosition.x) * easedT;
      const y = mobilePosition.y + (desktopPosition.y - mobilePosition.y) * easedT;
      const z = mobilePosition.z + (desktopPosition.z - mobilePosition.z) * easedT;
      
      banana.position.set(x, y, z);
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
      positionBanana();
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