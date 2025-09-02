import { useMemo, useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Tech, type Orientation } from '../lib/store';
import { capsuleVolumeLitres, litresToUsGallons } from '../lib/sizing';
import { useTheme } from '../lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Wrench, ShieldAlert, ShieldCheck, Cog } from 'lucide-react';

const ThreeVessel = lazy(() => import('../components/ThreeVessel'));

const LIMITS: Record<Tech, { byOrientation: Record<Orientation, number>; pressure: string }> = {
  Hydrochoc: { byOrientation: { Horizontal: 125000, Vertical: 80000 }, pressure: '100 bar' },
  Hydrofort: { byOrientation: { Horizontal: 125000, Vertical: 80000 }, pressure: '100 bar' },
  Compressor: { byOrientation: { Horizontal: 125000, Vertical: 125000 }, pressure: '100 bar' },
  ARAA: { byOrientation: { Horizontal: 60000, Vertical: 60000 }, pressure: '1 atm' },
  EUV: { byOrientation: { Horizontal: 60000, Vertical: 60000 }, pressure: '1 atm' },
};

type ProductMeta = {
  name: string;
  tagline: string;
  pros: string[];
  cons: string[];
  icon: React.ComponentType<{ className?: string }>;
};

const PRODUCTS: Record<Tech, ProductMeta> = {
  Hydrochoc: { name: 'HYDROCHOC', tagline: 'Bladder tank line for drinking water applications', pros: ['Surge protection', 'No air-to-water contact', 'Food-grade butyl bladder'], cons: ['Bladder maintenance over lifecycle'], icon: Droplet },
  Hydrofort: { name: 'HYDROFORT', tagline: 'Bladder tank for drinking or plant water', pros: ['Pump cycle control', 'Water storage capability'], cons: ['Bladder maintenance over lifecycle'], icon: Wrench },
  EUV: { name: 'EUV', tagline: 'Bladder tank for wastewater & raw water', pros: ['Suitable for heavy sedimentation', 'Air in bladder design'], cons: ['Vertical only (up to 60,000 L)'], icon: ShieldCheck },
  ARAA: { name: 'ARAA', tagline: 'Dipping tube style (no bladder)', pros: ['No electricity required', 'No bladder to pierce', 'Ideal for solids/fibers'], cons: ['Low pressure / zero static head only', 'Vertical only (up to 60,000 L)'], icon: ShieldAlert },
  Compressor: { name: 'COMPRESSOR', tagline: 'Complete surge protection package', pros: ['Complete package including panel', 'Vertical or horizontal configuration'], cons: ['High capital/maintenance cost', 'Air dissolution into water possible', 'Potential corrosion over time'], icon: Cog },
};

