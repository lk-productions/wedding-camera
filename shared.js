// Shared helpers for the camera and slideshow pages. No need to edit.
(function () {
  const C = window.CONFIG;
  const theme = typeof C.theme === 'string' ? (THEMES[C.theme] || THEMES.ivory) : C.theme;

  const root = document.documentElement.style;
  root.setProperty('--bg', theme.background);
  root.setProperty('--card', theme.card);
  root.setProperty('--ink', theme.text);
  root.setProperty('--muted', theme.muted);
  root.setProperty('--accent', theme.accent);
  root.setProperty('--accent-ink', theme.accentText || '#fff');
  root.setProperty('--line', theme.line);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', theme.background);

  const demo = !C.apiUrl;

  async function listPhotos() {
    if (demo) return demoPhotos();
    const res = await fetch(C.apiUrl + '?action=list', { cache: 'no-store' });
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
    const res = await fetch(C.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ image, name, shot }),
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

  // ---- Demo mode (no apiUrl): fake photos so the pages can be previewed ----
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

  window.Camera = { config: C, demo, listPhotos, uploadPhoto, photoUrl, photoFallbackUrl };
})();
