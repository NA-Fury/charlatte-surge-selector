import { useStore } from '../lib/store';
import { litresToUsGallons } from '../lib/sizing';
import { useEffect, useState } from 'react';
import { generatePDF, type PDFData } from '../lib/pdfGenerator';

export default function Summary() {
  const { state } = useStore();
  const L = state.capacityLitres ?? 0;
  const gal = litresToUsGallons(L);
  const [hasAQ10, setHasAQ10] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasAQ10(!!localStorage.getItem('aq10Data'));
    }
  }, []);

  const downloadSummary = async () => {
    await generatePDF({
      ...(state as unknown as PDFData),
      capacityGallons: gal,
      generatedAt: new Date().toISOString(),
    });
  };

  const downloadAQ10 = async () => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem('aq10Data');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      await generatePDF({
        name: 'AQ10 Intake',
        company: data.projectName || 'Project',
        notes: `${data.notes || ''} | Pipeline Length (km): ${data.pipelineLengthKm ?? '-'} `,
        generatedAt: new Date().toISOString(),
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Professional Summary</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500 mb-2">Configuration</div>
          <ul className="space-y-1">
            <li><strong>Media:</strong> {state.media ?? '—'}</li>
            <li><strong>Technology:</strong> {state.tech ?? '—'}</li>
            <li><strong>Orientation:</strong> {state.orientation ?? '—'}</li>
          </ul>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500 mb-2">Dimensions</div>
          <ul className="space-y-1">
            <li><strong>Capacity:</strong> {Math.round(L)} L ({Math.round(gal)} US gal)</li>
            <li><strong>Diameter:</strong> {state.diameterMm ? `${state.diameterMm} mm` : '—'}</li>
            <li><strong>Length:</strong> {state.lengthMm ? `${state.lengthMm} mm` : '—'}</li>
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-xl border">
        <div className="text-sm text-slate-600">
          Final quote will require: quantity, design pressure, manufacturing code (ASME/EN/CODAP/AS1210/PD5500),
          U-Stamp (if ASME), TPI requirement, pump curves, pipeline profiles, flow rate.
        </div>
      </div>

      {/* Project Info Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500 mb-2">Project Info</div>
          <ul className="space-y-1">
            <li><strong>Operation:</strong> {state.operationType ?? '-'}</li>
            <li><strong>Surge Protection:</strong> {state.requireSurgeProtection === true ? 'Yes' : state.requireSurgeProtection === false ? 'No' : 'Unsure'}</li>
            {state.requireSurgeProtection && (
              <li><strong>Surge Analysis Done:</strong> {state.surgeAnalysisDone ?? '-'}</li>
            )}
            <li><strong>Pressure Boosting:</strong> {state.pressureBoosting === true ? 'Yes' : state.pressureBoosting === false ? 'No' : '-'}</li>
            {(state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids') && (
              <>
                <li><strong>Continuous Operation:</strong> {state.pipelineContinuous === true ? 'Yes' : state.pipelineContinuous === false ? 'No' : '-'}</li>
                <li><strong>Pipeline Relatively Flat:</strong> {state.pipelineFlat === true ? 'Yes' : state.pipelineFlat === false ? 'No' : '-'}</li>
              </>
            )}
          </ul>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500 mb-2">Actions</div>
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadSummary} className="px-4 py-2 rounded-lg border">Download Summary PDF</button>
            {hasAQ10 && <button onClick={downloadAQ10} className="px-4 py-2 rounded-lg border">Download AQ10 PDF</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