function FlipCard({ meta, selected, greyed, onSelect, onMore }: { meta: ProductMeta; selected: boolean; greyed?: boolean; onSelect: () => void; onMore: () => void }) {
  const Icon = meta.icon;
  return (
    <div className={`group [perspective:1000px] ${greyed ? 'opacity-60' : ''}`}>
      <div className={`relative h-48 w-full rounded-2xl border transition shadow-sm ${selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'} [transform-style:preserve-3d] duration-500 group-hover:[transform:rotateY(180deg)]`}>
        <button type="button" onClick={onSelect} className="absolute inset-0 p-4 text-left rounded-2xl bg-white flex items-center justify-between" style={{ backfaceVisibility: 'hidden' }}>
          <div>
            <div className="font-semibold text-sm">{meta.name}</div>
            <div className="text-slate-600 text-xs mt-1">{meta.tagline}</div>
          </div>
          <Icon className="w-6 h-6 text-blue-600" />
        </button>
        <div className="absolute inset-0 p-4 rounded-2xl bg-white [transform:rotateY(180deg)]" style={{ backfaceVisibility: 'hidden' }}>
          <div className="font-semibold text-sm mb-1">{meta.name}</div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <ul className="space-y-1">
              {meta.pros.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {meta.cons.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700">!</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={onMore} className="px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white" type="button">More Info</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Designer() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const { theme } = useTheme();

  const hasSolids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  const showEUV = hasSolids && (state.pipelineContinuous === true || state.pipelineFlat === true);
  const showARAA = hasSolids && (state.pipelineFlat === true && state.pipelineContinuous === false);

  const baseTechs: Tech[] = hasSolids ? ([] as Tech[]) : ['Hydrochoc', 'Hydrofort', 'Compressor'];
  const solidsTechs: Tech[] = [...(showEUV ? (['EUV'] as Tech[]) : []), ...(showARAA ? (['ARAA'] as Tech[]) : [])];
  const availableTechs = [...baseTechs, ...solidsTechs];

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
  const limit = chosenTech ? LIMITS[chosenTech].byOrientation[state.orientation ?? orientations[0]] : undefined;
  const exceeds = limit ? effectiveL > limit : false;
  const suggestedQty = limit ? Math.max(1, Math.ceil(effectiveL / limit)) : 1;

  const recommendedTech = state.pressureBoosting ? 'Hydrofort' : undefined;

  const [modalTech, setModalTech] = useState<Tech | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const GALLERY: Record<Tech, { src: string; caption: string }[]> = {
    Hydrochoc: [
      { src: '/src/assets/react.svg', caption: 'HYDROCHOC – municipal water' },
      { src: '/src/assets/react.svg', caption: 'Skid layout example' },
    ],
    Hydrofort: [{ src: '/src/assets/react.svg', caption: 'HYDROFORT – pressure boosting' }],
    EUV: [{ src: '/src/assets/react.svg', caption: 'EUV – wastewater application' }],
    ARAA: [{ src: '/src/assets/react.svg', caption: 'ARAA – dipping tube design' }],
    Compressor: [{ src: '/src/assets/react.svg', caption: 'Compressor package – panel & vessel' }],
  };

  const onSelectTech = (t: Tech) => {
    setState((s) => ({ ...s, tech: t, orientation: t === 'EUV' || t === 'ARAA' ? 'Vertical' : s.orientation }));
  };

  const onNext = () => {
    setState((s) => ({ ...s, capacityLitres: mode === 'dimensions' ? computedL : capacityLitres, diameterMm, lengthMm }));
    nav('/summary');
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Selector */}
      <div className="space-y-4">
        <h2 className="font-semibold">Surge Vessel Selector</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {availableTechs.map((t) => {
            const meta = PRODUCTS[t];
            const selected = state.tech === t;
            const greyed = recommendedTech && t !== recommendedTech;
            return <FlipCard key={t} meta={meta} selected={!!selected} greyed={!!greyed} onSelect={() => onSelectTech(t)} onMore={() => { setModalTech(t); setGalleryIndex(0); }} />;
          })}
          {!availableTechs.length && <div className="text-sm text-slate-600">No technologies visible for the current answers.</div>}
        </div>
        <div className="space-y-2">
          <div className="font-medium">Orientation</div>
          <div className="flex gap-2 flex-wrap">
            {orientations.map((o) => (
              <button key={o} onClick={() => setState((s) => ({ ...s, orientation: o }))} className={`px-3 py-2 rounded-lg border ${state.orientation === o ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}>
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
          <button onClick={() => setMode('dimensions')} className={`px-4 py-2 rounded-lg border ${mode === 'dimensions' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}>Dimensions Known</button>
          <button onClick={() => setMode('capacity')} className={`px-4 py-2 rounded-lg border ${mode === 'capacity' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}>Capacity Known</button>
        </div>

        {mode === 'dimensions' && (
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm">
              Diameter (mm)
              <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={diameterMm} onChange={(e) => setD(Number(e.target.value))} />
            </label>
            <label className="text-sm">
              Overall Length (mm)
              <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={lengthMm} onChange={(e) => setL(Number(e.target.value))} />
            </label>
          </div>
        )}

        {mode === 'capacity' && (
          <label className="text-sm block">
            Capacity (L)
            <input type="number" className="mt-1 w-full px-3 py-2 border rounded-lg" value={capacityLitres} onChange={(e) => setCap(Number(e.target.value))} />
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
              <div className="text-sm">Capacity exceeds {chosenTech} {state.orientation ?? orientations[0]} limit ({limit.toLocaleString()} L). Suggested quantity: {suggestedQty} units.</div>
            ) : (
              <div className="text-sm">Within {chosenTech} limit ({limit.toLocaleString()} L).</div>
            )}
          </div>
        )}

        {mode === 'dimensions' && state.orientation && (
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={show3D} onChange={(e) => setShow3D(e.target.checked)} /> Show 3D Visualization
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

      <AnimatePresence>
        {modalTech && (
          <motion.div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalTech(null)}>
            <motion.div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <div className="font-semibold">{PRODUCTS[modalTech].name}</div>
                  <div className="text-xs text-slate-600">{PRODUCTS[modalTech].tagline}</div>
                </div>
                <button className="px-3 py-1.5 rounded-lg border" onClick={() => setModalTech(null)}>Close</button>
              </div>
              <div className="p-4 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm">Gallery</div>
                  <div className="relative h-56 rounded-xl border flex items-center justify-center bg-slate-50">
                    <img src={GALLERY[modalTech][galleryIndex].src} alt={GALLERY[modalTech][galleryIndex].caption} className="max-h-56" />
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/90 border" onClick={() => setGalleryIndex((i) => (i - 1 + GALLERY[modalTech].length) % GALLERY[modalTech].length)}>‹</button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-white/90 border" onClick={() => setGalleryIndex((i) => (i + 1) % GALLERY[modalTech].length)}>›</button>
                  </div>
                  <div className="text-xs text-slate-600">{GALLERY[modalTech][galleryIndex].caption}</div>
                </div>
                <div className="space-y-2 text-sm">
                  {modalTech === 'ARAA' ? (
                    <>
                      <div className="font-medium">About ARAA</div>
                      <p>
                        An ARAA surge vessel is a bladder-free, self-regulating surge suppressor designed for wastewater and raw water systems.
                        It uses a dipping tube and float valve to maintain the air/water interface without a compressor, ideal for fluids with solids.
                      </p>
                      <a href="https://www.charlattereservoirs.fayat.com/" target="_blank" rel="noopener" className="inline-block text-blue-600 underline">More info</a>
                    </>
                  ) : (
                    <>
                      <div className="font-medium">Overview</div>
                      <p>{PRODUCTS[modalTech].tagline}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
