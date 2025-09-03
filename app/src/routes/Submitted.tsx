import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { generatePDF, renderPDF } from '../lib/pdfGenerator';
import { litresToUsGallons } from '../lib/sizing';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Submitted() {
  const { state } = useStore();
  const nav = useNavigate();
  const q = useQuery();
  const refFromUrl = q.get('ref') || undefined;
  const ref = useMemo(() => refFromUrl || state.enquiryRef || `AQ10-${new Date().toISOString().slice(0,10)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`, [refFromUrl, state.enquiryRef]);

  const resend = async () => {
    try {
      const summaryBlob = await renderPDF({
        ...state,
        capacityGallons: state.capacityLitres ? litresToUsGallons(state.capacityLitres) : 0,
        generatedAt: new Date().toISOString(),
      }, { download: false, filename: 'Charlatte_Summary.pdf' });

      let aq10Blob: Blob | undefined;
      const raw = typeof window !== 'undefined' ? localStorage.getItem('aq10Data') : null;
      if (raw) {
        try {
          const aq = JSON.parse(raw);
          aq10Blob = await renderPDF({
            name: 'AQ10 Intake',
            company: aq.projectName || 'Project',
            notes: `${aq.notes || ''} | Pipeline Length (km): ${aq.pipelineLengthKm ?? '-'}`,
            generatedAt: new Date().toISOString(),
          }, { download: false, filename: 'Charlatte_AQ10.pdf' });
        } catch {}
      }

      const fd = new FormData();
      fd.append('_subject', `Charlatte Selector – Confirmation ${ref}`);
      fd.append('meta', JSON.stringify({ ref, ts: new Date().toISOString() }));
      fd.append('summary', new File([summaryBlob], 'Charlatte_Summary.pdf', { type: 'application/pdf' }));
      if (aq10Blob) fd.append('aq10', new File([aq10Blob], 'Charlatte_AQ10.pdf', { type: 'application/pdf' }));

      const formspreeId = (import.meta.env.VITE_FORMSPREE_ID as string | undefined) ?? 'xvgbvgjr';
      await fetch(`https://formspree.io/f/${formspreeId}`, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      alert('Confirmation email sent.');
    } catch (e) {
      console.error(e);
      alert('Unable to resend confirmation right now.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Submission Received</h1>
      <p className="text-slate-600">Reference: <span className="font-mono">{ref}</span></p>
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => generatePDF({ ...state, capacityGallons: state.capacityLitres ? litresToUsGallons(state.capacityLitres) : 0, generatedAt: new Date().toISOString() } as any)} className="px-4 py-2 rounded-lg border">Download Summary PDF</button>
        <button onClick={resend} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Resend Email</button>
        <button onClick={() => nav('/application')} className="px-4 py-2 rounded-lg border">Back to Start</button>
      </div>
    </div>
  );
}
