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
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    const EASE = 0.25;

    let rafId;

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
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(update);
      }
    });

    rafId = requestAnimationFrame(update);

    // -----------------------------------------------------------------
    // Hover feedback (delegated so dynamically-inserted elements work) 
    // -----------------------------------------------------------------
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

    function setShrink(state) {
      if (state === hoverActive) return;
      hoverActive = state;
      if (state) {
        circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
        circle.style.backgroundColor = 'black';
      } else {
        circle.style.transform = 'translate(-50%, -50%) scale(1)';
        circle.style.backgroundColor = 'transparent';
      }
    }

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
