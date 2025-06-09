// Physics-based smooth scrolling
let scrollVelocity = 0;
let currentScroll = 0;
let targetScroll = 0;
const friction = 0.88; // Lower = more momentum
const acceleration = 0.12; // Higher = more responsive
const minVelocity = 0.001;
let isScrolling = false;

// Initialize scroll position
window.addEventListener('load', () => {
    currentScroll = window.pageYOffset;
    targetScroll = currentScroll;
});

// Prevent default scroll and add velocity
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    // Calculate acceleration based on wheel delta
    const delta = e.deltaY;
    const scrollAcceleration = delta * acceleration;
    
    // Add momentum with easing
    scrollVelocity += scrollAcceleration;
    
    // Clamp velocity for better control
    const maxVelocity = 100;
    scrollVelocity = Math.max(-maxVelocity, Math.min(maxVelocity, scrollVelocity));
    
    isScrolling = true;
}, { passive: false });

// Touch support for mobile with physics
let touchStartY = 0;
let lastTouchY = 0;
let touchVelocity = 0;
let lastTouchTime = Date.now();

window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    lastTouchY = touchStartY;
    lastTouchTime = Date.now();
    touchVelocity = 0;
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTouchTime;
    
    if (timeDelta > 0) {
        const delta = lastTouchY - touchY;
        touchVelocity = delta / timeDelta * 16; // Normalize to 60fps
        scrollVelocity += touchVelocity * acceleration * 1.5;
    }
    
    lastTouchY = touchY;
    lastTouchTime = currentTime;
    isScrolling = true;
}, { passive: false });

window.addEventListener('touchend', () => {
    // Add remaining velocity for momentum on release
    scrollVelocity += touchVelocity * 0.5;
});

// Smooth scroll animation loop
function updateScroll() {
    // Apply friction when scrolling
    if (Math.abs(scrollVelocity) > minVelocity) {
        scrollVelocity *= friction;
    } else {
        scrollVelocity = 0;
        isScrolling = false;
    }
    
    // Update position
    currentScroll += scrollVelocity;
    
    // Elastic bounds with spring physics
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const overscrollDamping = 0.3;
    
    if (currentScroll < 0) {
        // Overscroll at top
        currentScroll *= (1 - overscrollDamping);
        scrollVelocity *= 0.5;
    } else if (currentScroll > maxScroll) {
        // Overscroll at bottom
        const overscroll = currentScroll - maxScroll;
        currentScroll = maxScroll + overscroll * (1 - overscrollDamping);
        scrollVelocity *= 0.5;
    }
    
    // Apply the scroll
    window.scrollTo(0, currentScroll);
    
    // Trigger scroll event for banana animation
    window.dispatchEvent(new Event('scroll'));
    
    requestAnimationFrame(updateScroll);
}

updateScroll();

// Keyboard support with acceleration
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            scrollVelocity -= 20;
            break;
        case 'ArrowDown':
            scrollVelocity += 20;
            break;
        case 'PageUp':
            scrollVelocity -= 60;
            break;
        case 'PageDown':
            scrollVelocity += 60;
            break;
        case 'Home':
            currentScroll = 0;
            scrollVelocity = 0;
            break;
        case 'End':
            currentScroll = document.body.scrollHeight - window.innerHeight;
            scrollVelocity = 0;
            break;
        case ' ':
            e.preventDefault();
            scrollVelocity += e.shiftKey ? -40 : 40;
            break;
    }
});

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