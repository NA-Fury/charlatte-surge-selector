import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { Info } from 'lucide-react';

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

      {/* Q1 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Q1) Operation Type</h2>
        </div>
        <div className="flex gap-3 flex-wrap">
          {(['Pumping', 'Gravity'] as const).map(v => (
            <button
              key={v}
              onClick={() => setState(s => ({
                ...s,
                operationType: v,
                // If gravity, default surge protection to false
                requireSurgeProtection: v === 'Gravity' ? false : s.requireSurgeProtection,
              }))}
              className={`px-4 py-2 rounded-lg border ${state.operationType === v ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-400'}`}
            >
              {v}
            </button>
          ))}
        </div>
        {state.operationType === 'Gravity' && (
          <p className="text-sm text-slate-600">Gravity line selected — surge protection generally not required. Q2 is disabled.</p>
        )}
      </section>

      {/* Q2 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Q2) Surge Vessel Protection</h2>
          <Help text={"Surge protection helps mitigate water hammer and pressure spikes in pipelines (e.g., pump starts/stops, long rising mains)."} />
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

      {/* Q2 a-1 */}
      {state.requireSurgeProtection && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="font-medium">Q2 a-1) Has a Surge Analysis been done?</h2>
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
            <div className="text-sm text-slate-600">
              Not a problem. Please fill the AQ10 form, then proceed to Contact. We offer free surge analysis.
            </div>
          )}
        </section>
      )}

      {/* Q3 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">Q3) Pressure Boosting?</h2>
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

      {/* Q4 only for solids/wastewater/sewage */}
      {hasSolids && (
        <section className="space-y-3">
          <h2 className="font-medium">Q4) Pipeline Questions</h2>
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

