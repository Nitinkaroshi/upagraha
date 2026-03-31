import { jsPDF } from 'jspdf';
import { orbitalPeriod, orbitalVelocity, type LifetimeResult } from './orbital';

export function generateCompliancePDF(
  altitude: number,
  mass: number,
  area: number,
  dragCd: number,
  solar: string,
  result: LifetimeResult
) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date().toISOString().split('T')[0];
  let y = 15;

  // Header bar
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('UPAGRAHA', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text('Orbital Lifetime Compliance Report', 15, 26);
  doc.text(`Generated: ${now}`, pageWidth - 15, 18, { align: 'right' });
  doc.text('upagraha-ten.vercel.app', pageWidth - 15, 26, { align: 'right' });

  y = 45;

  // Section: Input Parameters
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('INPUT PARAMETERS', 15, y);
  y += 2;
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, pageWidth - 15, y);
  y += 8;

  const params = [
    ['Orbital Altitude', `${altitude} km`],
    ['Satellite Mass', `${mass} kg`],
    ['Cross-Section Area', `${area} m²`],
    ['Area-to-Mass Ratio', `${(area / mass).toFixed(6)} m²/kg`],
    ['Drag Coefficient', `${dragCd}`],
    ['Solar Activity', solar],
    ['Orbital Period', `${(orbitalPeriod(altitude) / 60).toFixed(1)} min`],
    ['Orbital Velocity', `${orbitalVelocity(altitude).toFixed(2)} km/s`],
  ];

  doc.setFontSize(9);
  params.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(value, 90, y);
    y += 6;
  });

  y += 8;

  // Section: Results
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('RESULTS', 15, y);
  y += 2;
  doc.line(15, y, pageWidth - 15, y);
  y += 10;

  // Lifetime big number
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const lifetimeText = result.lifetimeYears < 1
    ? `${result.lifetimeDays} days`
    : result.lifetimeYears > 100
      ? '100+ years'
      : `${result.lifetimeYears.toFixed(1)} years`;
  doc.text(lifetimeText, 20, y);
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Estimated Orbital Lifetime  |  Risk Level: ${result.riskLevel.toUpperCase()}`, 20, y);
  y += 12;

  // Compliance boxes
  const drawComplianceBox = (label: string, ref: string, compliant: boolean, yPos: number) => {
    doc.setFillColor(compliant ? 240 : 255, compliant ? 255 : 240, compliant ? 240 : 240);
    doc.roundedRect(15, yPos, pageWidth - 30, 18, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(compliant ? 34 : 200, compliant ? 139 : 50, compliant ? 34 : 50);
    doc.text(compliant ? 'COMPLIANT' : 'NON-COMPLIANT', 20, yPos + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(label, 20, yPos + 13);
    doc.text(ref, pageWidth - 20, yPos + 13, { align: 'right' });

    return yPos + 22;
  };

  y = drawComplianceBox(
    'FCC 5-Year Deorbit Rule (47 CFR § 25.114)',
    result.meetsComplianceFCC ? 'Deorbits within 5 years' : `${result.lifetimeYears.toFixed(1)}y exceeds limit`,
    result.meetsComplianceFCC, y
  );

  y = drawComplianceBox(
    'ESA 25-Year Guideline (IADC / UN COPUOS)',
    result.meetsComplianceESA ? 'Deorbits within 25 years' : `${result.lifetimeYears.toFixed(1)}y exceeds guideline`,
    result.meetsComplianceESA, y
  );

  y += 8;

  // Decay profile (simplified chart)
  if (result.decayProfile.length > 1) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text('ALTITUDE DECAY PROFILE', 15, y);
    y += 2;
    doc.line(15, y, pageWidth - 15, y);
    y += 5;

    const chartX = 25;
    const chartY = y;
    const chartW = pageWidth - 50;
    const chartH = 50;
    const maxAlt = result.decayProfile[0].altitude;
    const maxYear = result.decayProfile[result.decayProfile.length - 1].year;

    // Axes
    doc.setDrawColor(200, 200, 200);
    doc.line(chartX, chartY, chartX, chartY + chartH);
    doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

    // Y-axis label
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${maxAlt.toFixed(0)}km`, chartX - 2, chartY + 3, { align: 'right' });
    doc.text('0', chartX - 2, chartY + chartH, { align: 'right' });

    // X-axis label
    doc.text('0', chartX, chartY + chartH + 4);
    doc.text(`${maxYear.toFixed(0)}y`, chartX + chartW, chartY + chartH + 4, { align: 'right' });

    // Plot line
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.5);
    for (let i = 1; i < result.decayProfile.length; i++) {
      const prev = result.decayProfile[i - 1];
      const curr = result.decayProfile[i];
      const x1 = chartX + (prev.year / maxYear) * chartW;
      const y1 = chartY + chartH - (prev.altitude / maxAlt) * chartH;
      const x2 = chartX + (curr.year / maxYear) * chartW;
      const y2 = chartY + chartH - (Math.max(0, curr.altitude) / maxAlt) * chartH;
      doc.line(x1, y1, x2, y2);
    }

    y = chartY + chartH + 12;
  }

  // Disclaimer
  if (y > 240) { doc.addPage(); y = 20; }

  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, y, pageWidth - 30, 30, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('DISCLAIMER', 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 130);
  const disclaimer = 'This report uses simplified atmospheric and drag models for estimation purposes. Results are approximate and should not be used for operational mission planning or regulatory filings. For precise analysis, use NASA DAS (Debris Assessment Software) or ESA DRAMA. Solar activity significantly affects results.';
  const lines = doc.splitTextToSize(disclaimer, pageWidth - 40);
  doc.text(lines, 20, y + 12);

  y += 38;

  // Footer
  doc.setDrawColor(200, 200, 200);
  doc.line(15, y, pageWidth - 15, y);
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Upagraha — Safeguarding Space, Securing the Future', 15, y);
  doc.text('upagraha-ten.vercel.app', pageWidth - 15, y, { align: 'right' });

  // Save
  doc.save(`upagraha-compliance-report-${altitude}km-${now}.pdf`);
}
