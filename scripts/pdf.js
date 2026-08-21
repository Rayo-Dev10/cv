/** Opens the native print dialog so exported PDFs retain selectable text. */
export function setupPdfExport() {
  document.getElementById('exportPdfBtn').addEventListener('click', () => window.print());
}
