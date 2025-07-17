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

  /* ---------------------------------------------------------------
     Projects dropdown in navbar
  --------------------------------------------------------------- */
  function initProjectsDropdown() {
    const dropdown = document.getElementById('project-categories');
    if (!dropdown) return;

    fetch('./projects/index.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (!Array.isArray(list) || !list.length) return;

        const categories = [...new Set(list.map((p) => p.category || 'uncategorised'))];

        const formatCat = (slug) => {
          const roman = new Set([
            'i',
            'ii',
            'iii',
            'iv',
            'v',
            'vi',
            'vii',
            'viii',
            'ix',
            'x',
          ]);

          return slug
            .split('-')
            .map((part) => {
              if (roman.has(part)) return part.toUpperCase();
              return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join(' ');
        };

        categories.forEach((cat) => {
          const a = document.createElement('a');
          a.href = `projects.html?category=${encodeURIComponent(cat)}`;
          a.textContent = formatCat(cat);
          dropdown.appendChild(a);
        });
      })
      .catch(() => {
        /* ignore errors */
      });
  }



  /* ---------------------------------------------------------------
       Project Modal
    --------------------------------------------------------------- */
  function initProjectModal() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalImage = modal.querySelector('.modal-image');
    const imageFrame = modal.querySelector('.image-frame');
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

      // Determine a consistent aspect-ratio for this project based on
      // the largest width and height across all its images. This
      // avoids layout jumps without arbitrarily cropping anything.
      (function setFrameRatio() {
        let maxW = 0;
        let maxH = 0;
        let loaded = 0;
        const total = images.length;

        images.forEach((src) => {
          const tmp = new Image();
          tmp.onload = () => {
            if (tmp.naturalWidth && tmp.naturalHeight) {
              if (tmp.naturalWidth > maxW) maxW = tmp.naturalWidth;
              if (tmp.naturalHeight > maxH) maxH = tmp.naturalHeight;
            }
            loaded += 1;
            if (loaded === total && imageFrame) {
              imageFrame.style.setProperty(
                '--modal-aspect-ratio',
                `${maxW} / ${maxH}`,
              );
            }
          };
          tmp.src = src;
        });
      })();

      const updateSlide = () => {

        const src = images[current];
        modalImage.src = src;
        modalImage.alt = `${title} screenshot ${current + 1}`;

        // Update blurred backdrop using CSS variable
        if (imageFrame) {
          imageFrame.style.setProperty('--bg', `url("${src}")`);
        }
        const cap = captions[current] || '';
        modalCaption.textContent = cap;
        modalCaption.style.display = cap ? 'block' : 'none';
      };

      modalTitle.textContent = title;
      modalDesc.textContent = card.dataset.description;

      // Prefer explicit project page if provided, else fallback to GitHub
      if (card.dataset.project) {
        modalLink.href = `projects.html?project=${encodeURIComponent(
          card.dataset.project,
        )}`;
        modalLink.innerHTML = '<i class="bi bi-box-arrow-up-right"></i> View Project';
        modalLink.style.display = 'inline-flex';
      } else if (card.dataset.github) {
        modalLink.href = card.dataset.github;
        modalLink.innerHTML = '<i class="bi bi-github"></i> GitHub';
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

  (function ensureDialogSupport() {
    if (typeof HTMLDialogElement !== 'undefined' && 'showModal' in HTMLDialogElement.prototype) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = `
      dialog { display: none; position: fixed; inset: 50% auto auto 50%; transform: translate(-50%, -50%); }
      dialog[open] { display: block; }
      body.dialog-open { overflow: hidden; }
      dialog::backdrop, .dialog-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0 0 0 / 0.45);
      }
    `;
    document.head.appendChild(style);

    const dialogProto = HTMLElement.prototype;

    if (!dialogProto.showModal) {
      dialogProto.showModal = function showModal() {
        this.setAttribute('open', '');
        this.style.display = 'block';
        document.body.classList.add('dialog-open');
      };
    }

    if (!dialogProto.close) {
      dialogProto.close = function close() {
        this.removeAttribute('open');
        this.style.display = 'none';
        document.body.classList.remove('dialog-open');
      };
    }
  })();

  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const revealImmediately = () => {
      document
        .querySelectorAll('.reveal:not(.revealed)')
        .forEach((el) => el.classList.add('revealed'));
    };

    if (!('IntersectionObserver' in window)) {
      revealImmediately();
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

    setTimeout(revealImmediately, 1200);
  }

  window.initScrollReveal = initScrollReveal;

  document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      const hideLoader = () => {
        if (!loader) return;
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', () => loader.remove(), {
          once: true,
        });
        sessionStorage.setItem('siteLoaded', 'true');
      };

      if (sessionStorage.getItem('siteLoaded')) {
        hideLoader();
      } else {
        const timeoutId = setTimeout(hideLoader, 3000); // safety net

        document.addEventListener(
          'bananaLoaded',
          () => {
            clearTimeout(timeoutId);
            requestAnimationFrame(() => hideLoader());
          },
          { once: true },
        );
      }
    }

    runTitleAnimation();
    initNavHighlight();
    initSmoothScroll();

    initProjectsDropdown();

    if (typeof initBouncingBanana === 'function') {
      window.bouncingBanana = initBouncingBanana();
    }

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

      // Close menu when clicking any link inside nav (use capture to detect early)
      navLinks.addEventListener(
        'click',
        (e) => {
          const target = e.target.closest('a');
          if (!target) return;
          if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-label', 'Open Menu');
            navToggle.innerHTML = '<i class="bi bi-list"></i>';
          }
        },
        true,
      );
    }

    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
      const heroSection = document.getElementById('home');

      if (heroSection) {
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
      } else {
        // For other pages, small scroll toggles visibility
        const toggleOnScroll = () => {
          if (window.scrollY > 75) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        };
        toggleOnScroll();
        window.addEventListener('scroll', toggleOnScroll, { passive: true });
      }
    }
  });
})();
