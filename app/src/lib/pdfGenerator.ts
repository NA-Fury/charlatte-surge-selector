import { jsPDF } from 'jspdf';

interface PDFData {
  // Configuration
  media?: string;
  tech?: string;
  orientation?: string;
  
  // Dimensions
  capacityLitres?: number;
  capacityGallons?: number;
  diameterMm?: number;
  lengthMm?: number;
  
  // Contact
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  country?: string;
  notes?: string;
  
  // Manufacturing
  code?: string;
  uStamp?: boolean;
  tpi?: boolean;
  
  // Metadata
  generatedAt?: string;
}

export async function generatePDF(data: PDFData): Promise<void> {
  const doc = new jsPDF();
  let yPos = 20;
  const lineHeight = 7;
  const leftMargin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper functions
  const addLine = (text: string, fontSize = 10, isBold = false) => {
    doc.setFontSize(fontSize);
    if (isBold) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }
    doc.text(text, leftMargin, yPos);
    yPos += lineHeight;
  };
  
  const addSection = (title: string) => {
    yPos += 5;
    doc.setFillColor(59, 130, 246); // Blue
    doc.rect(leftMargin - 5, yPos - 5, pageWidth - 30, 8, 'F');
    doc.setTextColor(255, 255, 255);
    addLine(title, 12, true);
    doc.setTextColor(0, 0, 0);
    yPos += 3;
  };
  
  const addField = (label: string, value: string | undefined) => {
    if (value) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, leftMargin, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, leftMargin + 45, yPos);
      yPos += lineHeight;
    }
  };
  
  // Header with gradient effect (simulated)
  doc.setFillColor(59, 130, 246); // Primary blue
  doc.rect(0, 0, pageWidth, 30, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CHARLATTE RESERVOIRS', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Surge Vessel Configuration Summary', pageWidth / 2, 23, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  
  yPos = 45;
  
  // Contact Information
  if (data.name || data.company) {
    addSection('Contact Information');
    addField('Name', data.name);
    addField('Company', data.company);
    addField('Email', data.email);
    addField('Phone', data.phone);
    addField('Country', data.country);
  }
  
  // Vessel Configuration
  addSection('Vessel Configuration');
  addField('Media/Application', data.media);
  addField('Technology', data.tech);
  addField('Orientation', data.orientation);
  
  // Dimensions
  addSection('Dimensions & Capacity');
  if (data.capacityLitres) {
    addField('Capacity', `${Math.round(data.capacityLitres)} L / ${Math.round(data.capacityGallons || 0)} US gal`);
  }
  if (data.diameterMm) {
    addField('Diameter', `${data.diameterMm} mm`);
  }
  if (data.lengthMm) {
    addField('Length', `${data.lengthMm} mm`);
  }
  
  // Manufacturing Standards
  addSection('Manufacturing Standards');
  addField('Manufacturing Code', data.code);
  if (data.code === 'ASME' && data.uStamp !== undefined) {
    addField('ASME U-Stamp', data.uStamp ? 'Required' : 'Not Required');
  }
  addField('Third-Party Inspector', data.tpi ? 'Required' : 'Not Required');
  
  // Additional Notes
  if (data.notes) {
    addSection('Additional Requirements');
    
    // Word wrap for long text
    const splitText = doc.splitTextToSize(data.notes, pageWidth - 40);
    doc.setFontSize(10);
    splitText.forEach((line: string) => {
      doc.text(line, leftMargin, yPos);
      yPos += lineHeight;
    });
  }
  
  // Requirements Notice
  yPos += 10;
  addSection('Requirements for Final Quote');
  
  const requirements = [
    '• Quantity / Number of Products',
    '• Design Pressure',
    '• Pump Curves',
    '• Pipeline Profiles',
    '• Flow Rate Details',
    '• Installation Location Details',
    '• Environmental Conditions',
    '• Delivery Timeline'
  ];
  
  doc.setFontSize(9);
  requirements.forEach(req => {
    doc.text(req, leftMargin, yPos);
    yPos += 6;
  });
  
  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 30;
  doc.setDrawColor(200, 200, 200);
  doc.line(leftMargin, footerY - 5, pageWidth - leftMargin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date(data.generatedAt || Date.now()).toLocaleString()}`, leftMargin, footerY);
  doc.text('Preliminary selection only - Final design requires surge analysis', leftMargin, footerY + 5);
  doc.text('© CHARLATTE RESERVOIRS - www.charlattereservoirs.fayat.com', leftMargin, footerY + 10);
  
  // Add a second page with technical diagram placeholder
  doc.addPage();
  yPos = 20;
  
  doc.setTextColor(0, 0, 0);
  addSection('Technical Diagram');
  
  // Draw a simple vessel representation
  const centerX = pageWidth / 2;
  const vesselY = 60;
  const vesselWidth = 80;
  const vesselHeight = 40;
  
  // Vessel body (rectangle with rounded ends)
  doc.setFillColor(59, 130, 246, 0.3);
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  
  if (data.orientation === 'Horizontal') {
    // Horizontal vessel
    doc.rect(centerX - vesselWidth/2, vesselY, vesselWidth, vesselHeight, 'FD');
    doc.ellipse(centerX - vesselWidth/2, vesselY + vesselHeight/2, 10, vesselHeight/2, 'FD');
    doc.ellipse(centerX + vesselWidth/2, vesselY + vesselHeight/2, 10, vesselHeight/2, 'FD');
    
    // Dimension lines
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(centerX - vesselWidth/2 - 10, vesselY + vesselHeight + 20, centerX + vesselWidth/2 + 10, vesselY + vesselHeight + 20);
    doc.setFontSize(9);
    doc.text(`L = ${data.lengthMm || '----'} mm`, centerX, vesselY + vesselHeight + 25, { align: 'center' });
    
    doc.line(centerX - vesselWidth/2 - 20, vesselY, centerX - vesselWidth/2 - 20, vesselY + vesselHeight);
    doc.text(`Ø = ${data.diameterMm || '----'} mm`, centerX - vesselWidth/2 - 30, vesselY + vesselHeight/2, { align: 'right' });
  } else {
    // Vertical vessel
    const vVesselWidth = 40;
    const vVesselHeight = 80;
    doc.rect(centerX - vVesselWidth/2, vesselY, vVesselWidth, vVesselHeight, 'FD');
    doc.ellipse(centerX, vesselY, vVesselWidth/2, 10, 'FD');
    doc.ellipse(centerX, vesselY + vVesselHeight, vVesselWidth/2, 10, 'FD');

    // Dimension lines
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(centerX + vVesselWidth/2 + 15, vesselY - 10, centerX + vVesselWidth/2 + 15, vesselY + vVesselHeight + 10);
    doc.setFontSize(9);
    // Removed doc.save()/doc.restore() (jsPDF has no restore) – angle option handles rotation
    doc.text(`L = ${data.lengthMm || '----'} mm`, centerX + vVesselWidth/2 + 20, vesselY + vVesselHeight/2, { angle: 90 });

    doc.line(centerX - vVesselWidth/2, vesselY + vVesselHeight + 20, centerX + vVesselWidth/2, vesselY + vVesselHeight + 20);
    doc.text(`Ø = ${data.diameterMm || '----'} mm`, centerX, vesselY + vVesselHeight + 25, { align: 'center' });
  }
  
  // Next Steps
  yPos = 180;
  addSection('Next Steps');
  
  const steps = [
    '1. Complete and submit AQ120 Surge Analysis Form',
    '2. Provide pump curves and pipeline profile data',
    '3. Schedule technical consultation with our hydraulic department',
    '4. Receive detailed quotation within 24-48 hours',
    '5. Review and approve final design specifications'
  ];
  
  doc.setFontSize(10);
  steps.forEach(step => {
    doc.text(step, leftMargin, yPos);
    yPos += 8;
  });
  
  // Save the PDF
  const filename = `Charlatte_Surge_Vessel_${data.company?.replace(/\s+/g, '_') || 'Quote'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}