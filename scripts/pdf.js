// Handles the PDF export modal and file generation.
export function setupPdfExport() {
  const openBtn = document.getElementById('exportPdfBtn');
  const overlay = document.getElementById('pdfOverlay');
  const { jsPDF } = window.jspdf;

  openBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
  });

  document.querySelectorAll('.pdf-option').forEach(el => {
    el.addEventListener('click', () => {
      overlay.classList.add('hidden');
      exportPdf(el.dataset.size);
    });
  });

    function exportPdf(option) {
      const container = document.querySelector('.max-w-6xl');
      html2canvas(container, { scale: 2, useCORS: true }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
      let pdfWidth, pdfHeight;
      if (option === 'letter') {
        pdfWidth = 612;
        pdfHeight = 792;
      } else {
        pdfWidth = canvas.width * 0.75;
        pdfHeight = canvas.height * 0.75;
      }
      const doc = new jsPDF({ orientation: pdfWidth > pdfHeight ? 'landscape' : 'portrait', unit: 'pt', format: [pdfWidth, pdfHeight] });
      let imgWidth = pdfWidth;
      let imgHeight = canvas.height * pdfWidth / canvas.width;
      if (imgHeight > pdfHeight) {
        imgHeight = pdfHeight;
        imgWidth = canvas.width * pdfHeight / canvas.height;
      }
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('cv.pdf');
      });
  }
}
