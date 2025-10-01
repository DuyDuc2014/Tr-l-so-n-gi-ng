import { LessonData } from '../types';

/**
 * Generates and downloads a PDF file from an HTML element.
 * It uses html2canvas to capture the element as an image and jspdf to create the PDF.
 * Handles multi-page content by slicing the captured image.
 */
export const downloadAsPdf = async (element: HTMLElement, lessonData: LessonData) => {
  if (!element || typeof window.jspdf === 'undefined' || typeof window.html2canvas === 'undefined') {
    console.error("PDF generation libraries not loaded or element not found.");
    alert("Không thể tạo PDF. Thư viện chưa được tải hoặc đã có lỗi xảy ra.");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  
  // Use html2canvas to capture the provided element.
  // A higher scale increases the resolution of the capture.
  const canvas = await window.html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  
  // A4 paper size in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Calculate the image height in the PDF, maintaining the aspect ratio.
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgHeight = canvasHeight * pdfWidth / canvasWidth;

  let heightLeft = imgHeight;
  let position = 0;
  
  // Add the first page.
  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
  heightLeft -= pageHeight;

  // Add new pages if the content is longer than one page.
  while (heightLeft > 0) {
    position = -heightLeft;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Generate a sanitized filename.
  const filename = lessonData.topic.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'giao_an';
  pdf.save(`${filename}.pdf`);
};
