import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useMemo, useState } from 'react';
import { capsuleVolumeLitres, litresToUsGallons } from '../lib/sizing';

export default function Sizing() {
  const { state, setState } = useStore();
  const nav = useNavigate();

  const [mode, setMode] = useState<'capacity' | 'dimensions'>('dimensions');
  const [diameterMm, setD] = useState(state.diameterMm ?? 1000);
  const [lengthMm, setL] = useState(state.lengthMm ?? 2500);
  const [capacityLitres, setCap] = useState(state.capacityLitres ?? 5000);

  const computedL = useMemo(() => {
    const straight = Math.max(0, lengthMm - diameterMm); // capsule straight section
    return capsuleVolumeLitres(diameterMm, straight); // good demo approximation
  }, [diameterMm, lengthMm]);

  const shownL = mode === 'dimensions' ? computedL : capacityLitres;
  const shownGal = litresToUsGallons(shownL);

  const handleNext = () => {
    setState(s => ({ 
      ...s, 
      diameterMm, 
      lengthMm, 
      capacityLitres: mode === 'dimensions' ? shownL : capacityLitres 
    }));
    nav('/summary');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sizing (Demo)</h1>

      <div className="flex gap-3">
        <button 
          onClick={() => setMode('dimensions')} 
          className={`px-3 py-2 rounded-lg border ${mode === 'dimensions' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
          Dimensions known
        </button>
        <button 
          onClick={() => setMode('capacity')} 
          className={`px-3 py-2 rounded-lg border ${mode === 'capacity' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
          Capacity known
        </button>
      </div>

      {mode === 'dimensions' ? (
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Diameter (mm)</label>
            <input 
              type="number" 
              value={diameterMm} 
              onChange={e => setD(Number(e.target.value))} 
              className="mt-1 w-full border rounded-lg p-2" 
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Overall Length (mm)</label>
            <input 
              type="number" 
              value={lengthMm} 
              onChange={e => setL(Number(e.target.value))} 
              className="mt-1 w-full border rounded-lg p-2" 
            />
          </div>
          <div className="flex items-end">
            <div className="w-full rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Estimated Volume</div>
              <div className="font-semibold">{shownL.toFixed(0)} L | {shownGal.toFixed(0)} US gal</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Capacity (litres)</label>
            <input 
              type="number" 
              value={capacityLitres} 
              onChange={e => setCap(Number(e.target.value))} 
              className="mt-1 w-full border rounded-lg p-2" 
            />
          </div>
          <div className="md:col-span-2 text-sm text-slate-600">
            The app will suggest initial dimensions later (based on tech/orientation heuristics).
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button 
          onClick={() => nav('/config')} 
          className="px-3 py-2 border rounded-lg">
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white">
          Next
        </button>
      </div>
    </div>
  );
}
