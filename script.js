(() => {
  'use strict';


  const INITIAL_TEXT = 'Engineering Portfolio';
  const FINAL_TEXT = "Kai's Engineering Portfolio";
  const TYPE_SPEED = 250; // ms per keystroke

  function generateStages(initial, final) {
    if (final.endsWith(initial)) {
      const prefix = final.slice(0, final.length - initial.length);
      const stages = [initial];
      for (let i = 1; i <= prefix.length; i += 1) {
        stages.push(prefix.slice(0, i) + initial);
      }
      return stages;
    }

    const stages = [];
    for (let i = 1; i <= final.length; i += 1) {
      stages.push(final.slice(0, i));
    }
    return stages;
  }

  function runTitleAnimation() {
    const textElement = document.getElementById('title');
    if (!textElement) return;

    const stages = generateStages(INITIAL_TEXT, FINAL_TEXT);
    let current = 0;

    const typeNext = () => {
      if (current >= stages.length) return;
      textElement.textContent = stages[current];
      current += 1;
      setTimeout(typeNext, TYPE_SPEED);
    };

    textElement.style.opacity = '1';
    textElement.addEventListener('animationend', (e) => {
      if (e.animationName === 'glideInFromTop') {
        typeNext();
      }
    });
  }

  function initNavHighlight() {
    const navLinks = document.querySelectorAll('#navbar a');
    const sections = Array.from(
      document.querySelectorAll('section[id]'),
    );

    if (!('IntersectionObserver' in window)) {
      // Fallback to scroll-based if IO not supported
      const fallback = () => {
        const offset = window.scrollY + 100;
        sections.forEach((section) => {
          const { top, height } = section.getBoundingClientRect();
          const absTop = top + window.scrollY;
          if (offset >= absTop && offset < absTop + height) {
            const id = section.getAttribute('id');
            navLinks.forEach((l) => {
              l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
            });
          }
        });
      };
      window.addEventListener('scroll', fallback, { passive: true });
      fallback();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Determine the entry closest to top that is intersecting
        let topMost = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (
            !topMost ||
            entry.boundingClientRect.top < topMost.boundingClientRect.top
          ) {
            topMost = entry;
          }
        });

        if (topMost) {
          const id = topMost.target.id;
          navLinks.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      },
      {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // centre of viewport
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offset = 80;
        const top = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // Cursor follower
  function initCursorFollower() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

    // Pause animation when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(update);
      }
    });

    // Start
    rafId = requestAnimationFrame(update);

    // Shrink on interactive elements
    document.querySelectorAll('a, button, input').forEach((elem) => {
      elem.addEventListener('mouseenter', () => {
        circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
        circle.style.backgroundColor = 'rgba(0, 0, 0, 1)';
      });
      elem.addEventListener('mouseleave', () => {
        circle.style.transform = 'translate(-50%, -50%) scale(1)';
        circle.style.backgroundColor = 'transparent';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    runTitleAnimation();
    initNavHighlight();
    initSmoothScroll();
    initCursorFollower();
  });
})();
