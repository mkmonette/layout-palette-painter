import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ColorPalette } from '@/types/template';

export interface PDFGenerationOptions {
  colorPalette: ColorPalette;
  templateName: string;
  previewElement: HTMLElement;
  isDarkMode: boolean;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const captureTemplateScreenshot = async (element: HTMLElement): Promise<string> => {
  // Wait for initial rendering
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Ensure all images are loaded
  const images = element.querySelectorAll('img');
  await Promise.all(Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  }));

  // Wait for fonts to load and settle
  if (document.fonts) {
    await document.fonts.ready;
    // Additional wait for font rendering to stabilize
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Store original styles
  const originalTransform = element.style.transform;
  const originalZoom = element.style.zoom;
  const originalLineHeight = element.style.lineHeight;
  
  // Normalize styles for consistent rendering
  element.style.transform = 'none';
  element.style.zoom = '1';
  element.style.lineHeight = 'normal';
  
  // Set font smoothing via setProperty for TypeScript compatibility
  const elementStyle = element.style as any;
  const originalWebkitFontSmoothing = elementStyle.webkitFontSmoothing;
  elementStyle.webkitFontSmoothing = 'antialiased';

  // Force a reflow to ensure styles are applied
  element.offsetHeight;
  
  // Additional wait for style changes to take effect
  await new Promise(resolve => setTimeout(resolve, 200));

  try {
    const canvas = await html2canvas(element, {
      scale: 1, // Fixed 1:1 resolution
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });

    return canvas.toDataURL('image/png', 1.0);
  } finally {
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.zoom = originalZoom;
    element.style.lineHeight = originalLineHeight;
    elementStyle.webkitFontSmoothing = originalWebkitFontSmoothing;
  }
};

export const generateColorPalettePDF = async ({
  colorPalette,
  templateName,
  previewElement,
  isDarkMode
}: PDFGenerationOptions): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Color Palette Report', margin, margin + 10);

  // Template info
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Template: ${templateName}`, margin, margin + 25);
  pdf.text(`Mode: ${isDarkMode ? 'Dark' : 'Light'}`, margin, margin + 32);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 39);

  let yPosition = margin + 55;

  // Color palette section
  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Color Palette', margin, yPosition);
  yPosition += 15;

  // Color swatches and details
  const colors = [
    { name: 'Primary', value: colorPalette.primary },
    { name: 'Secondary', value: colorPalette.secondary },
    { name: 'Accent', value: colorPalette.accent },
    { name: 'Background', value: colorPalette.background },
    { name: 'Text', value: colorPalette.text },
    { name: 'Text Light', value: colorPalette.textLight },
  ];

  colors.forEach((color, index) => {
    const rgb = hexToRgb(color.value);
    
    // Color swatch
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.rect(margin, yPosition - 5, 15, 8, 'F');
    
    // Color name and value
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    pdf.text(color.name, margin + 20, yPosition);
    pdf.text(color.value.toUpperCase(), margin + 80, yPosition);
    pdf.text(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`, margin + 120, yPosition);
    
    yPosition += 12;
    
    // Add new page if needed
    if (yPosition > pageHeight - 60 && index < colors.length - 1) {
      pdf.addPage();
      yPosition = margin + 20;
    }
  });

  // Template screenshot section
  yPosition += 10;
  if (yPosition > pageHeight - 100) {
    pdf.addPage();
    yPosition = margin + 20;
  }

  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Template Preview', margin, yPosition);
  yPosition += 15;

  try {
    // Capture screenshot
    const screenshotDataUrl = await captureTemplateScreenshot(previewElement);
    
    // Calculate image dimensions to fit on page
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - yPosition - margin;
    
    // Add screenshot to PDF
    pdf.addImage(screenshotDataUrl, 'PNG', margin, yPosition, maxWidth, maxHeight);
    
  } catch (error) {
    console.error('Failed to capture template screenshot:', error);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Screenshot capture failed', margin, yPosition);
  }

  // Save the PDF
  const fileName = `color-palette-${templateName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  pdf.save(fileName);
};