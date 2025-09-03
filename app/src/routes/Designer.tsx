import { useMemo, useState, lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, type Tech, type Orientation } from '../lib/store';
import { capsuleVolumeLitres, litresToUsGallons } from '../lib/sizing';
import { useTheme } from '../lib/theme';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet, Wrench, ShieldAlert, ShieldCheck, Cog, X, ChevronLeft, ChevronRight
} from 'lucide-react';

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
  pressureNote?: string;
};

const PRODUCTS: Record<Tech, ProductMeta> = {
  Hydrochoc: {
    name: 'HYDROCHOC',
    tagline: 'Bladder tank line for drinking water applications',
    pros: [
      'Surge protection',
      'No air-to-water contact',
      'Food-grade butyl bladder',
      'Large volume range'
    ],
    cons: ['Bladder inspection / replacement over lifecycle'],
    icon: Droplet,
    pressureNote: LIMITS.Hydrochoc.pressure
  },
  Hydrofort: {
    name: 'HYDROFORT',
    tagline: 'Bladder tank for drinking or plant water',
    pros: [
      'Pump cycle control',
      'Provides water storage',
      'Surge attenuation'
    ],
    cons: ['Bladder maintenance over lifecycle'],
    icon: Wrench,
    pressureNote: LIMITS.Hydrofort.pressure
  },
  EUV: {
    name: 'EUV',
    tagline: 'Bladder tank for wastewater & raw water',
    pros: [
      'Handles heavy sedimentation',
      'Air in bladder isolates gas',
      'Surge protection'
    ],
    cons: ['Vertical only (≤ 60,000 L)'],
    icon: ShieldCheck,
    pressureNote: LIMITS.EUV.pressure
  },
  ARAA: {
    name: 'ARAA',
    tagline: 'Dipping tube style (no bladder)',
    pros: [
      'No electricity required',
      'No bladder to fail',
      'Low maintenance'
    ],
    cons: [
      'Low pressure / zero static head only',
      'Vertical only (≤ 80,000 L)'
    ],
    icon: ShieldAlert,
    pressureNote: LIMITS.ARAA.pressure
  },
  Compressor: {
    name: 'COMPRESSOR TYPE (AIR-OVER-WATER)',
    tagline: 'Complete air-over-water system',
    pros: [
      'Integrated control & compressor',
      'Flexible orientation',
      'Surge + cycle control'
    ],
    cons: [
      'Higher capital & maintenance',
      'Air dissolution risk',
      'Potential long-term corrosion',
      'Old Technology'
    ],
    icon: Cog,
    pressureNote: LIMITS.Compressor.pressure
  }
};

