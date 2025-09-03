import { jsPDF } from 'jspdf';

export interface PDFData {
  // Configuration
  media?: string;
  tech?: string;
  orientation?: string;
  // Dimensions
  capacityLitres?: number;
  capacityGallons?: number;
  diameterMm?: number;
  lengthMm?: number;
  // Project Info
  operationType?: 'Pumping' | 'Gravity';
  requireSurgeProtection?: boolean;
  surgeAnalysisDone?: 'Yes' | 'No' | 'Unsure';
  pressureBoosting?: boolean;
  pipelineContinuous?: boolean;
  pipelineFlat?: boolean;
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
  // --- AQ10 payload (optional) ---
  enquiryRef?: string;
  enquiryDateISO?: string;
  inquiryType?: 'Study' | 'Estimation';
  fluidOtherSpec?: string;
  tmh?: number;
  tmhZeroFlow?: number;
  surgeVesselElevationM?: number;
  flowMaxM3h?: number;
  flowMinM3h?: number;
  suctionMinElevM?: number;
  suctionMaxElevM?: number;
  pipelineLengthM?: number;
  pipelineIntDiamMm?: number;
  pipelineMaterial?: string;
  profileDescription?: string;
  profileCumulativeDistance?: string;
  profileElevation?: string;
  profileAirValves?: string;
  endOfPipeDescription?: string;
  siteConditions?: string;
  speedRotationRpm?: number;
  momentInertiaKgM2?: number;
  pumpsInOperation?: number;
  checkedByName?: string;
  checkedByCompany?: string;
  checkedSignedAtISO?: string;
}

export async function renderPDF(
  data: PDFData,
  options?: { download?: boolean; filename?: string }
): Promise<Blob> {
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
  
  // Project Info
  addSection('Project Information');
  if (data.operationType) addField('Operation Type', data.operationType);
  if (typeof data.requireSurgeProtection === 'boolean') addField('Surge Protection', data.requireSurgeProtection ? 'Yes' : 'No');
  if (data.requireSurgeProtection && data.surgeAnalysisDone) addField('Surge Analysis Done', data.surgeAnalysisDone);
  if (typeof data.pressureBoosting === 'boolean') addField('Pressure Boosting', data.pressureBoosting ? 'Yes' : 'No');
  if (typeof data.pipelineContinuous === 'boolean') addField('Continuous Operation', data.pipelineContinuous ? 'Yes' : 'No');
  if (typeof data.pipelineFlat === 'boolean') addField('Pipeline Relatively Flat', data.pipelineFlat ? 'Yes' : 'No');
  
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
    // (Removed doc.restore / doc.save – jsPDF lacks these; angle handles rotation)
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
  
  // Insert AQ10 section if enquiryRef present
  if (data.enquiryRef) {
    addSection('AQ10 – Surge / Transient Study Intake');
    addField('Enquiry Reference', data.enquiryRef);
    addField('Enquiry Date', data.enquiryDateISO ? new Date(data.enquiryDateISO).toLocaleDateString() : undefined);
    addField('Inquiry Type', data.inquiryType);
    addField('Nature of Fluid', data.media);
    addField('Other Fluid Spec', data.fluidOtherSpec);
    addField('TMH', data.tmh !== undefined ? `${data.tmh} Wc` : undefined);
    addField('TMH @ Zero Flow', data.tmhZeroFlow !== undefined ? `${data.tmhZeroFlow} m.Wc` : undefined);
    addField('Surge Vessel Elevation', data.surgeVesselElevationM !== undefined ? `${data.surgeVesselElevationM} m` : undefined);
    addField('Max Flow', data.flowMaxM3h !== undefined ? `${data.flowMaxM3h} m³/h` : undefined);
    addField('Min Flow', data.flowMinM3h !== undefined ? `${data.flowMinM3h} m³/h` : undefined);
    addField('Suction Elev (Min)', data.suctionMinElevM !== undefined ? `${data.suctionMinElevM} m` : undefined);
    addField('Suction Elev (Max)', data.suctionMaxElevM !== undefined ? `${data.suctionMaxElevM} m` : undefined);
    addField('Pipeline Length', data.pipelineLengthM !== undefined ? `${data.pipelineLengthM} m` : undefined);
    addField('Pipeline Int Diam', data.pipelineIntDiamMm !== undefined ? `${data.pipelineIntDiamMm} mm` : undefined);
    addField('Pipeline Material', data.pipelineMaterial);
    addField('Speed of Rotation', data.speedRotationRpm !== undefined ? `${data.speedRotationRpm} tr/min` : undefined);
    addField('Moment of Inertia', data.momentInertiaKgM2 !== undefined ? `${data.momentInertiaKgM2} kg·m²` : undefined);
    addField('Pumps in Operation', data.pumpsInOperation !== undefined ? String(data.pumpsInOperation) : undefined);
    addField('End of Pipe Description', data.endOfPipeDescription);
    addField('Site Conditions', data.siteConditions);
    addField('Profile (Cumulative Distance)', data.profileCumulativeDistance);
    addField('Profile (Elevation)', data.profileElevation);
    addField('Profile (Air Valves / Drain)', data.profileAirValves);
    addField('Checked By', data.checkedByName);
    addField('Checked Company', data.checkedByCompany);
    addField('Checked / Signed At', data.checkedSignedAtISO ? new Date(data.checkedSignedAtISO).toLocaleString() : undefined);
  }
  
  // Output / Save
  const filename =
    options?.filename ||
    `Charlatte_Surge_Vessel_${data.company?.replace(/\s+/g, '_') || 'Quote'}_${new Date()
      .toISOString()
      .split('T')[0]}.pdf`;
  const blob = doc.output('blob');
  if (options?.download !== false) {
    doc.save(filename);
  }
  return blob;
}

export async function generatePDF(data: PDFData): Promise<void> {
  await renderPDF(data, { download: true });
}

// Helper to export a BLANK AQ10 template quickly
export async function generateBlankAQ10PDF(): Promise<void> {
  await generatePDF({
    generatedAt: new Date().toISOString(),
    enquiryRef: 'BLANK-TEMPLATE',
    enquiryDateISO: new Date().toISOString(),
    inquiryType: undefined,
    media: 'Clear / Waste / Other',
    notes: 'Blank AQ10 template'
  });
}
