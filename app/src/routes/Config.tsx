import { useNavigate } from 'react-router-dom';
import { useStore, type Tech, type Orientation } from '../lib/store';
import { useMemo, useState, useEffect } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

// Product meta + features
// Updated PRODUCTS: removed AirWater entry
const PRODUCTS: Record<Tech, {
  name: string;
  tagline: string;
  features: string[];
  color: string;
}> = {
  Hydrochoc: {
    name: 'HYDROCHOC',
    tagline: 'Bladder tank line for drinking water applications',
    features: [
      'Surge protection',
      'Water in bladder design',
      'Horizontal up to 120,000 L',
      'Vertical up to 60,000 L'
    ],
    color: 'from-sky-500 to-cyan-600'
  },
  Hydrofort: {
    name: 'HYDROFORT',
    tagline: 'Bladder tank for drinking or plant water',
    features: [
      'Pump cycle control / water storage',
      'Water in bladder design',
      'Horizontal up to 120,000 L',
      'Vertical up to 60,000 L'
    ],
    color: 'from-cyan-500 to-blue-600'
  },
  EUV: {
    name: 'EUV',
    tagline: 'Bladder tank for wastewater & raw water',
    features: [
      'For surge protection',
      'Heavy sedimentation applications',
      'Air in bladder design',
      'Vertical only up to 60,000 L'
    ],
    color: 'from-emerald-500 to-teal-600'
  },
  ARAA: {
    name: 'ARAA',
    tagline: 'Dipping tube style (no bladder)',
    features: [
      'For surge protection',
      'Design with no bladder',
      'Low pressure / zero static head',
      'Vertical only up to 80,000 L'
    ],
    color: 'from-purple-500 to-indigo-600'
  },
  Compressor: {
    name: 'COMPRESSOR TYPE (AIR-OVER-WATER)',
    tagline: 'Complete surge protection package',
    features: [
      'Surge protection & pump cycle control',
      'Complete package (vessel, compressor, panel, instrumentation)',
      'Air/water interface design',
      'Vertical or horizontal configuration',
      'Very High Capital Cost & Maintenance',
      'Old Technology',
      'Issue: Dissolution of Air into Water; Not Desirable',
      'Possibility of Corrosion over Time'
    ],
    color: 'from-orange-500 to-red-600'
  }
};

export default function Config() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const [dutyARAA, setDutyARAA] = useState(false);
  const [expanded, setExpanded] = useState<Tech | null>(null);

  // Redirect safeguard if user picked Other
  useEffect(() => {
    if (state.media === 'Other') nav('/contact');
  }, [state.media, nav]);

  // Reset legacy selection if it was the removed 'AirWater'
  useEffect(() => {
    // @ts-expect-error legacy value cleanup
    if (state.tech === 'AirWater') {
      setState(s => ({ ...s, tech: undefined, orientation: undefined }));
    }
  }, [state.tech, setState]);

  const hasSolids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  // Removed 'AirWater' from availability
  const availableTechs: Tech[] = useMemo(() => {
    if (hasSolids) return ['EUV'];
    if (dutyARAA) return ['ARAA'];
    return ['Hydrochoc', 'Hydrofort', 'Compressor'];
  }, [hasSolids, dutyARAA]);

  const orientationLockedVertical = state.tech === 'EUV' || state.tech === 'ARAA';
  const handleSelectTech = (t: Tech) => {
    setState(s => ({
      ...s,
      tech: t,
      orientation: (t === 'EUV' || t === 'ARAA') ? 'Vertical' : s.orientation
    }));
    setExpanded(prev => prev === t ? null : t);
  };

  const orientations: Orientation[] = orientationLockedVertical
    ? ['Vertical']
    : ['Horizontal', 'Vertical'];

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
      <h1 className="text-2xl font-semibold">Surge Vessel Selection</h1>

      {!hasSolids && (
        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white">
          <input
            type="checkbox"
            checked={dutyARAA}
            onChange={e => {
              setDutyARAA(e.target.checked);
              if (e.target.checked) {
                setState(s => ({ ...s, tech: 'ARAA', orientation: 'Vertical' }));
                setExpanded('ARAA');
              } else if (state.tech === 'ARAA') {
                setState(s => ({ ...s, tech: undefined, orientation: undefined }));
                setExpanded(null);
              }
            }}
          />
          <span className="text-sm">
            Minimum 1–2 pump start/stops per day & relatively flat pipeline (no power implied)?
            {dutyARAA && (
              <span className="block mt-1 text-blue-600 font-medium">
                ARAA applied – Vertical only.
              </span>
            )}
          </span>
        </label>
      )}

      <div className="space-y-4">
        <p className="font-medium">Technology</p>
        <div className="grid gap-4">
          {availableTechs.map(t => {
            const meta = PRODUCTS[t];
            const selected = state.tech === t;
            const isExpanded = expanded === t;
            return (
              <div
                key={t}
                className={`border rounded-2xl bg-white transition-all duration-300
                  ${selected ? 'border-blue-600 shadow-lg' : 'border-slate-200 hover:border-blue-400 hover:shadow'}
                `}
              >
                <button
                  type="button"
                  onClick={() => handleSelectTech(t)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                >
                  <div>
                    <div className={`text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r ${meta.color}`}>
                      {meta.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{meta.tagline}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    <ChevronRight
                      className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  </div>
                </button>
                <div
                  className={`px-5 pt-0 overflow-hidden transition-all duration-500 ease-in-out
                    ${isExpanded ? 'max-h-64 opacity-100 pb-5' : 'max-h-0 opacity-0'}
                  `}
                  aria-hidden={!isExpanded}
                >
                  <ul className="space-y-2 text-sm">
                    {meta.features.map(f => (
                      <li
                        key={f}
                        className="pl-3 border-l-2 border-gradient-to-b from-blue-500 to-cyan-500 border-blue-400 text-slate-600"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {state.tech && (
        <div className="space-y-2">
          <p className="font-medium">Orientation</p>
            <div className="flex flex-wrap gap-2">
              {orientations.map(o => (
                <button
                  key={o}
                  onClick={() => setState(s => ({ ...s, orientation: o }))}
                  className={`px-3 py-2 rounded-lg border transition
                    ${state.orientation === o
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-slate-200 hover:border-blue-400'}
                  `}
                >
                  {o}
                </button>
              ))}
            </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={() => nav('/application')}
          className="px-3 py-2 border rounded-lg"
        >
          Back
        </button>
        <button
          onClick={handleNext}
            disabled={!state.tech || !state.orientation}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}