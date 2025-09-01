import { useNavigate } from 'react-router-dom';
import { useStore, type Tech, type Orientation } from '../lib/store';
import { useMemo, useState } from 'react';

export default function Config() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const [dutyARAA, setDutyARAA] = useState(false);

  const allowed: { techs: Tech[]; orientations: Orientation[] } = useMemo(() => {
    const solids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';
    if (solids) return { techs: ['EUV'], orientations: ['Vertical'] };
    return { techs: ['AirWater','Hydrochoc'], orientations: ['Horizontal','Vertical'] };
  }, [state.media]);

  const handleNext = () => {
    setState(s => ({ 
      ...s, 
      tech: dutyARAA ? 'ARAA' : s.tech, 
      orientation: dutyARAA ? 'Vertical' : s.orientation 
    }));
    nav('/sizing');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Configuration</h1>

      <div className="space-y-2">
        <p className="font-medium">Technology</p>
        <div className="flex flex-wrap gap-2">
          {allowed.techs.map(t => (
            <button 
              key={t}
              onClick={() => setState(s => ({ ...s, tech: t, orientation: undefined }))}
              className={`px-3 py-2 rounded-lg border ${state.tech === t ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
              {t === 'AirWater' ? 'Air-Water (Conventional)' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-medium">Orientation</p>
        <div className="flex flex-wrap gap-2">
          {allowed.orientations.map(o => (
            <button 
              key={o}
              onClick={() => setState(s => ({ ...s, orientation: o }))}
              className={`px-3 py-2 rounded-lg border ${state.orientation === o ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
              {o}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={dutyARAA} 
          onChange={e => setDutyARAA(e.target.checked)} 
        />
        <span>Minimum 1–2 pump start/stops per day & relatively flat pipeline (no power implied)?</span>
      </label>
      {dutyARAA && <p className="text-sm text-slate-600">ARAA applies – Vertical only.</p>}

      <div className="flex justify-between">
        <button 
          onClick={() => nav('/application')} 
          className="px-3 py-2 border rounded-lg">
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!(state.tech || dutyARAA) || !(state.orientation || dutyARAA)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}