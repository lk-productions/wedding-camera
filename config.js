// ============================================================
//  Wedding camera settings — edit this file, nothing else.
// ============================================================
window.CONFIG = {
  couple: 'Logan & Nicole',
  date: 'November 07, 2026',

  // Photos each guest gets.
  shots: 4,

  // false = true disposable: the photo sends the moment it's taken, no do-overs.
  allowRetake: true,

  // Show photos other guests have taken on the camera page.
  showGuestPhotos: true,

  // Colors. Use one of the preset names below, or your own:
  //   theme: { background: '#f6f1ea', card: '#fffdf9', text: '#2b2622',
  //            muted: '#7b7068', accent: '#a8784f', accentText: '#ffffff', line: '#e6ddd2' }
  // Presets: 'ivory', 'sage', 'dustyBlue', 'blush', 'terracotta', 'blackTie'
  theme: 'ivory',

  // The Apps Script "Web app URL" (ends in /exec). Leave blank to run in demo mode.
  apiUrl: 'https://script.google.com/macros/s/AKfycbxNrV2oS3MapurZOl2BYaWIqCOoJn4Rxy0gCKTCFILl7ziFSoJWhNh0JUFHSER7e-yS/exec',
};

window.THEMES = {
  ivory:      { background: '#f6f1ea', card: '#fffdf9', text: '#2b2622', muted: '#7b7068', accent: '#a8784f', accentText: '#ffffff', line: '#e6ddd2' },
  sage:       { background: '#eef1ea', card: '#fbfcf9', text: '#26302a', muted: '#66756a', accent: '#62805f', accentText: '#ffffff', line: '#d9e1d4' },
  dustyBlue:  { background: '#edf1f5', card: '#fbfcfe', text: '#1f2a36', muted: '#627286', accent: '#4f6f92', accentText: '#ffffff', line: '#d6dfe8' },
  blush:      { background: '#f8eeee', card: '#fffafa', text: '#3a2a2c', muted: '#87696e', accent: '#b5606c', accentText: '#ffffff', line: '#ecd9db' },
  terracotta: { background: '#f7efe8', card: '#fffaf6', text: '#33241c', muted: '#80695c', accent: '#b45a37', accentText: '#ffffff', line: '#ead9cc' },
  blackTie:   { background: '#121212', card: '#1d1d1d', text: '#f3efe8', muted: '#a39d94', accent: '#c9a96a', accentText: '#1a1612', line: '#333030' },
};
