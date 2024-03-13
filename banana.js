document.addEventListener('DOMContentLoaded', () => {
    let scrollPosition = 0;
    let canvasVisible = false;
    let startScroll = 0;
    let scrollMax = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    const renderContainer = document.getElementById('render-container');
    renderer.setSize(renderContainer.offsetWidth, renderContainer.offsetHeight);
    renderContainer.appendChild(renderer.domElement);

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
    camera.position.z = 5;

    const softBottomLight = new THREE.PointLight(0xffa500, 2, 100);
    softBottomLight.position.set(0, 0, 0);
    scene.add(softBottomLight);

    const softTopLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    softTopLight.position.set(0, 2, 0);
    scene.add(softTopLight);

    function animate() {
        requestAnimationFrame(animate);
        if (banana) {
            banana.rotation.z += 0.01;
            banana.rotation.y = 1;
        }
        renderer.render(scene, camera);
    }

    function setBananaPosition(progress) {
        if (banana) {
            const startPosition = new THREE.Vector3(-10, 10, -10);
            const midPosition = new THREE.Vector3(-2, 2, -5);
            const endPosition = new THREE.Vector3(0, -2, 1);

            if (progress < 0.5) {
                let segmentProgress = progress / 0.5;
                banana.position.lerpVectors(startPosition, midPosition, segmentProgress);
            } else {
                let segmentProgress = (progress - 0.5) / 0.5;
                banana.position.lerpVectors(midPosition, endPosition, segmentProgress);
            }
        }
    }

    window.addEventListener('scroll', () => {
        if (!canvasVisible) {
            const canvasPosition = renderContainer.getBoundingClientRect().top;
            if (canvasPosition <= window.innerHeight) {
                canvasVisible = true;
                startScroll = window.scrollY;
                scrollMax = document.body.scrollHeight - window.innerHeight;
            }
            return;
        }

        scrollPosition = window.scrollY;
        const effectiveScroll = scrollPosition - startScroll;
        const progress = Math.max(0, Math.min(1, effectiveScroll / scrollMax));
        setBananaPosition(progress);
    });

    animate();
});