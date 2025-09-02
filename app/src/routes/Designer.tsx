import { useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Tech, type Orientation } from '../lib/store';
import { capsuleVolumeLitres, litresToUsGallons } from '../lib/sizing';
import { useTheme } from '../lib/theme';
import { motion } from 'framer-motion';
import { Info, CheckCircle2 } from 'lucide-react';

const ThreeVessel = lazy(() => import('../components/ThreeVessel'));

const LIMITS: Record<Tech, { byOrientation: Record<Orientation, number>; pressure: string } > = {
  Hydrochoc: { byOrientation: { Horizontal: 125000, Vertical: 80000 }, pressure: '100 bar' },
  Hydrofort: { byOrientation: { Horizontal: 125000, Vertical: 80000 }, pressure: '100 bar' },
  Compressor: { byOrientation: { Horizontal: 125000, Vertical: 125000 }, pressure: '100 bar' },
  ARAA: { byOrientation: { Horizontal: 60000, Vertical: 60000 }, pressure: '1 atm' },
  EUV: { byOrientation: { Horizontal: 60000, Vertical: 60000 }, pressure: '1 atm' },
};

const PRODUCTS: Record<Tech, { name: string; tagline: string; features: string[]; } > = {
  Hydrochoc: {
    name: 'HYDROCHOC',
    tagline: 'Bladder tank line for drinking water applications',
    features: [ 'Surge protection', 'Water in bladder design', 'No air-to-water contact' ],
  },
  Hydrofort: {
    name: 'HYDROFORT',
    tagline: 'Bladder tank for drinking or plant water',
    features: [ 'Pump cycle control / water storage', 'Water in bladder design' ],
  },
  EUV: {
    name: 'EUV',
    tagline: 'Bladder tank for wastewater & raw water',
    features: [ 'For surge protection', 'Heavy sedimentation applications', 'Air in bladder design' ],
  },
  ARAA: {
    name: 'ARAA',
    tagline: 'Dipping tube style (no bladder)',
    features: [ 'For surge protection', 'No electricity', 'Low pressure / zero static head' ],
  },
  Compressor: {
    name: 'COMPRESSOR',
    tagline: 'Complete surge protection package',
    features: [ 'Air/water interface design', 'Vertical or horizontal configuration' ],
  },
};

