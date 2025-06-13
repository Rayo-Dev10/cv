import { setupPdfExport } from './pdf.js';
import { loadData } from './dataLoader.js';

document.addEventListener('DOMContentLoaded', () => {
  setupPdfExport();
  loadData();
});
