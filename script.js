(() => {
  'use strict';


  const INITIAL_TEXT = 'Kai';
  const FINAL_TEXT = 'Kai Stewart';
  const TYPE_SPEED = 250; // ms per keystroke

  function generateStages(initial, final) {
    // If final string starts with the initial (e.g., "Kai" -> "Kai Stewart")
    if (final.startsWith(initial)) {
      const suffix = final.slice(initial.length);
      const stages = [initial];
      for (let i = 1; i <= suffix.length; i += 1) {
        stages.push(initial + suffix.slice(0, i));
      }
      return stages;
    }

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
    const navLinks = Array.from(
      document.querySelectorAll('#navbar .nav-links a[href^="#"]'),
    );
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
    document.querySelectorAll('#navbar .nav-links a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offset = 70;
        const top =
          targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
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
    document.querySelectorAll('a, button, input, .project-card, [data-hover]').forEach((elem) => {
      elem.addEventListener('mouseenter', () => {
        circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
        circle.style.backgroundColor =
          getComputedStyle(document.documentElement).getPropertyValue('--clr-accent');
      });
      elem.addEventListener('mouseleave', () => {
        circle.style.transform = 'translate(-50%, -50%) scale(1)';
        circle.style.backgroundColor = 'transparent';
      });
    });
  }

  // Project modal ---------------------------------------------------------
  function initProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalImage = modal.querySelector('.modal-image');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-description');
    const modalCaption = modal.querySelector('.modal-caption');
    const modalLink = modal.querySelector('.modal-link');
    const closeBtn = modal.querySelector('.modal-close');
    const prevBtn = modal.querySelector('.carousel-nav.prev');
    const nextBtn = modal.querySelector('.carousel-nav.next');

    let images = [];
    let captions = [];
    let current = 0;

    const openModal = (card) => {
      const title = card.dataset.title;

      images = card.dataset.images
        ? card.dataset.images.split(',')
        : [card.dataset.image];
      captions = card.dataset.captions
        ? card.dataset.captions.split('|')
        : images.map(() => '');
      current = 0;

      const updateSlide = () => {
        modalImage.src = images[current];
        modalImage.alt = `${title} screenshot ${current + 1}`;
        const cap = captions[current] || '';
        modalCaption.textContent = cap;
        modalCaption.style.display = cap ? 'block' : 'none';
      };

      modalTitle.textContent = title;
      modalDesc.textContent = card.dataset.description;

      if (card.dataset.github) {
        modalLink.href = card.dataset.github;
        modalLink.style.display = 'inline-flex';
      } else {
        modalLink.style.display = 'none';
      }

      updateSlide();

      if (images.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
      modal.showModal();

      const showPrev = () => {
        current = (current - 1 + images.length) % images.length;
        updateSlide();
      };
      const showNext = () => {
        current = (current + 1) % images.length;
        updateSlide();
      };

      prevBtn.onclick = showPrev;
      nextBtn.onclick = showNext;

      modal.onkeydown = (e) => {
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      };
    };

    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => openModal(card));
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') openModal(card);
      });
    });

    closeBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.open) modal.close();
    });
  }

  // Scroll reveal animation
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));
  }

  document.addEventListener('DOMContentLoaded', () => {
    runTitleAnimation();
    initNavHighlight();
    initSmoothScroll();
    initCursorFollower();
    initScrollReveal();
    initProjectModal();

    // Scroll indicator click scrolls to next section
    const indicator = document.querySelector('.scroll-indicator');
    if (indicator) {
      indicator.addEventListener('click', () => {
        const sections = Array.from(document.querySelectorAll('main section'));
        const hero = document.getElementById('home');
        const idx = sections.indexOf(hero);
        const next = sections[idx + 1];
        if (next) {
          const offset = 70;
          const top = next.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    }

    // Mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const isOpen = navLinks.classList.contains('open');
        navToggle.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
        navToggle.innerHTML = isOpen ? '<i class="bi bi-x"></i>' : '<i class="bi bi-list"></i>';
      });

      // Close menu when clicking a nav link (on small screens)
      navLinks.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => {
          if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-label', 'Open Menu');
            navToggle.innerHTML = '<i class="bi bi-list"></i>';
          }
        });
      });
    }

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('home');
    if (navbar && heroSection) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              navbar.classList.add('scrolled');
            } else {
              navbar.classList.remove('scrolled');
            }
          });
        },
        { rootMargin: `-${navbar.offsetHeight}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(heroSection);
    }
  });
})();
