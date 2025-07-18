import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ColorPalette } from '@/types/template';

export interface PDFGenerationOptions {
  colorPalette: ColorPalette;
  templateName: string;
  previewElement: HTMLElement;
  isDarkMode: boolean;
  isPro?: boolean;
  projectName?: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

const getWCAGCompliance = (ratio: number): { level: string; icon: string } => {
  if (ratio >= 7) return { level: 'AAA', icon: '✓' };
  if (ratio >= 4.5) return { level: 'AA', icon: '✓' };
  return { level: 'Fail', icon: '⚠' };
};

const captureTemplateScreenshot = async (element: HTMLElement): Promise<string> => {
  // Wait for fonts and images to load
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Ensure all images are loaded
  const images = element.querySelectorAll('img');
  await Promise.all(Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  }));

  // Wait for fonts to load
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Remove any existing transform scaling
  const originalTransform = element.style.transform;
  const originalZoom = element.style.zoom;
  element.style.transform = 'none';
  element.style.zoom = '1';

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
    });

    return canvas.toDataURL('image/png', 1.0);
  } finally {
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.zoom = originalZoom;
  }
};

// Basic PDF generator for free users
export const generateBasicColorPalettePDF = async ({
  colorPalette,
  templateName,
  previewElement,
  isDarkMode
}: Omit<PDFGenerationOptions, 'isPro' | 'projectName'>): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;

  // Title
  pdf.setFontSize(20);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Basic PDF Report', margin, margin + 15);

  // Subtitle
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Template: ${templateName} • Mode: ${isDarkMode ? 'Dark' : 'Light'}`, margin, margin + 25);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, margin + 32);

  let yPos = margin + 50;

  // Color palette section
  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Color Palette', margin, yPos);
  yPos += 15;

  // Color swatches
  const colors = [
    { name: 'Brand', value: colorPalette.brand },
    { name: 'Highlight', value: colorPalette.highlight },
    { name: 'Accent', value: colorPalette.accent },
    { name: 'Background', value: colorPalette["section-bg-1"] },
    { name: 'Primary Text', value: colorPalette["text-primary"] },
    { name: 'Secondary Text', value: colorPalette["text-secondary"] },
  ];

  colors.forEach((color) => {
    const rgb = hexToRgb(color.value);
    
    // Color swatch
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.rect(margin, yPos - 5, 15, 8, 'F');
    
    // Color details
    pdf.setFontSize(10);
    pdf.setTextColor(40, 40, 40);
    pdf.text(color.name, margin + 20, yPos);
    pdf.text(color.value.toUpperCase(), margin + 80, yPos);
    pdf.text(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`, margin + 120, yPos);
    
    yPos += 12;
  });

  // Template preview
  yPos += 20;
  pdf.setFontSize(16);
  pdf.setTextColor(40, 40, 40);
  pdf.text('Template Preview', margin, yPos);
  yPos += 15;

  try {
    const screenshotDataUrl = await captureTemplateScreenshot(previewElement);
    const maxWidth = pageWidth - (margin * 2);
    const availableHeight = pageHeight - yPos - margin - 20;
    
    pdf.addImage(screenshotDataUrl, 'PNG', margin, yPos, maxWidth, Math.min(availableHeight, 100));
    
  } catch (error) {
    console.error('Failed to capture template screenshot:', error);
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Screenshot capture failed', margin, yPos);
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Generated with Palette Generator - Upgrade to Pro for professional reports', margin, pageHeight - 10);

  // Save the PDF
  const fileName = `basic-color-palette-${templateName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  pdf.save(fileName);
};

export const generateColorPalettePDF = async ({
  colorPalette,
  templateName,
  previewElement,
  isDarkMode,
  isPro = false,
  projectName = 'Color Palette Project'
}: PDFGenerationOptions): Promise<void> => {
  // A4 Landscape format for professional layout
  const pdf = new jsPDF('l', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 24;
  
  let currentPage = 1;
  const totalPages = 4;

  // Helper function to add footer
  const addFooter = (pageNum: number) => {
    if (pageNum === 1) return; // No footer on cover page
    
    // Footer divider line
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text('Palette Generator Pro', margin, pageHeight - 8);
    pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin - 20, pageHeight - 8);
  };

  // PAGE 1: COVER PAGE
  pdf.setFillColor(248, 250, 252); // Light background
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Main title
  pdf.setFontSize(32);
  pdf.setTextColor(30, 41, 59);
  const titleWidth = pdf.getTextWidth('Color Palette Export');
  pdf.text('Color Palette Export', (pageWidth - titleWidth) / 2, pageHeight / 2 - 20);

  // Subtitle
  pdf.setFontSize(18);
  pdf.setTextColor(100, 116, 139);
  const subtitleText = `Generated for ${projectName}`;
  const subtitleWidth = pdf.getTextWidth(subtitleText);
  pdf.text(subtitleText, (pageWidth - subtitleWidth) / 2, pageHeight / 2);

  // Date
  pdf.setFontSize(12);
  pdf.setTextColor(148, 163, 184);
  const dateText = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const dateWidth = pdf.getTextWidth(dateText);
  pdf.text(dateText, (pageWidth - dateWidth) / 2, pageHeight / 2 + 20);

  // PAGE 2: COLOR PALETTE
  pdf.addPage();
  currentPage++;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  let yPos = margin + 15;

  // Page title
  pdf.setFontSize(28);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Color Palette', margin, yPos);
  yPos += 20;

  // Mood description
  pdf.setFontSize(14);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Template: ${templateName} • Mode: ${isDarkMode ? 'Dark' : 'Light'}`, margin, yPos);
  yPos += 25;

  // Color swatches grid (3 per row)
  const colors = [
    { name: 'Primary Brand', value: colorPalette.brand, usage: 'Primary branding, CTA buttons' },
    { name: 'Highlight', value: colorPalette.highlight, usage: 'Attention, highlights' },
    { name: 'Accent', value: colorPalette.accent, usage: 'Secondary actions' },
    { name: 'Background', value: colorPalette["section-bg-1"], usage: 'Page background' },
    { name: 'Primary Text', value: colorPalette["text-primary"], usage: 'Main content text' },
    { name: 'Secondary Text', value: colorPalette["text-secondary"], usage: 'Supporting text' },
  ];

  const cardWidth = (pageWidth - margin * 2 - 20) / 3; // 3 cards per row
  const cardHeight = 60;
  let xPos = margin;
  let rowIndex = 0;

  colors.forEach((color, index) => {
    if (index > 0 && index % 3 === 0) {
      rowIndex++;
      xPos = margin;
      yPos += cardHeight + 15;
    }

    const rgb = hexToRgb(color.value);

    // Card background
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(xPos, yPos, cardWidth, cardHeight, 3, 3, 'FD');

    // Color swatch
    pdf.setFillColor(rgb.r, rgb.g, rgb.b);
    pdf.roundedRect(xPos + 8, yPos + 8, 40, 30, 2, 2, 'F');

    // Color info
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text(color.name, xPos + 55, yPos + 15);

    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text(color.value.toUpperCase(), xPos + 55, yPos + 25);
    pdf.text(`RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`, xPos + 55, yPos + 32);

    // Usage label
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    const usageLines = pdf.splitTextToSize(color.usage, cardWidth - 60);
    pdf.text(usageLines, xPos + 55, yPos + 40);

    xPos += cardWidth + 10;
  });

  addFooter(currentPage);

  // PAGE 3: TEMPLATE PREVIEW
  pdf.addPage();
  currentPage++;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 15;

  // Page title
  pdf.setFontSize(28);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Template Preview', margin, yPos);
  yPos += 35;

  try {
    // Capture screenshot
    const screenshotDataUrl = await captureTemplateScreenshot(previewElement);
    
    // Calculate image dimensions
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - yPos - 40;

    // Preview card with shadow effect
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin - 5, yPos - 5, maxWidth + 10, maxHeight + 10, 5, 5, 'F');
    
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, yPos, maxWidth, maxHeight, 3, 3, 'F');
    
    // Add screenshot
    pdf.addImage(screenshotDataUrl, 'PNG', margin + 5, yPos + 5, maxWidth - 10, maxHeight - 10);
    
    // Preview label
    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`${templateName} Template Preview`, margin, yPos - 10);
    
  } catch (error) {
    console.error('Failed to capture template screenshot:', error);
    pdf.setFontSize(14);
    pdf.setTextColor(220, 38, 127);
    pdf.text('Screenshot capture failed - Preview not available', margin, yPos + 50);
  }

  addFooter(currentPage);

  // PAGE 4: ACCESSIBILITY & CONTRAST
  pdf.addPage();
  currentPage++;

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  yPos = margin + 15;

  // Page title
  pdf.setFontSize(28);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Accessibility & Contrast Check', margin, yPos);
  yPos += 35;

  // Contrast combinations table
  const contrastPairs = [
    { text: colorPalette["text-primary"], bg: colorPalette["section-bg-1"], label: 'Primary Text on Background' },
    { text: colorPalette["text-secondary"], bg: colorPalette["section-bg-1"], label: 'Secondary Text on Background' },
    { text: '#ffffff', bg: colorPalette.brand, label: 'White Text on Brand Color' },
    { text: '#ffffff', bg: colorPalette.highlight, label: 'White Text on Highlight' },
    { text: colorPalette["text-primary"], bg: colorPalette.accent, label: 'Primary Text on Accent' },
  ];

  // Table header
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, yPos, pageWidth - margin * 2, 15, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(30, 41, 59);
  pdf.text('Color Combination', margin + 5, yPos + 10);
  pdf.text('Contrast Ratio', margin + 120, yPos + 10);
  pdf.text('WCAG Result', margin + 180, yPos + 10);
  pdf.text('Status', margin + 230, yPos + 10);

  yPos += 20;

  contrastPairs.forEach((pair, index) => {
    const ratio = calculateContrastRatio(pair.text, pair.bg);
    const compliance = getWCAGCompliance(ratio);
    
    // Alternating row background
    if (index % 2 === 0) {
      pdf.setFillColor(252, 252, 252);
      pdf.rect(margin, yPos - 5, pageWidth - margin * 2, 15, 'F');
    }

    // Color combination preview
    const textRgb = hexToRgb(pair.text);
    const bgRgb = hexToRgb(pair.bg);
    
    pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
    pdf.rect(margin + 5, yPos - 3, 8, 8, 'F');
    
    pdf.setFillColor(textRgb.r, textRgb.g, textRgb.b);
    pdf.rect(margin + 15, yPos - 3, 8, 8, 'F');

    // Labels and results
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59);
    pdf.text(pair.label, margin + 30, yPos + 3);
    pdf.text(`${ratio.toFixed(1)}:1`, margin + 120, yPos + 3);
    pdf.text(compliance.level, margin + 180, yPos + 3);
    
    // Status icon and color
    if (compliance.level === 'Fail') {
      pdf.setTextColor(220, 38, 127);
    } else {
      pdf.setTextColor(34, 197, 94);
    }
    pdf.text(compliance.icon, margin + 230, yPos + 3);

    yPos += 15;
  });

  // WCAG Guidelines note
  yPos += 20;
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  const guidelineText = 'WCAG Guidelines: AA requires 4.5:1 contrast ratio (3:1 for large text), AAA requires 7:1 (4.5:1 for large text)';
  const guidelineLines = pdf.splitTextToSize(guidelineText, pageWidth - margin * 2);
  pdf.text(guidelineLines, margin, yPos);

  addFooter(currentPage);

  // Save the PDF
  const fileName = `color-palette-${templateName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  pdf.save(fileName);
};