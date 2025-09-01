import { useNavigate } from 'react-router-dom';
import { useStore, type Media } from '../lib/store';

const MEDIA: { key: Media; label: string }[] = [
  { key: 'CleanWater', label: 'Clean Water' },
  { key: 'Potable', label: 'Potable Water' },
  { key: 'TSE', label: 'Treated Sewage Effluent' },
  { key: 'NoSolids', label: 'Media Without Solids' },
  { key: 'Sewage', label: 'Sewage' },
  { key: 'WasteWater', label: 'Waste Water' },
  { key: 'Solids', label: 'Media with Solids' },
];

export default function Application() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Media / Application</h1>
      <p className="text-slate-600">What application or media are you using this product for?</p>
      <div className="grid md:grid-cols-2 gap-3">
        {MEDIA.map(m => (
          <button 
            key={m.key}
            onClick={() => setState(s => ({ ...s, media: m.key }))}
            className={`border rounded-xl p-4 text-left hover:shadow transition
            ${state.media === m.key ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <button 
          disabled={!state.media} 
          onClick={() => nav('/config')}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  );
}
