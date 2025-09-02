import { useState } from 'react';
import { generatePDF } from '../lib/pdfGenerator';

export default function AQ10() {
  const [projectName, setProjectName] = useState('');
  const [pipelineLengthKm, setPipelineLengthKm] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const saveLocal = () => {
    const data = { projectName, pipelineLengthKm, notes, savedAt: new Date().toISOString() };
    localStorage.setItem('aq10Data', JSON.stringify(data));
    alert('Saved. Return to the previous tab to import your answers.');
  };

  const download = async () => {
    await generatePDF({
      name: 'AQ10 Intake',
      company: projectName,
      notes,
      generatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">AQ10 – Surge Study Intake (Draft)</h1>
      <p className="text-sm text-slate-600">This draft captures basic inputs. Save will store locally in your browser so you can import in the other tab.</p>
      <label className="block text-sm">
        Project / Company Name
        <input className="mt-1 w-full px-3 py-2 border rounded-lg" value={projectName} onChange={e => setProjectName(e.target.value)} />
      </label>
      <label className="block text-sm">
        Pipeline Length (km)
        <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={pipelineLengthKm} onChange={e => setPipelineLengthKm(e.target.value === '' ? '' : Number(e.target.value))} />
      </label>
      <label className="block text-sm">
        Notes / Site Conditions
        <textarea className="mt-1 w-full px-3 py-2 border rounded-lg" rows={5} value={notes} onChange={e => setNotes(e.target.value)} />
      </label>
      <div className="flex gap-3">
        <button onClick={saveLocal} className="px-4 py-2 rounded-lg border">Save</button>
        <button onClick={download} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Download PDF</button>
      </div>
    </div>
  );
}