export default function Designer() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const { theme } = useTheme();

  const hasSolids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  // Visibility rules from Project Info
  const showEUV = hasSolids && (state.pipelineContinuous === true || state.pipelineFlat === true);
  const showARAA = hasSolids && (state.pipelineFlat === true && state.pipelineContinuous === false);

  const baseTechs: Tech[] = hasSolids ? ([] as Tech[]) : ['Hydrochoc', 'Hydrofort', 'Compressor'];
  const solidsTechs: Tech[] = [ ...(showEUV ? ['EUV'] as Tech[] : []), ...(showARAA ? ['ARAA'] as Tech[] : []) ];
  const availableTechs = [...baseTechs, ...solidsTechs];

  // Sizing state
  const [mode, setMode] = useState<'capacity' | 'dimensions'>(state.capacityLitres ? 'capacity' : 'dimensions');
  const [diameterMm, setD] = useState(state.diameterMm ?? 1000);
  const [lengthMm, setL] = useState(state.lengthMm ?? 2500);
  const [capacityLitres, setCap] = useState(state.capacityLitres ?? 5000);
  const [show3D, setShow3D] = useState(true);

  const computedL = useMemo(() => {
    const straight = Math.max(0, lengthMm - diameterMm);
    return capsuleVolumeLitres(diameterMm, straight);
  }, [diameterMm, lengthMm]);

  const chosenTech = state.tech && availableTechs.includes(state.tech) ? state.tech : availableTechs[0];
  const orientationLockedVertical = chosenTech === 'EUV' || chosenTech === 'ARAA';
  const orientations: Orientation[] = orientationLockedVertical ? ['Vertical'] : ['Horizontal', 'Vertical'];

  const effectiveL = mode === 'dimensions' ? computedL : capacityLitres;
  const limit = chosenTech ? LIMITS[chosenTech].byOrientation[(state.orientation ?? orientations[0])] : undefined;
  const exceeds = limit ? effectiveL > limit : false;
  const suggestedQty = limit ? Math.max(1, Math.ceil(effectiveL / limit)) : 1;

  const recommendedTech = state.pressureBoosting ? 'Hydrofort' : undefined;

  const onSelectTech = (t: Tech) => {
    setState(s => ({
      ...s,
      tech: t,
      orientation: (t === 'EUV' || t === 'ARAA') ? 'Vertical' : s.orientation
    }));
  };

  const onNext = () => {
    setState(s => ({
      ...s,
      capacityLitres: mode === 'dimensions' ? computedL : capacityLitres,
      diameterMm,
      lengthMm,
    }));
    nav('/summary');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Selector */}
      <div className="space-y-4">
        <h2 className="font-semibold">Surge Vessel Selector</h2>
        <div className="grid gap-4">
          {availableTechs.map(t => {
            const meta = PRODUCTS[t];
            const selected = state.tech === t;
            const greyed = recommendedTech && t !== recommendedTech;
            return (
              <button
                key={t}
                onClick={() => onSelectTech(t)}
                className={`text-left border rounded-2xl p-4 transition ${selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'} ${greyed ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{meta.name}</div>
                    <div className="text-sm text-slate-600">{meta.tagline}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {recommendedTech === t && (
                      <span className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" /> Recommended
                      </span>
                    )}
                  </div>
                </div>
                <ul className="mt-2 text-sm text-slate-600 list-disc pl-5">
                  {meta.features.map(f => (<li key={f}>{f}</li>))}
                </ul>
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                  <Info className="w-4 h-4" /> Limit: {LIMITS[t].byOrientation.Horizontal} L (H), {LIMITS[t].byOrientation.Vertical} L (V) · Pressure: {LIMITS[t].pressure}
                </div>
              </button>
            );
          })}
          {!availableTechs.length && (
            <div className="text-sm text-slate-600">No technologies visible for the current answers.</div>
          )}
        </div>
        <div className="space-y-2">
          <div className="font-medium">Orientation</div>
          <div className="flex gap-2 flex-wrap">
            {orientations.map(o => (
              <button
                key={o}
                onClick={() => setState(s => ({ ...s, orientation: o }))}
                className={`px-3 py-2 rounded-lg border ${state.orientation === o ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sizing */}
      <div className="space-y-4">
        <h2 className="font-semibold">Sizing</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setMode('dimensions')}
            className={`px-4 py-2 rounded-lg border ${mode === 'dimensions' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
          >
            Dimensions Known
          </button>
          <button
            onClick={() => setMode('capacity')}
            className={`px-4 py-2 rounded-lg border ${mode === 'capacity' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
          >
            Capacity Known
          </button>
        </div>

        {mode === 'dimensions' && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              Diameter (mm)
              <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={diameterMm} onChange={e => setD(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              Overall Length (mm)
              <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={lengthMm} onChange={e => setL(Number(e.target.value))} />
            </label>
          </div>
        )}

        {mode === 'capacity' && (
          <label className="text-sm block">
            Capacity (L)
            <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={capacityLitres} onChange={e => setCap(Number(e.target.value))} />
          </label>
        )}

        <div className="grid md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border" style={{ borderColor: theme.borderColor }}>
            <div className="text-xs text-slate-500">Volume (Litres)</div>
            <div className="text-xl font-semibold">{effectiveL.toFixed(0)} L</div>
          </div>
          <div className="p-3 rounded-lg border" style={{ borderColor: theme.borderColor }}>
            <div className="text-xs text-slate-500">Volume (US Gallons)</div>
            <div className="text-xl font-semibold">{litresToUsGallons(effectiveL).toFixed(0)} gal</div>
          </div>
          <div className="p-3 rounded-lg border" style={{ borderColor: theme.borderColor }}>
            <div className="text-xs text-slate-500">Orientation</div>
            <div className="text-xl font-semibold">{state.orientation ?? '-'}</div>
          </div>
        </div>

        {chosenTech && limit !== undefined && (
          <div className={`p-3 rounded-lg border ${exceeds ? 'border-amber-500 bg-amber-50' : 'border-emerald-300 bg-emerald-50'}`}>
            {exceeds ? (
              <div className="text-sm">
                Capacity exceeds {chosenTech} {state.orientation ?? orientations[0]} limit ({limit.toLocaleString()} L). Suggested quantity: {suggestedQty} units.
              </div>
            ) : (
              <div className="text-sm">Within {chosenTech} limit ({limit.toLocaleString()} L).</div>
            )}
          </div>
        )}

        {mode === 'dimensions' && state.orientation && (
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={show3D} onChange={e => setShow3D(e.target.checked)} /> Show 3D Visualization
            </label>
            {show3D && (
              <Suspense fallback={<div className="h-48 rounded-lg border" />}> 
                <div className="h-64 rounded-lg border overflow-hidden">
                  <ThreeVessel orientation={state.orientation} diameter={diameterMm} length={lengthMm} color="#3b82f6" />
                </div>
              </Suspense>
            )}
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button onClick={() => nav('/project')} className="px-3 py-2 border rounded-lg">Back</button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Next</motion.button>
        </div>
      </div>
    </div>
  );
}
