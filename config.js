// ============================================================
//  Site settings. Event details (names, date, colors, folder)
//  live in the "Disposable Camera Events" Google Sheet instead.
// ============================================================
window.SITE = {
  // The Apps Script "Web app URL" (ends in /exec). Leave blank to run in demo mode.
  apiUrl: 'https://script.google.com/macros/s/AKfycbxzb8y6fnsI6JfFtvjaAbwhxyQetwwbNdOBO1CJ-Rgv1png6qNz4va_HWZWJphS4V_j/exec',
};

// Color themes. Pick one per event in the sheet's "Theme" column.
window.THEMES = {
  ivory:      { background: '#f6f1ea', card: '#fffdf9', text: '#2b2622', muted: '#7b7068', accent: '#a8784f', accentText: '#ffffff', line: '#e6ddd2' },
  sage:       { background: '#eef1ea', card: '#fbfcf9', text: '#26302a', muted: '#66756a', accent: '#62805f', accentText: '#ffffff', line: '#d9e1d4' },
  dustyBlue:  { background: '#edf1f5', card: '#fbfcfe', text: '#1f2a36', muted: '#627286', accent: '#4f6f92', accentText: '#ffffff', line: '#d6dfe8' },
  blush:      { background: '#f8eeee', card: '#fffafa', text: '#3a2a2c', muted: '#87696e', accent: '#b5606c', accentText: '#ffffff', line: '#ecd9db' },
  terracotta: { background: '#f7efe8', card: '#fffaf6', text: '#33241c', muted: '#80695c', accent: '#b45a37', accentText: '#ffffff', line: '#ead9cc' },
  crimson:    { background: '#f7f4f2', card: '#ffffff', text: '#1f1a1a', muted: '#6e6464', accent: '#b3122e', accentText: '#ffffff', line: '#e6dfdc' },
  navy:       { background: '#f2f4f8', card: '#ffffff', text: '#14203a', muted: '#5f6b80', accent: '#1f3a6e', accentText: '#ffffff', line: '#dbe1ea' },
  blackTie:   { background: '#121212', card: '#1d1d1d', text: '#f3efe8', muted: '#a39d94', accent: '#c9a96a', accentText: '#1a1612', line: '#333030' },
};
