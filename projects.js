(function () {
  'use strict';

  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  // function qsa(selector, scope = document) {
  //   return [...scope.querySelectorAll(selector)];
  // }

  function parseCSV(text) {
    return text
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const firstComma = line.indexOf(',');
        if (firstComma === -1) return { src: line.trim(), caption: '' };
        const src = line.slice(0, firstComma).trim();
        const caption = line.slice(firstComma + 1).trim();
        return { src, caption };
      });
  }

  const main = qs('#main');
  if (!main) return;

  // Year in footer
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('project');

  if (projectId) {
    renderProjectDetail(projectId);
  } else {
    renderProjectsIndex();
  }

  async function renderProjectsIndex() {
    let projectsList = [];
    try {
      const res = await fetch('./projects/index.json');
      if (res.ok) {
        projectsList = await res.json();
      }
    } catch (_) {
      // ignore
    }

    if (!projectsList.length) {
      projectsList = [
        {
          id: 'ping-pong-paddle',
          title: 'Ping Pong Paddle',
          cover: 'projects/ping-pong-paddle/images/cover.jpg',
        },
        {
          id: 'safety-badge',
          title: 'Safety Badge',
          cover: 'projects/safety-badge/images/cover.jpg',
        },
        {
          id: 'phone-case',
          title: 'Phone Case',
          cover: 'projects/phone-case/images/cover.jpg',
        },
      ];
    }

    const grid = document.createElement('div');
    grid.className = 'projects-index';

    projectsList.forEach((proj) => {
      const card = document.createElement('article');
      card.className = 'proj-card reveal';
      card.tabIndex = 0;
      card.dataset.id = proj.id;

      card.innerHTML = `
        <img src="${proj.cover}" alt="${proj.title} cover image" loading="lazy" />
        <div class="info">
          <h3>${proj.title}</h3>
          <p><span class="view-link">View full project <i class="bi bi-arrow-right"></i></span></p>
        </div>`;

      const navigate = () => {
        window.location.href = `projects.html?project=${encodeURIComponent(
          proj.id,
        )}`;
      };

      card.addEventListener('click', navigate);
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') navigate();
      });

      grid.appendChild(card);
    });

    main.appendChild(grid);

    // After DOM added, run reveal effects if script.js is loaded
    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }

  async function renderProjectDetail(id) {
    const container = document.createElement('article');
    container.className = 'project-detail';

    // Back link
    container.innerHTML = `<a href="projects.html" class="back-link"><i class="bi bi-arrow-left"></i> Back to projects</a>`;

    // Concurrently load markdown and image manifest
    const mdPromise = fetch(`projects/${id}/project.md`).then((r) =>
      r.ok ? r.text() : Promise.reject(),
    );
    const csvPromise = fetch(`projects/${id}/image_manifest.csv`).then((r) =>
      r.ok ? r.text() : '',
    );

    let mdText = '';
    let images = [];
    try {
      [mdText, images] = await Promise.all([mdPromise, csvPromise]);
    } catch (err) {
      container.innerHTML += `<p>Sorry, this project could not be loaded.</p>`;
      main.appendChild(container);
      return;
    }

    const html = window.marked ? window.marked.parse(mdText) : `<pre>${mdText}</pre>`;

    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const firstH1 = tmp.querySelector('h1');
    const titleText = firstH1 ? firstH1.textContent : id;
    if (firstH1) firstH1.remove();

    container.innerHTML += `<h1>${titleText}</h1>`;
    container.innerHTML += tmp.innerHTML;

    // Gallery
    if (images) {
      const parsed = parseCSV(images);
      if (parsed.length) {
        const gallery = document.createElement('div');
        gallery.className = 'project-gallery';
        parsed.forEach(({ src, caption }) => {
          const fig = document.createElement('figure');
          fig.innerHTML = `<img src="projects/${id}/images/${src}" alt="${caption || titleText}" loading="lazy" />`;
          if (caption) {
            fig.innerHTML += `<figcaption>${caption}</figcaption>`;
          }
          gallery.appendChild(fig);
        });
        container.appendChild(gallery);
      }
    }

    main.appendChild(container);
  }
})();
