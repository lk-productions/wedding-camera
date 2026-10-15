// Shared helpers for the camera, slideshow and QR card pages. No need to edit.
(function () {
  const params = new URLSearchParams(location.search);
  const eventId = (params.get('e') || '').trim().toLowerCase();
  const apiUrl = (window.SITE && SITE.apiUrl) || '';
  // ?e=demo always shows sample photos — handy for showing the camera to a new client.
  const demo = !apiUrl || eventId === 'demo';

  const demoMode = params.get('mode') === 'event' ? 'event' : 'wedding';
  const DEMO_EVENT = {
    id: 'demo', mode: demoMode,
    title: demoMode === 'event' ? 'Homecoming 2026' : 'Alex & Jordan',
    headline: demoMode === 'event' ? 'Lewis University' : '',
    date: demoMode === 'event' ? 'October 2026' : 'June 14, 2027',
    shots: demoMode === 'event' ? 10 : 4,
    theme: params.get('theme') || (demoMode === 'event' ? 'crimson' : 'ivory'),
    allowRetake: true, showGuestPhotos: true, approveFirst: false, open: true,
  };

  // Wording for each mode. {shots} and {title} are filled in per event.
  const COPY = {
    wedding: {
      headline: 'The wedding of',
      intro: "You've got {shots} shots on this camera. Like a real disposable, you can't delete them, so make them count.",
      nameLabel: 'Your name (so we know who took what)',
      doneIcon: '♥',
      doneTitle: "That's a wrap!",
      doneText: "Your camera's out of film. Thank you for capturing our day.",
      closed: 'Thanks for celebrating with {title}!',
      cardEyebrow: 'Be our photographer',
      cardTitle: 'Grab a disposable camera',
      cardSub: 'Take {shots} photos for our album. No app needed.',
      joinTitle: 'Add your photos',
      joinSub: 'Scan for your disposable camera',
      emptyText: "Scan to grab your disposable camera. Photos will appear here as they're taken.",
    },
    event: {
      headline: '',
      intro: "You've got {shots} shots to capture the moment. Every photo goes straight to the event album.",
      nameLabel: 'Your name (optional, for photo credit)',
      doneIcon: '✦',
      doneTitle: "You're all out of shots",
      doneText: 'Thanks for sharing your view of the event!',
      closed: 'Thanks for being part of {title}!',
      cardEyebrow: 'Share your view',
      cardTitle: 'Snap photos for the event album',
      cardSub: 'Scan to take {shots} photos. No app needed.',
      joinTitle: 'Share your photos',
      joinSub: 'Scan to add yours to the slideshow',
      emptyText: "Scan to share your photos. They'll appear here as they're taken.",
    },
  };

  function copyFor(ev) {
    const base = COPY[ev.mode] || COPY.wedding;
    const out = {};
    Object.keys(base).forEach((k) => {
      out[k] = base[k].replace(/\{shots\}/g, ev.shots).replace(/\{title\}/g, ev.title);
    });
    if (ev.headline) out.headline = ev.headline;
    return out;
  }

  // Fills [data-copy="key"] with wording and [data-title] with the event title.
  function applyCopy(ev) {
    const c = copyFor(ev);
    document.querySelectorAll('[data-copy]').forEach((el) => {
      el.textContent = c[el.dataset.copy] || '';
      if (el.dataset.copy === 'headline') el.hidden = !c.headline;
    });
    document.querySelectorAll('[data-title]').forEach((el) => { el.textContent = ev.title; });
    document.querySelectorAll('[data-date]').forEach((el) => { el.textContent = ev.date; });
    return c;
  }

  // White or near-black text, whichever reads better on the given colour.
  function textOn(hex) {
    const n = parseInt(hex.slice(1), 16);
    const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
    return lum > 0.62 ? '#1a1612' : '#ffffff';
  }

  function applyTheme(name, accent) {
    const t = THEMES[name] || THEMES.ivory;
    const custom = /^#[0-9a-f]{6}$/i.test(accent || '') ? accent : null;
    const root = document.documentElement.style;
    root.setProperty('--bg', t.background);
    root.setProperty('--card', t.card);
    root.setProperty('--ink', t.text);
    root.setProperty('--muted', t.muted);
    root.setProperty('--accent', custom || t.accent);
    root.setProperty('--accent-ink', custom ? textOn(custom) : (t.accentText || '#fff'));
    root.setProperty('--line', t.line);
    document.querySelector('meta[name=theme-color]')?.setAttribute('content', t.background);
  }

  // Resolves to { event, photos }. Rejects with err.code = 'missing' | 'not-found' | 'network'.
  async function loadEvent() {
    if (!eventId && !demo) throw codeError('missing');
    if (demo) return { event: DEMO_EVENT, photos: await demoPhotos() };
    let data;
    try {
      const res = await fetch(apiUrl + '?action=event&e=' + encodeURIComponent(eventId), { cache: 'no-store' });
      data = await res.json();
    } catch (e) {
      throw codeError('network');
    }
    if (!data.ok) throw codeError(data.error === 'not-found' ? 'not-found' : 'network');
    return { event: data.event, photos: data.photos || [] };
  }

  function codeError(code) {
    const e = new Error(code);
    e.code = code;
    return e;
  }

  // ---- Dashboard (needs the event's admin key) ----
  async function adminPhotos(key) {
    if (demo) {
      const photos = await demoPhotos();
      return { event: DEMO_EVENT, photos: photos.map((p) => ({ ...p, s: demoStatus[p.id] || 'new' })) };
    }
    const res = await fetch(apiUrl + '?action=admin&e=' + encodeURIComponent(eventId) + '&key=' + encodeURIComponent(key), { cache: 'no-store' });
    const data = await res.json();
    if (!data.ok) throw codeError(data.error === 'bad-key' || data.error === 'not-found' ? 'bad-key' : 'network');
    return data;
  }

  async function moderate(key, ids, status) {
    if (demo) { ids.forEach((id) => { demoStatus[id] = status; }); return; }
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'moderate', event: eventId, key, ids, status }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Update failed');
  }
  const demoStatus = {};

  async function listPhotos() {
    if (demo) return demoPhotos();
    const res = await fetch(apiUrl + '?action=list&e=' + encodeURIComponent(eventId), { cache: 'no-store' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'List failed');
    return data.photos;
  }

  async function uploadPhoto(image, name, shot) {
    if (demo) {
      await new Promise((r) => setTimeout(r, 900));
      demoUploads.unshift({ id: 'demo' + Date.now(), name, t: Date.now(), src: image });
      return;
    }
    // text/plain keeps this a "simple" request, so Apps Script doesn't need CORS preflight.
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ event: eventId, image, name, shot }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Upload failed');
  }

  function photoUrl(photo, width) {
    if (photo.src) return photo.src;
    return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(photo.id) + '&sz=w' + width;
  }
  function photoFallbackUrl(photo, width) {
    return 'https://lh3.googleusercontent.com/d/' + encodeURIComponent(photo.id) + '=w' + width;
  }

  // A branding image (logo or background) uploaded from the Mac app.
  function assetUrl(id, width) {
    return id ? 'https://lh3.googleusercontent.com/d/' + encodeURIComponent(id) + '=w' + width : '';
  }

  // Theme + logo + background in one go. Pages mark logo spots with <img data-logo hidden>.
  function applyBranding(ev, opts) {
    applyTheme(ev.theme, ev.accent);
    document.querySelectorAll('img[data-logo]').forEach((img) => {
      if (!ev.logo) { img.hidden = true; return; }
      img.onload = () => { img.hidden = false; };
      img.onerror = () => {
        if (!img.dataset.fb) { img.dataset.fb = 1; img.src = 'https://drive.google.com/thumbnail?id=' + ev.logo + '&sz=w800'; }
      };
      img.src = assetUrl(ev.logo, 800);
    });
    const bg = opts && opts.background === 'slide' ? ev.slideBg : (opts && opts.background === 'phone' ? ev.phoneBg : '');
    if (bg) {
      document.documentElement.style.setProperty('--bg-image', 'url("' + assetUrl(bg, opts.background === 'slide' ? 1920 : 1200) + '")');
      document.body.classList.add('has-bg');
    }
  }

  // Link to another page of this site for the same event, e.g. pageUrl('slideshow.html').
  function pageUrl(page) {
    const u = new URL(page || './', location.href);
    if (eventId) u.searchParams.set('e', eventId);
    return u.href;
  }

  // ---- Demo mode: fake photos so the pages can be previewed ----
  const demoUploads = [];
  let demoCache = null;
  function demoPhotos() {
    if (!demoCache) {
      const names = ['Aunt May', 'Chris', '', 'Priya', 'Sam & Leo', 'Grandpa Joe'];
      const hues = [24, 200, 340, 140, 45, 280];
      demoCache = names.map((name, i) => {
        const c = document.createElement('canvas');
        c.width = i % 2 ? 900 : 1200; c.height = i % 2 ? 1200 : 900;
        const x = c.getContext('2d');
        const g = x.createLinearGradient(0, 0, c.width, c.height);
        g.addColorStop(0, `hsl(${hues[i]} 45% 70%)`);
        g.addColorStop(1, `hsl(${hues[i] + 40} 40% 40%)`);
        x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
        x.fillStyle = 'rgba(255,255,255,.85)';
        x.font = '600 90px Georgia'; x.textAlign = 'center';
        x.fillText('Demo photo ' + (i + 1), c.width / 2, c.height / 2);
        return { id: 'demo' + i, name, t: Date.now() - i * 60000, src: c.toDataURL('image/jpeg', 0.8) };
      });
    }
    return Promise.resolve(demoUploads.concat(demoCache));
  }

  window.Camera = {
    eventId: demo && !eventId ? 'demo' : eventId, demo,
    loadEvent, applyTheme, applyBranding, assetUrl, applyCopy, copyFor, listPhotos, uploadPhoto, photoUrl, photoFallbackUrl, pageUrl,
    adminPhotos, moderate,
  };
})();
