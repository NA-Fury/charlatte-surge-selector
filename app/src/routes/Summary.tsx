import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';

export default function Summary() {
  const { state } = useStore();
  const nav = useNavigate();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Professional Summary</h1>
      <div className="rounded-xl border p-4 bg-slate-50">
        <ul className="grid md:grid-cols-2 gap-y-2 text-sm">
          <li><span className="text-slate-500">Media:</span> {state.media ?? '—'}</li>
          <li><span className="text-slate-500">Technology:</span> {state.tech ?? '—'}</li>
          <li><span className="text-slate-500">Orientation:</span> {state.orientation ?? '—'}</li>
          <li><span className="text-slate-500">Capacity (L):</span> {Math.round(state.capacityLitres ?? 0)}</li>
          <li><span className="text-slate-500">Diameter (mm):</span> {state.diameterMm ?? '—'}</li>
          <li><span className="text-slate-500">Length (mm):</span> {state.lengthMm ?? '—'}</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          Preliminary selection only — a full surge analysis is required for final design and quote.
        </p>
      </div>
      <div className="flex justify-end">
        <button onClick={() => nav('/contact')} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Continue to Contact</button>
      </div>
    </div>
  );
}