function FlipCard({
  tech,
  selected,
  greyed,
  onSelect,
  onMore
}: {
  tech: Tech;
  selected: boolean;
  greyed: boolean;
  onSelect: () => void;
  onMore: () => void;
}) {
  const meta = PRODUCTS[tech];
  const Icon = meta.icon;
  return (
    <div className={`group relative w-64 h-72 flex-shrink-0 [perspective:1200px] ${greyed ? 'opacity-45' : ''}`}>
      <div
        className={`relative w-full h-full rounded-2xl border bg-white shadow-sm transition
         ${selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}
         [transform-style:preserve-3d] duration-700 group-hover:[transform:rotateY(180deg)]`}
      >
        {/* Front */}
        <button
          type="button"
            onClick={!greyed ? onSelect : undefined}
          className="absolute inset-0 flex flex-col justify-between p-4 rounded-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm leading-tight line-clamp-2">{meta.name}</div>
                <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{meta.tagline}</div>
              </div>
            </div>
            {/* Placeholder 2D drawing panel */}
            <div className="flex-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[11px] text-slate-500">
              2D Drawing Placeholder
            </div>
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2">
            <span>{meta.pressureNote}</span>
            {selected && (
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">
                Selected
              </span>
            )}
          </div>
        </button>

        {/* Back */}
        <div
          className="absolute inset-0 p-4 rounded-2xl bg-white flex flex-col justify-between [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="space-y-2 overflow-hidden">
            <div className="font-semibold text-sm">{meta.name}</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <ul className="space-y-1">
                {meta.pros.map(p => (
                  <li key={p} className="flex items-start gap-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-1">
                {meta.cons.map(c => (
                  <li key={c} className="flex items-start gap-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px]">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <button
              type="button"
              disabled={greyed}
              onClick={!greyed ? onSelect : undefined}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border
                ${greyed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'} transition`}
            >
              Select
            </button>
            <button
              type="button"
              disabled={greyed}
              onClick={onMore}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-600 text-white shadow
                ${greyed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition`}
            >
              More Info
            </button>
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

  // New solids logic:
  // ARAA only if BOTH continuous & flat are true; otherwise EUV only.
  const showARAA = hasSolids && state.pipelineContinuous === true && state.pipelineFlat === true;
  const showEUV = hasSolids && !showARAA;

  // Base availability (non-solids) unchanged
  const baseTechs: Tech[] = hasSolids ? [] : ['Hydrochoc', 'Hydrofort', 'Compressor'];
  const solidsTechs: Tech[] = [
    ...(showEUV ? (['EUV'] as Tech[]) : []),
    ...(showARAA ? (['ARAA'] as Tech[]) : [])
  ];
  const logicalTechs = [...baseTechs, ...solidsTechs];

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

  const effectiveVolume = mode === 'dimensions' ? computedL : capacityLitres;

  // Function: determine if a tech is volume-feasible under ANY orientation it supports
  const isVolumeAllowed = (tech: Tech, vol: number): boolean => {
    const limits = LIMITS[tech].byOrientation;
    // If vertical-only tech (enforced later) just check vertical
    if (tech === 'EUV' || tech === 'ARAA') {
      return vol <= limits.Vertical;
    }
    // Others: allowed if meets ANY orientation cap
    return vol <= limits.Horizontal || vol <= limits.Vertical;
  };

  // Combine logic: tech available if in logicalTechs and volume feasible
  const availableBySizing = (t: Tech) => logicalTechs.includes(t) && isVolumeAllowed(t, effectiveVolume);

  // Pick chosen tech or fallback
  const chosenTech: Tech | undefined =
    state.tech && availableBySizing(state.tech) ? state.tech :
      logicalTechs.find(t => availableBySizing(t));

  // Side-effect reconcile invalid tech selection (no flicker)
  useEffect(() => {
    if (!chosenTech && state.tech) {
      setState(s => ({ ...s, tech: undefined, orientation: undefined }));
    } else if (chosenTech && state.tech !== chosenTech) {
      setState(s => ({
        ...s,
        tech: chosenTech,
        orientation: (chosenTech === 'EUV' || chosenTech === 'ARAA') ? 'Vertical' : s.orientation
      }));
    }
  }, [chosenTech, state.tech, setState]);

  const orientationLockedVertical = chosenTech === 'EUV' || chosenTech === 'ARAA';
  const orientations: Orientation[] = orientationLockedVertical
    ? ['Vertical']
    : ['Horizontal', 'Vertical'];

  const activeOrientation = state.orientation && orientations.includes(state.orientation)
    ? state.orientation
    : orientations[0];

  const limit = chosenTech
    ? LIMITS[chosenTech].byOrientation[activeOrientation]
    : undefined;

  const exceeds = !!limit && effectiveVolume > limit;
  const suggestedQty = limit ? Math.max(1, Math.ceil(effectiveVolume / limit)) : 1;

  const onSelectTech = (t: Tech) => {
    if (!availableBySizing(t)) return;
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
      orientation: activeOrientation
    }));
    nav('/summary');
  };

  // Modal / gallery
  const [modalTech, setModalTech] = useState<Tech | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const GALLERY: Record<Tech, { src: string; caption: string }[]> = {
    Hydrochoc: [{ src: '/placeholder-hc.svg', caption: 'HYDROCHOC – municipal install' }],
    Hydrofort: [{ src: '/placeholder-hf.svg', caption: 'HYDROFORT – boosting skid' }],
    EUV: [{ src: '/placeholder-euv.svg', caption: 'EUV – wastewater vertical' }],
    ARAA: [{ src: '/placeholder-araa.svg', caption: 'ARAA – dipping tube internal' }],
    Compressor: [{ src: '/placeholder-comp.svg', caption: 'Compressor package layout' }],
  };

  const openModal = (t: Tech) => {
    setModalTech(t);
    setGalleryIndex(0);
  };

  const noTechs = logicalTechs.length === 0;

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Design & Sizing
        </h1>
        <p className="text-sm text-slate-600">
          Flip a surge vessel card for pros & cons. Sizing updates instantly grey out incompatible technologies.
        </p>
      </header>

      {/* Horizontal flip card row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Surge Vessel Types</h2>
          {hasSolids && (
            <span className="text-xs px-2 py-1 rounded bg-emerald-100 text-emerald-700">
              Solids-handling logic active
            </span>
          )}
        </div>
        <div
          className="flex gap-6 overflow-x-auto pb-2 pt-1 -mx-2 px-2 snap-x"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {(['Hydrochoc', 'Hydrofort', 'EUV', 'ARAA', 'Compressor'] as Tech[]).map(t => {
            const greyed = !availableBySizing(t);
            return (
              <div key={t} className="snap-start">
                <FlipCard
                  tech={t}
                  selected={state.tech === t}
                  greyed={greyed}
                  onSelect={() => onSelectTech(t)}
                  onMore={() => !greyed && openModal(t)}
                />
              </div>
            );
          })}
        </div>
        {noTechs && (
          <div className="text-sm text-amber-700 bg-amber-50 border border-amber-300 px-4 py-3 rounded-lg">
            No technologies are currently available based on previous answers. Adjust project inputs.
          </div>
        )}
      </section>

      {/* Detail + Sizing */}
      {chosenTech && !noTechs && (
        <section className="space-y-10">
          {/* Tech detail + orientation */}
            <motion.div
              layout
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-xl font-semibold">{PRODUCTS[chosenTech].name}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                      {LIMITS[chosenTech].pressure}
                    </span>
                    {orientationLockedVertical && (
                      <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                        Vertical only
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{PRODUCTS[chosenTech].tagline}</p>
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-slate-500">Orientation</div>
                    <div className="flex gap-2 flex-wrap">
                      {orientations.map(o => (
                        <button
                          key={o}
                          onClick={() => setState(s => ({ ...s, orientation: o }))}
                          className={`px-3 py-1.5 rounded-lg text-sm border transition
                            ${activeOrientation === o
                              ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50'
                              : 'border-slate-200 hover:border-blue-400'}`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    {limit && (
                      <div className="text-xs text-slate-600">
                        Limit ({activeOrientation}): {limit.toLocaleString()} L
                      </div>
                    )}
                    {exceeds && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-300 px-2 py-1 rounded">
                        Exceeds single vessel → Suggest {suggestedQty} units.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

          {/* Sizing */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <h2 className="text-lg font-semibold">Preliminary Sizing</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('dimensions')}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    mode === 'dimensions'
                      ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  Dimensions Known
                </button>
                <button
                  onClick={() => setMode('capacity')}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    mode === 'capacity'
                      ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-400'
                  }`}
                >
                  Capacity Known
                </button>
              </div>
            </div>

            {mode === 'dimensions' && (
              <div className="grid md:grid-cols-2 gap-6">
                <label className="text-sm font-medium space-y-2">
                  <span>Diameter (mm)</span>
                  <input
                    type="number"
                    value={diameterMm}
                    onChange={e => setD(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    min={100}
                    max={5000}
                  />
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    value={diameterMm}
                    onChange={e => setD(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </label>
                <label className="text-sm font-medium space-y-2">
                  <span>Overall Length (mm)</span>
                  <input
                    type="number"
                    value={lengthMm}
                    onChange={e => setL(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    min={500}
                    max={10000}
                  />
                  <input
                    type="range"
                    min={500}
                    max={10000}
                    value={lengthMm}
                    onChange={e => setL(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </label>
              </div>
            )}

            {mode === 'capacity' && (
              <div className="max-w-md">
                <label className="text-sm font-medium space-y-2 block">
                  <span>Required Capacity (L)</span>
                  <input
                    type="number"
                    value={capacityLitres}
                    onChange={e => setCap(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    min={100}
                    max={125000}
                  />
                  <span className="text-xs text-slate-500">
                    Used to filter feasible technologies.
                  </span>
                </label>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border bg-white" style={{ borderColor: theme.borderColor }}>
                <div className="text-xs text-slate-500">Volume (L)</div>
                <div className="text-2xl font-semibold mt-1">{effectiveVolume.toFixed(0)}</div>
              </div>
              <div className="p-4 rounded-xl border bg-white" style={{ borderColor: theme.borderColor }}>
                <div className="text-xs text-slate-500">Volume (US gal)</div>
                <div className="text-2xl font-semibold mt-1">{litresToUsGallons(effectiveVolume).toFixed(0)}</div>
              </div>
              <div className="p-4 rounded-xl border bg-white" style={{ borderColor: theme.borderColor }}>
                <div className="text-xs text-slate-500">Orientation</div>
                <div className="text-2xl font-semibold mt-1">{activeOrientation ?? '-'}</div>
              </div>
              <div className="p-4 rounded-xl border bg-white" style={{ borderColor: theme.borderColor }}>
                <div className="text-xs text-slate-500">Suggested Qty</div>
                <div className="text-2xl font-semibold mt-1">{exceeds ? suggestedQty : 1}</div>
              </div>
            </div>

            {mode === 'dimensions' && activeOrientation && (
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={show3D}
                    onChange={e => setShow3D(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Show 3D Visualization
                </label>
                <AnimatePresence>
                  {show3D && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <Suspense fallback={<div className="h-64 rounded-xl border bg-slate-100" />}>
                        <div className="h-96 rounded-xl border overflow-hidden bg-slate-50">
                          <ThreeVessel
                            orientation={activeOrientation}
                            diameter={diameterMm}
                            length={lengthMm}
                            color="#3b82f6"
                          />
                        </div>
                      </Suspense>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <button
          onClick={() => nav('/project')}
          className="px-4 py-2 rounded-lg border bg-white hover:bg-slate-50 transition"
          style={{ borderColor: theme.borderColor }}
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          disabled={!chosenTech || !activeOrientation}
          onClick={onNext}
          className="px-8 py-3 rounded-lg text-white font-medium shadow-lg disabled:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
          }}
        >
          Next →
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalTech && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalTech(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-xl"
              initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b px-5 py-3">
                <div>
                  <div className="font-semibold">{PRODUCTS[modalTech].name}</div>
                  <div className="text-xs text-slate-600">{PRODUCTS[modalTech].tagline}</div>
                </div>
                <button
                  className="p-2 rounded-lg border hover:bg-slate-50"
                  onClick={() => setModalTech(null)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 grid lg:grid-cols-2 gap-6">
                {/* Gallery */}
                <div className="space-y-3">
                  <div className="font-medium text-sm">Gallery</div>
                  <div className="relative h-64 rounded-xl border flex items-center justify-center bg-slate-50">
                    <img
                      src={GALLERY[modalTech][galleryIndex].src}
                      alt={GALLERY[modalTech][galleryIndex].caption}
                      className="max-h-60"
                    />
                    {GALLERY[modalTech].length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow"
                          onClick={() =>
                            setGalleryIndex(i =>
                              (i - 1 + GALLERY[modalTech].length) % GALLERY[modalTech].length
                            )
                          }
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow"
                          onClick={() =>
                            setGalleryIndex(i =>
                              (i + 1) % GALLERY[modalTech].length
                            )
                          }
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-600">
                    {GALLERY[modalTech][galleryIndex].caption}
                  </div>
                </div>
                {/* Details */}
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-medium mb-1">Overview</div>
                    <p>{PRODUCTS[modalTech].tagline}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium text-xs mb-1 text-emerald-600">Advantages</div>
                      <ul className="space-y-1">
                        {PRODUCTS[modalTech].pros.map(p => (
                          <li key={p} className="flex gap-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 text-[10px]">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-xs mb-1 text-amber-600">Considerations</div>
                      <ul className="space-y-1">
                        {PRODUCTS[modalTech].cons.map(c => (
                          <li key={c} className="flex gap-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-600 text-[10px]">!</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    Pressure Context: {LIMITS[modalTech].pressure}
                  </div>
                </div>
              </div>
              <div className="border-t px-5 py-3 flex justify-end">
                <button
                  onClick={() => setModalTech(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

