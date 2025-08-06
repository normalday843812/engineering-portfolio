(() => {
  'use strict';

  // Respect reduced-motion user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------------------------------------------------
       Cursor follower
    --------------------------------------------------------------- */
    const circle = document.createElement('div');
    circle.className = 'circle-follow';
    document.body.appendChild(circle);

    let targetX = 0;
    let targetY = 0;
    let currentX = -100; // Default off-screen
    let currentY = -100;
    const EASE = 0.25;

    let rafId;
    let firstMove = true;

    circle.style.transition = 'opacity 0.3s ease, transform 0.25s ease, background-color 0.25s ease';

    // Start hidden
    circle.style.opacity = '0';

    const interactiveSelectors = [
      'a',
      'button',
      'input',
      '.project-card',
      '.proj-card',
      '.back-link',
      '[data-hover]',
    ].join(',');

    let hoverActive = false;

    function setShrink(state, animate = true) {
      if (state === hoverActive) return;
      hoverActive = state;

      if (!animate) {
        circle.style.transition = 'none';
      }

      if (state) {
        circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
        circle.style.backgroundColor = 'black';
      } else {
        circle.style.transform = 'translate(-50%, -50%) scale(1)';
        circle.style.backgroundColor = 'transparent';
      }

      if (!animate) {
        requestAnimationFrame(() => {
          circle.style.transition = 'opacity 0.3s ease, transform 0.25s ease, background-color 0.25s ease';
        });
      }
    }

    const storedX = sessionStorage.getItem('cursorLastX');
    const storedY = sessionStorage.getItem('cursorLastY');
    const storedHover = sessionStorage.getItem('cursorHover') === 'true'; // true if was hovered

    if (storedX && storedY) {
      currentX = parseFloat(storedX);
      currentY = parseFloat(storedY);
      targetX = currentX;
      targetY = currentY;
      circle.style.left = `${currentX}px`;
      circle.style.top = `${currentY}px`;

      const elementAtPoint = document.elementFromPoint(currentX, currentY);
      const isOverInteractive = elementAtPoint && elementAtPoint.closest(interactiveSelectors);

      if (storedHover && isOverInteractive) {
        setShrink(true, false);
      } else if (storedHover && !isOverInteractive) {
        setShrink(true, false);
        requestAnimationFrame(() => setShrink(false, true)); // Animate out
      } else if (!storedHover && isOverInteractive) {
        setShrink(false, false);
        requestAnimationFrame(() => setShrink(true, true)); // Animate in
      } else {
        setShrink(false, false);
      }

      circle.style.opacity = '1';
      firstMove = false;
      rafId = requestAnimationFrame(update);
    }

    function update() {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      currentX += dx * EASE;
      currentY += dy * EASE;
      circle.style.left = `${currentX}px`;
      circle.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(update);
    }

    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      // Store the position and current hover state for next page load
      sessionStorage.setItem('cursorLastX', targetX);
      sessionStorage.setItem('cursorLastY', targetY);
      sessionStorage.setItem('cursorHover', hoverActive ? 'true' : 'false');

      if (firstMove) {
        currentX = targetX;
        currentY = targetY;
        circle.style.opacity = '1';
        firstMove = false;
        rafId = requestAnimationFrame(update);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(update);
      }
    });

    rafId = requestAnimationFrame(update);

    document.addEventListener(
      'mouseover',
      (e) => {
        if (e.target.closest(interactiveSelectors)) setShrink(true);
      },
      true,
    );

    document.addEventListener(
      'mouseout',
      (e) => {
        if (e.target.closest(interactiveSelectors)) {
          // If leaving to another interactive inside same element, ignore
          const related = e.relatedTarget;
          if (!related || !related.closest(interactiveSelectors)) {
            setShrink(false);
          }
        }
      },
      true,
    );
  });
})();