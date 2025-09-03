import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Info, Droplet, Gauge, LineChart, Ruler } from 'lucide-react';

function Help({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-slate-500 text-xs" title={text}>
      <Info className="w-4 h-4" />
      Help
    </span>
  );
}

export default function ProjectInfo() {
  const { state, setState } = useStore();
  const nav = useNavigate();

  const hasSolids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  const handleNext = () => {
    if (state.requireSurgeProtection && state.surgeAnalysisDone === 'No') {
      nav('/contact');
      return;
    }
    nav('/designer');
  };

  // Helper to update numeric fields safely
  const parseNum = (v: string) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Project Information</h1>

      {/* Operation Type */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Operation Type</h2>
          <Help text={"Pumping lines typically require surge protection; gravity lines usually do not."} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {(['Pumping', 'Gravity'] as const).map(v => (
            <button
              key={v}
              onClick={() => setState(s => ({
                ...s,
                operationType: v,
                requireSurgeProtection: v === 'Pumping' ? true : s.requireSurgeProtection === true ? true : undefined,
              }))}
              className={`px-4 py-2 rounded-lg border ${state.operationType === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
        {state.operationType === 'Pumping' && (
          <p className="text-sm text-emerald-700">Pumping selected: Surge protection is required and locked to Yes.</p>
        )}
        {state.operationType === 'Gravity' && (
          <p className="text-sm text-slate-600">Gravity selected: Surge protection usually not required, but you may choose Yes if needed.</p>
        )}
      </section>

      {/* Surge Protection (Yes/No only; Yes locked when Pumping) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Surge Vessel Protection</h2>
          <Help text={"Surge protection mitigates water hammer and pressure spikes (pump starts/stops, long rising mains)."} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {(['Yes', 'No'] as const).map(v => {
            const isYes = v === 'Yes';
            const lockedYes = state.operationType === 'Pumping' && isYes;
            const disabled = state.operationType === 'Pumping' ? !isYes : false;
            const active =
              (state.requireSurgeProtection === true && isYes) ||
              (state.requireSurgeProtection === false && !isYes) ||
              (state.requireSurgeProtection === undefined && false);
            return (
              <button
                key={v}
                disabled={disabled}
                onClick={() =>
                  setState(s => ({
                    ...s,
                    requireSurgeProtection: isYes ? true : false
                  }))
                }
                className={`relative px-4 py-2 rounded-lg border transition
                  ${active ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {v}
                {lockedYes && (
                  <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white">
                    Locked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Surge Analysis (only if surge protection required) */}
      {state.requireSurgeProtection && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">Has a Surge Analysis been completed?</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(['Yes', 'No'] as const).map(v => (
              <button
                key={v}
                onClick={() => setState(s => ({ ...s, surgeAnalysisDone: v }))}
                className={`px-4 py-2 rounded-lg border ${state.surgeAnalysisDone === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
              >
                {v}
              </button>
            ))}
          </div>
          {state.surgeAnalysisDone === 'No' && (
            <div className="text-sm text-slate-700 space-y-2">
              <p>No analysis yet? Provide approximate data below and optionally fill the AQ10 form for a free surge study.</p>
              <p>
                <a href="/aq10" target="_blank" rel="noopener" className="text-blue-600 underline">Open AQ10 form</a>
              </p>
            </div>
          )}
          {typeof window !== 'undefined' && localStorage.getItem('aq10Data') && (
            <div className="flex items-center gap-2 text-sm">
              <button
                className="px-3 py-1.5 rounded-lg border"
                onClick={() => {
                  try {
                    const data = JSON.parse(localStorage.getItem('aq10Data') || '{}');
                    setState(s => ({
                      ...s,
                      notes:
                        (s.notes ? s.notes + '\n' : '') +
                        `AQ10: ${data.projectName || ''} – ${data.notes || ''}`
                    }));
                  } catch {
                    // ignore
                  }
                }}
              >
                Import AQ10 answers
              </button>
              <span className="text-slate-500">(saved data detected)</span>
            </div>
          )}
        </section>
      )}

      {/* Pressure Boosting */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Pressure Boosting?</h2>
          <Help text={"Boosting systems increase network pressure or stabilize delivery."} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {[true, false].map(v => (
            <button
              key={String(v)}
              onClick={() => setState(s => ({ ...s, pressureBoosting: v }))}
              className={`px-4 py-2 rounded-lg border ${state.pressureBoosting === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
            >
              {v ? 'Yes' : 'No'}
            </button>
          ))}
        </div>
      </section>

      {/* Pipeline Questions (solids media only) */}
      {hasSolids && (
        <section className="space-y-3">
          <h2 className="font-medium">Pipeline Questions</h2>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm">Continuous Pump Operation?</span>
              {[true, false].map(v => (
                <button
                  key={'cont-' + String(v)}
                  onClick={() => setState(s => ({ ...s, pipelineContinuous: v }))}
                  className={`px-3 py-1.5 rounded-lg border ${state.pipelineContinuous === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
                >
                  {v ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm">Pipeline Profile Relatively Flat?</span>
              {[true, false].map(v => (
                <button
                  key={'flat-' + String(v)}
                  onClick={() => setState(s => ({ ...s, pipelineFlat: v }))}
                  className={`px-3 py-1.5 rounded-lg border ${state.pipelineFlat === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
                >
                  {v ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-600">
              Guidance: Continuous or Flat → EUV visible. Low starts + Flat → ARAA may be applicable.
            </div>
        </section>
      )}

      {/* Replaces removed Q5: Key Design Inputs */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Key Design Inputs</h2>
          <Help text={"Basic sizing context to refine vessel selection and preliminary dimensions."} />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span>Design Pressure (bar)</span>
            <input
              type="number"
              min={0}
              step={0.1}
              value={state.designPressureBar ?? ''}
              onChange={e => setState(s => ({ ...s, designPressureBar: parseNum(e.target.value) }))}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-300 outline-none bg-white"
              placeholder="e.g. 10"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Approx. Pipeline Length (m)</span>
            <input
              type="number"
              min={0}
              step={1}
              value={state.pipelineLengthM ?? ''}
              onChange={e => setState(s => ({ ...s, pipelineLengthM: parseNum(e.target.value) }))}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-300 outline-none bg-white"
              placeholder="e.g. 1500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span>Notes (optional)</span>
            <input
              type="text"
              value={state.notes ?? ''}
              onChange={e => setState(s => ({ ...s, notes: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-300 outline-none bg-white"
              placeholder="Extra context"
            />
          </label>
        </div>
      </section>

      <div className="flex justify-between pt-2">
        <button onClick={() => nav('/application')} className="px-3 py-2 border rounded-lg">Back</button>
        <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Next</button>
      </div>
    </div>
  );
}