import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Droplet, Gauge, LineChart, Ruler, Info } from 'lucide-react';

function Help({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-xs" title={text}>
      <Info className="w-4 h-4" />
      Help
    </span>
  );
}

function ToggleButtons<T extends string | boolean>({
  values,
  current,
  onSelect,
  renderLabel,
  disabledValue
}: {
  values: readonly T[];
  current: T | undefined;
  onSelect: (v: T) => void;
  renderLabel?: (v: T) => string;
  disabledValue?: (v: T) => boolean;
}) {
  return (
    <>
      {values.map(v => {
        const disabled = disabledValue?.(v) ?? false;
        const active = current === v;
        return (
          <button
            key={String(v)}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSelect(v)}
            className={`px-4 py-2 rounded-lg text-sm border transition 
              ${active ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' : 'border-slate-200 hover:border-blue-400'}
              ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {renderLabel ? renderLabel(v) : String(v)}
          </button>
        );
      })}
    </>
  );
}

export default function ProjectInfo() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const hasSolids =
    state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  // Local helper to set state safely
  const update = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState(s => ({ ...s, [k]: v }));

  // Ensure pumping forces surge protection = true (locked)
  const pumping = state.operationType === 'Pumping';

  const handleNext = () => {
    // Always proceed to designer (do NOT force Contact here)
    nav('/designer');
  };

  const parseNum = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  // Keep requireSurgeProtection auto = true if pumping
  if (pumping && state.requireSurgeProtection !== true) {
    update('requireSurgeProtection', true);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Project Information</h1>

      {/* Operation Type */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Operation Type</h2>
          <Help text={'Pumping lines typically need surge protection; gravity lines less often.'} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <ToggleButtons
            values={['Pumping', 'Gravity'] as const}
            current={state.operationType}
            onSelect={v => {
              update('operationType', v);
              if (v === 'Pumping') {
                update('requireSurgeProtection', true);
              } else if (state.requireSurgeProtection && !pumping) {
                // leave existing user choice if previously set
              }
            }}
          />
        </div>
        {state.operationType === 'Pumping' && (
          <p className="text-sm text-emerald-700">
            Pumping selected: Surge Protection is automatically set to Yes.
          </p>
        )}
        {state.operationType === 'Gravity' && (
          <p className="text-sm text-slate-600">
            Gravity selected: Surge protection optional.
          </p>
        )}
      </section>

      {/* Surge Protection */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Surge Vessel Protection</h2>
          <Help text={'Surge vessels mitigate transient pressure spikes (water hammer).'} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <ToggleButtons
            values={['Yes', 'No'] as const}
            current={state.requireSurgeProtection ? 'Yes' : 'No'}
            onSelect={v => update('requireSurgeProtection', v === 'Yes')}
            disabledValue={v => pumping && v === 'No'}
          />
        </div>
        {pumping && (
          <p className="text-xs text-slate-500">
            Required due to Pumping operation.
          </p>
        )}
      </section>

      {/* Surge Analysis (informational only if protection selected) */}
      {state.requireSurgeProtection && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">Has a Surge Analysis been completed?</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            <ToggleButtons
              values={['Yes', 'No'] as const}
              current={state.surgeAnalysisDone}
              onSelect={v => update('surgeAnalysisDone', v)}
            />
          </div>
          {state.surgeAnalysisDone === 'No' && (
            <div className="text-sm text-slate-700 space-y-2">
              <p>
                No study yet? Provide preliminary info below or proceed to the next step—your vessel selection can still be refined later.
              </p>
            </div>
          )}
        </section>
      )}

      {/* AQ10 Surge Questionnaire CTA (ONLY when surge protection = true AND answer = No) */}
      {state.requireSurgeProtection && state.surgeAnalysisDone === 'No' && (
        <section>
          <div className="p-5 rounded-xl border border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 tracking-wide">
              Need a Surge / Transient Analysis? (AQ10 Intake)
            </h3>
            <p className="text-xs text-blue-800/90 mt-2 leading-relaxed">
              Not a problem! Charlatte Reservoirs can provide a FREE Surge Vessel Protection Analysis. Fill out as much information
              as possible in the digital AQ10 form (opens in a new tab), or download a blank version for manual completion. Your details
              will be forwarded to our specialized Hydraulic Engineering Division with this selector inquiry. We will follow up with professional
              recommendations and next steps.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                type="button"
                onClick={() => window.open(`${import.meta.env.BASE_URL}aq10`, '_blank')}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-600 text-white shadow hover:bg-blue-700 transition"
              >
                Open Digital AQ10
              </button>
              <a
                href={`${import.meta.env.BASE_URL}aq10`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-xs font-medium border border-blue-400 text-blue-700 bg-white/70 hover:bg-white transition"
              >
                Open in Same Tab
              </a>
              <button
                type="button"
                onClick={() => window.open(`${import.meta.env.BASE_URL}aq10?blank=1`, '_blank')}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-blue-300 text-blue-600 bg-white/50 hover:bg-white transition"
              >
                Blank Template
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Pressure Boosting (independent) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Pressure Boosting?</h2>
          <Help text={'Indicates if system includes a boosting function.'} />
        </div>
        <div className="flex gap-3 flex-wrap">
          <ToggleButtons
            values={[true, false] as const}
            current={state.pressureBoosting}
            onSelect={v => update('pressureBoosting', v)}
            renderLabel={v => (v ? 'Yes' : 'No')}
          />
        </div>
      </section>

      {/* Pipeline Questions (solids media only) */}
      {hasSolids && (
        <section className="space-y-4">
          <h2 className="font-medium">Pipeline Questions (Solids Media)</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm">Continuous Pump Operation?</span>
            <ToggleButtons
              values={[true, false] as const}
              current={state.pipelineContinuous}
              onSelect={v => update('pipelineContinuous', v)}
              renderLabel={v => (v ? 'Yes' : 'No')}
            />
          </div>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-sm">Pipeline Profile Relatively Flat?</span>
              <ToggleButtons
                values={[true, false] as const}
                current={state.pipelineFlat}
                onSelect={v => update('pipelineFlat', v)}
                renderLabel={v => (v ? 'Yes' : 'No')}
              />
            </div>
          <div className="text-xs text-slate-600 space-y-1">
            <p>
              Logic: Media with solids → EUV default. If BOTH Continuous Operation = Yes AND Flat Profile = Yes → ARAA instead.
            </p>
            <p>
              These answers are the ONLY drivers for EUV vs ARAA availability (Operation Type & Surge Protection do not
              influence that choice).
            </p>
          </div>
        </section>
      )}

      {/* Key Design Inputs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Key Design Inputs (Optional)</h2>
          <Help text={'Non-mandatory preliminary context to refine vessel selection.'} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="text-xs space-y-1">
            <span className="font-medium">Design Pressure (bar)</span>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
              value={state.designPressureBar ?? ''}
              onChange={e => update('designPressureBar', parseNum(e.target.value))}
              min={0}
            />
          </label>
          <label className="text-xs space-y-1">
            <span className="font-medium">Pipeline Length (m)</span>
            <input
              type="number"
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
              value={state.pipelineLengthM ?? ''}
              onChange={e => update('pipelineLengthM', parseNum(e.target.value))}
              min={0}
            />
          </label>
          <label className="text-xs space-y-1 md:col-span-1">
            <span className="font-medium">Notes</span>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-200"
              value={state.notes ?? ''}
              onChange={e => update('notes', e.target.value || undefined)}
              placeholder="Optional"
            />
          </label>
        </div>
      </section>

      <div className="flex justify-between pt-2">
        <button onClick={() => nav('/application')} className="px-3 py-2 border rounded-lg">
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
