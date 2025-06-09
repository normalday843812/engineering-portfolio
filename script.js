window.onload = function () {
    const textElement = document.getElementById('title');
    const finalText = "Kai's Engineering Portfolio"
    const textStages = [...finalText].map((_, i) => finalText.slice(0, i + 1));
    const delay = [...finalText].map((_, i, arr) => i === arr.length - 1 ? 500 : 0);
    let currentStage = 0;

    function typeText() {
        if (currentStage < textStages.length) {
            textElement.textContent = textStages[currentStage];
            let totalDelay = 250 + delay[currentStage];
            setTimeout(typeText, totalDelay);
            currentStage++;
        }
    }

    textElement.style.opacity = 1;
    textElement.style.animation = 'glideInFromTop 1.5s ease-out, fadeInEffect 1.5s forwards';

    textElement.addEventListener('animationend', (event) => {
        if (event.animationName === 'glideInFromTop') {
            typeText();
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const circle = document.createElement('div');
    circle.className = 'circle-follow';
    document.body.appendChild(circle);

    let targetX = 0;
    let targetY = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    const easeFactor = 0.25;
    const initialEaseFactor = 0.05;
    let isInitialMove = true;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (isInitialMove) {
            startLoadingAnimation();
            isInitialMove = false;
        }
    });

    function updateCirclePosition() {
        const dx = targetX - currentX;
        const dy = targetY - currentY;

        const currentEaseFactor = isInitialMove ? initialEaseFactor : easeFactor;

        currentX += dx * currentEaseFactor;
        currentY += dy * currentEaseFactor;

        circle.style.left = `${currentX}px`;
        circle.style.top = `${currentY}px`;

        requestAnimationFrame(updateCirclePosition);
    }

    function startLoadingAnimation() {
        let start = null;
        const duration = 1000;

        function loadingStep(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;

            const angle = 2 * Math.PI * progress;
            circle.style.clipPath = `polygon(50% 50%, ${50 + 50 * Math.cos(angle)}% ${50 + 50 * Math.sin(angle)}%, 50% 50%)`;

            if (progress < 1) {
                requestAnimationFrame(loadingStep);
            } else {
                circle.style.clipPath = 'none';
                updateCirclePosition();
            }
        }

        requestAnimationFrame(loadingStep);
    }

    circle.style.position = 'fixed';
    circle.style.left = '50%';
    circle.style.top = '50%';
    circle.style.transform = 'translate(-50%, -50%)';
    circle.style.pointerEvents = 'none';
    circle.style.transition = 'background-color 0.3s, transform 0.3s';

    document.querySelectorAll('a, button, input').forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
            circle.style.backgroundColor = 'rgba(0, 0, 0, 1)';
        });
        elem.addEventListener('mouseleave', () => {
            circle.style.transform = 'translate(-50%, -50%) scale(1)';
            circle.style.backgroundColor = 'transparent';
        });
    });
});