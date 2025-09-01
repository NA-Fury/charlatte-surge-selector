import { useStore } from '../lib/store';
import { litresToUsGallons } from '../lib/sizing';

export default function Summary() {
  const { state } = useStore();
  const L = state.capacityLitres ?? 0;
  const gal = litresToUsGallons(L);

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
    </div>
  );
}
