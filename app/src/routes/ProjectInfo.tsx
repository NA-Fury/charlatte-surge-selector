import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Info, Droplet, Gauge, LineChart } from 'lucide-react';

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
    // If user requires surge protection and has analysis = Yes, send to Designer for sizing.
    if (state.requireSurgeProtection && state.surgeAnalysisDone === 'No') {
      // Guide to AQ10 and then contact page
      nav('/contact');
      return;
    }
    nav('/designer');
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
                // If gravity, default surge protection to false
                requireSurgeProtection: v === 'Gravity' ? false : true,
              }))}
              className={`px-4 py-2 rounded-lg border ${state.operationType === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
        {state.operationType === 'Pumping' && (
          <p className="text-sm text-emerald-700">Great! Please note that you will need surge protection.</p>
        )}
        {state.operationType === 'Gravity' && (
          <p className="text-sm text-slate-600">Great, please note that surge protection is not required.</p>
        )}
      </section>

      {/* Surge Protection */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Surge Vessel Protection</h2>
          <Help text={"Surge protection mitigates water hammer and pressure spikes in pipelines (e.g., pump starts/stops, long rising mains)."} />
        </div>
        <div className="flex gap-3 flex-wrap">
          {['Yes', 'No', 'Unsure'].map(v => (
            <button
              key={v}
              onClick={() => setState(s => ({
                ...s,
                requireSurgeProtection: v === 'Yes' ? true : v === 'No' ? false : undefined,
              }))}
              disabled={state.operationType === 'Gravity'}
              className={`px-4 py-2 rounded-lg border ${
                ((state.requireSurgeProtection === true && v === 'Yes') || (state.requireSurgeProtection === false && v === 'No') || (state.requireSurgeProtection === undefined && v === 'Unsure'))
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-blue-400'
              } disabled:opacity-50`}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* Surge Analysis */}
      {state.requireSurgeProtection && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">Has a Surge Analysis been completed?</h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {(['Yes', 'No', 'Unsure'] as const).map(v => (
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
              <p>Not a problem. Let’s see what we can do with the data you do have right now.</p>
              <p>
                <a href="/aq10" target="_blank" rel="noopener" className="text-blue-600 underline">Open AQ10 form</a> in a new tab, fill the details, and save. We’ll send your answers to our hydraulic department for a free surge study.
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
                    setState(s => ({ ...s, notes: (s.notes ? s.notes + '\n' : '') + `AQ10: ${data.projectName || ''} – ${data.notes || ''}` }));
                  } catch {
                    // ignore JSON parse errors
                  }
                }}
              >
                Import AQ10 answers
              </button>
              <span className="text-slate-500">(detected saved data)</span>
            </div>
          )}
        </section>
      )}

      {/* Pressure Boosting */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">Pressure Boosting?</h2>
          <Help text={"Pressure boosting increases delivery pressure for end-use or network stabilization."} />
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

      {/* Pipeline Questions (only for solids/wastewater/sewage) */}
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
            Guidance: Continuous or Flat → EUV visible. 1-2 starts/day + Flat → ARAA visible.
          </div>
        </section>
      )}

      {/* Q5 placeholder */}
      <section className="space-y-2">
        <h2 className="font-medium">Q5) Environmental Questions</h2>
        <p className="text-sm text-slate-500">TBD</p>
      </section>

      <div className="flex justify-between pt-2">
        <button onClick={() => nav('/application')} className="px-3 py-2 border rounded-lg">Back</button>
        <button onClick={handleNext} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Next</button>
      </div>
    </div>
  );
}
