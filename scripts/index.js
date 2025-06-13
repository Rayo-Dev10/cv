import { setupPdfExport } from './pdf.js';
import { loadData } from './dataLoader.js';

// Entry point that prepares the UI once the DOM is ready.

document.addEventListener('DOMContentLoaded', () => {
  setupPdfExport();
  loadData();
});
