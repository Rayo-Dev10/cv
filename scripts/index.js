import { setupPdfExport } from './pdf.js?v=20260822-1';
import { loadData } from './dataLoader.js?v=20260822-1';

// Entry point that prepares the UI once the DOM is ready.

document.addEventListener('DOMContentLoaded', () => {
  setupPdfExport();
  loadData();
});
