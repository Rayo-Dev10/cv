/**
 * Utility functions for DOM creation and certification data parsing.
 */

export function el(tag, className = '', html = '') {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

export function splitCertStrings(str) {
  const res = [];
  let curr = '';
  let open = 0;
  for (const ch of str) {
    if (ch === '(') open++;
    if (ch === ')') open--;
    if (ch === ',' && open === 0) {
      res.push(curr.trim());
      curr = '';
      continue;
    }
    curr += ch;
  }
  if (curr.trim()) res.push(curr.trim());
  return res;
}

export function parseCertItem(str) {
  const m = str.match(/(.+)\s*\(([^,]+),\s*(\d{4}(?:-\d{4})?)\)$/);
  if (!m) return null;
  return {
    courses: m[1].split(',').map(c => c.trim()),
    entity: m[2].trim(),
    year: m[3].trim()
  };
}
