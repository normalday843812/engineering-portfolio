function initBouncingBanana() {
  // Prevent duplicate instances when the script is imported twice.
  if (window.__bouncingBananaInstance) {
    return window.__bouncingBananaInstance;
  }
  const footer = document.querySelector('footer');
  if (!footer) return;

  const banana = document.createElement('img');
  banana.src = './assets/android-chrome-192x192.png';
  banana.alt = 'Bouncing banana - Click to play game!';
  banana.className = 'bouncing-banana';

  banana.style.cssText = `
    position: absolute;
    width: 48px;
    height: 48px;
    cursor: pointer;
    z-index: 1500;
    pointer-events: auto;
    user-select: none;
    transition: none;
    border-radius: 8px;
  `;

  footer.style.position = 'relative';
  footer.style.overflow = 'hidden';

  footer.appendChild(banana);

  let x, y, vx, vy;
  let rotation = 0;
  let isActive = true;

  // ------------------------------------
  // Mouse interaction
  // ------------------------------------
  let mouseX = null;
  let mouseY = null;

  document.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX + window.scrollX;
      mouseY = e.clientY + window.scrollY;
    },
    { passive: true },
  );

  // Constants
  const gravity = 0.0;
  const bounce = 0.75;
  const friction = 0.995;
  const rotationSpeed = 8;
  const minVelocity = 0.5;

  function getFooterBounds() {
    const rect = footer.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      right: rect.right + window.scrollX,
      top: rect.top + window.scrollY,
      bottom: rect.bottom + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  }

  function initPosition() {
    const bounds = getFooterBounds();
    x = bounds.left + Math.random() * (bounds.width - 48);
    y = bounds.top + Math.random() * (bounds.height - 48);
    vx = (Math.random() - 0.5) * 12;
    vy = (Math.random() - 0.5) * 8;
  }

  initPosition();

  // Animation loop
  function animate() {
    if (!isActive) return;

    const bounds = getFooterBounds();

    vy += gravity;

    x += vx;
    y += vy;

    if (x <= bounds.left) {
      x = bounds.left;
      vx = Math.abs(vx) * bounce;
      if (vx < minVelocity) vx = minVelocity * 2;
    } else if (x >= bounds.right - 48) {
      x = bounds.right - 48;
      vx = -Math.abs(vx) * bounce;
      if (Math.abs(vx) < minVelocity) vx = -minVelocity * 2;
    }

    if (y <= bounds.top) {
      y = bounds.top;
      vy = Math.abs(vy) * bounce;
      if (vy < minVelocity) vy = minVelocity * 2;
    } else if (y >= bounds.bottom - 48) {
      y = bounds.bottom - 48;
      vy = -Math.abs(vy) * bounce;
      if (Math.abs(vy) < minVelocity) vy = -minVelocity * 2;
    }

    const pushRadius = 80;
    if (mouseX !== null) {
      const centerX = x + 24;
      const centerY = y + 24;
      const dx = centerX - mouseX;
      const dy = centerY - mouseY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0 && dist < pushRadius) {
        const pointerInside =
          mouseX >= x &&
          mouseX <= x + 48 &&
          mouseY >= y &&
          mouseY <= y + 48;

        if (!pointerInside) {
          const strength = (1 - dist / pushRadius) * 4; // 0..4
          vx += (dx / dist) * strength;
          vy += (dy / dist) * strength;
        }
      }
    }

    vx *= friction;
    vy *= friction;

    if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) {
      vx += (Math.random() - 0.5) * 3;
      vy += (Math.random() - 0.5) * 2;
    }

    const speed = Math.sqrt(vx * vx + vy * vy);
    rotation += rotationSpeed * (speed / 10);

    banana.style.left = x - bounds.left + 'px';
    banana.style.top = y - bounds.top + 'px';
    banana.style.transform = `rotate(${rotation}deg)`;

    requestAnimationFrame(animate);
  }

  banana.addEventListener('click', (e) => {
    e.preventDefault();
    vx += (Math.random() - 0.5) * 15;
    vy -= Math.random() * 10 + 5;

    setTimeout(() => {
      window.location.href = 'https://normalday843812.github.io/engineering-portfolio/game.html';
    }, 150);
  });

  banana.addEventListener('mouseenter', () => {
    banana.style.filter = 'brightness(1.2) drop-shadow(0 0 10px rgba(255, 183, 66, 0.5))';
    banana.style.transform += ' scale(1.1)';
  });

  banana.addEventListener('mouseleave', () => {
    banana.style.filter = '';
  });

  isActive = true;
  requestAnimationFrame(animate);

  window.__bouncingBananaInstance = {
    banana,
    destroy() {
      isActive = false;
      banana.remove();
      delete window.__bouncingBananaInstance;
    },
  };

  return window.__bouncingBananaInstance;
}

// Initialise automatically at script load
initBouncingBanana();
