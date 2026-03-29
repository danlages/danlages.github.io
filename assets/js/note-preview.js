(function () {
  'use strict';

  function getFirstPreviewableLink(noteBody) {
    const links = noteBody.querySelectorAll('a[href]');

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;

      try {
        const url = new URL(href, window.location.origin);
        if (!/^https?:$/.test(url.protocol)) continue;
        return { element: link, url };
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  function createPreviewCard(url) {
    const card = document.createElement('a');
    card.className = 'tweet-note__preview';
    card.href = url.href;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const image = document.createElement('img');
    image.className = 'tweet-note__preview-image';
    image.alt = '';
    image.loading = 'lazy';

    const imageFallback = document.createElement('div');
    imageFallback.className = 'tweet-note__preview-image-fallback is-visible';
    imageFallback.setAttribute('aria-hidden', 'true');

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'tweet-note__preview-image-fallback-icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.8');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm21.44 11.05-9.19 9.19a6 6 0 1 1-8.49-8.48l9.2-9.2a4 4 0 0 1 5.65 5.66l-9.2 9.19a2 2 0 1 1-2.82-2.83l8.48-8.48');

    icon.appendChild(path);
    imageFallback.appendChild(icon);

    const content = document.createElement('div');
    content.className = 'tweet-note__preview-content';

    const domain = document.createElement('p');
    domain.className = 'tweet-note__preview-domain';
    domain.textContent = url.hostname.replace(/^www\./, '');

    const title = document.createElement('p');
    title.className = 'tweet-note__preview-title';
    title.textContent = url.hostname.replace(/^www\./, '') + url.pathname;

    const description = document.createElement('p');
    description.className = 'tweet-note__preview-description';
    description.textContent = 'Open link';

    content.appendChild(domain);
    content.appendChild(title);
    content.appendChild(description);

    card.appendChild(image);
    card.appendChild(imageFallback);
    card.appendChild(content);

    return {
      card,
      image,
      imageFallback,
      title,
      description,
      domain
    };
  }

  function getMetaContent(doc, selectors) {
    for (const selector of selectors) {
      const node = doc.querySelector(selector);
      if (node && node.getAttribute('content')) {
        return node.getAttribute('content').trim();
      }
    }

    return '';
  }

  function getImageFallback(doc) {
    const candidates = [
      'meta[itemprop="image"]',
      'link[rel="image_src"]',
      'article img[src]',
      'main img[src]',
      'img[src]'
    ];

    for (const selector of candidates) {
      const node = doc.querySelector(selector);
      if (!node) continue;

      const value = (node.getAttribute('content') || node.getAttribute('href') || node.getAttribute('src') || '').trim();
      if (value) return value;
    }

    return '';
  }

  async function fetchHtmlWithFallbacks(url) {
    const target = url.href;
    const endpoints = [
      {
        url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent(target),
        transform: (text) => text
      },
      {
        url: 'https://api.allorigins.win/get?url=' + encodeURIComponent(target),
        transform: (text) => {
          try {
            const parsed = JSON.parse(text);
            return (parsed && parsed.contents) || '';
          } catch (error) {
            return '';
          }
        }
      },
      {
        url: 'https://corsproxy.io/?' + encodeURIComponent(target),
        transform: (text) => text
      }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url, { method: 'GET' });
        if (!response.ok) continue;

        const body = await response.text();
        const html = endpoint.transform(body);
        if (html) return html;
      } catch (error) {
        continue;
      }
    }

    return '';
  }

  async function fetchMetadata(url) {
    const html = await fetchHtmlWithFallbacks(url);
    if (!html) return null;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    return {
      title: getMetaContent(doc, [
        'meta[property="og:title"]',
        'meta[name="twitter:title"]'
      ]) || (doc.title || '').trim(),
      description: getMetaContent(doc, [
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[name="description"]'
      ]),
      image: getMetaContent(doc, [
        'meta[property="og:image"]',
        'meta[property="og:image:url"]',
        'meta[name="twitter:image"]',
        'meta[name="twitter:image:src"]'
      ]) || getImageFallback(doc)
    };
  }

  async function enhanceNote(note) {
    const noteBody = note.querySelector('[data-note-body]');
    const previewWrap = note.querySelector('[data-note-preview-wrap]');
    if (!noteBody || !previewWrap) return;

    if (note.dataset.previewEnhanced === 'true') return;

    if (previewWrap.querySelector('.tweet-note__preview')) {
      previewWrap.hidden = false;
      note.dataset.previewEnhanced = 'true';
      return;
    }

    const linkData = getFirstPreviewableLink(noteBody);
    if (!linkData) {
      note.classList.add('is-text-only');
      note.dataset.previewEnhanced = 'true';
      return;
    }

    const sourceText = (linkData.element.textContent || '').trim() || linkData.url.href;
    const hasCustomSourceTitle = sourceText !== linkData.url.href;

    const sourceParent = linkData.element.parentElement;
    linkData.element.remove();
    if (
      sourceParent &&
      sourceParent.tagName === 'P' &&
      sourceParent.textContent.trim() === ''
    ) {
      sourceParent.remove();
    }

    const preview = createPreviewCard(linkData.url);
    preview.title.textContent = sourceText;
    previewWrap.appendChild(preview.card);
    previewWrap.hidden = false;

    try {
      const metadata = await fetchMetadata(linkData.url);
      if (!metadata) return;

      if (metadata.title && !hasCustomSourceTitle) {
        preview.title.textContent = metadata.title;
      }

      if (metadata.description) {
        preview.description.textContent = metadata.description;
      }

      if (metadata.image) {
        const imageUrl = new URL(metadata.image, linkData.url.href).href;
        preview.image.src = imageUrl;
        preview.image.classList.add('is-visible');
        preview.imageFallback.classList.remove('is-visible');
      }
    } catch (error) {
      // Keep fallback preview when metadata cannot be fetched.
    } finally {
      note.dataset.previewEnhanced = 'true';
    }
  }

  function init() {
    const notes = document.querySelectorAll('[data-note-card]');
    notes.forEach((note) => {
      enhanceNote(note);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
