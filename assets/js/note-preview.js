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
    card.appendChild(content);

    return {
      card,
      image,
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

  async function fetchMetadata(url) {
    const endpoint = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url.href);
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) return null;

    const html = await response.text();
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
        'meta[name="twitter:image"]'
      ])
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
    const sourceTextNode = document.createElement('span');
    sourceTextNode.textContent = sourceText;
    linkData.element.replaceWith(sourceTextNode);

    const preview = createPreviewCard(linkData.url);
    previewWrap.appendChild(preview.card);
    previewWrap.hidden = false;

    try {
      const metadata = await fetchMetadata(linkData.url);
      if (!metadata) return;

      if (metadata.title) {
        preview.title.textContent = metadata.title;
      }

      if (metadata.description) {
        preview.description.textContent = metadata.description;
      }

      if (metadata.image) {
        const imageUrl = new URL(metadata.image, linkData.url.href).href;
        preview.image.src = imageUrl;
        preview.image.classList.add('is-visible');
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
