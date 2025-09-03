import { useNavigate } from 'react-router-dom';
import { useStore, type Media } from '../lib/store';
import { Droplet, ShieldCheck, Recycle, AlertTriangle, Soup, Waves, MoreHorizontal } from 'lucide-react';

const GROUPS: { title: string; items: { key: Media; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
	{
		title: 'Potable & Clean Water',
		items: [
			{ key: 'CleanWater', label: 'Clean Water', icon: Droplet },
			{ key: 'Potable', label: 'Potable Water', icon: ShieldCheck },
			{ key: 'TSE', label: 'Treated Sewage Effluent', icon: Recycle },
		],
	},
	{
		title: 'Other Applications',
		items: [
			{ key: 'NoSolids', label: 'Media Without Solids', icon: Waves },
			{ key: 'WasteWater', label: 'Waste Water', icon: Soup },
			{ key: 'Sewage', label: 'Sewage', icon: Recycle },
			{ key: 'Solids', label: 'Media with Solids', icon: AlertTriangle },
		],
	},
];

export default function Application() {
	const { state, setState } = useStore();
	const nav = useNavigate();

	const handleSelect = (m: Media) => {
		setState(s => ({
			...s,
			media: m,
			// When switching media, clear dependent tech logic if solids group
			...(m === 'Sewage' || m === 'WasteWater' || m === 'Solids'
				? {
						pipelineContinuous: undefined,
						pipelineFlat: undefined,
						tech: undefined,
						orientation: undefined,
				  }
				: {})
		}));
		if (m === 'Other') {
			nav('/contact');
		} else {
			nav('/project'); // auto-advance to ProjectInfo
		}
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-semibold">Media / Application</h1>
			<p className="text-slate-600">What application or media are you using?</p>

			{GROUPS.map(group => (
				<div key={group.title} className="space-y-2">
					<div className="flex items-center gap-3 mt-2">
						<div className="h-px flex-1 bg-slate-200" />
						<div className="text-xs uppercase tracking-wide text-slate-500">{group.title}</div>
						<div className="h-px flex-1 bg-slate-200" />
					</div>
					<div className="grid md:grid-cols-2 gap-3">
						{group.items.map(m => {
							const Icon = m.icon;
							return (
								<button
									key={m.key}
									onClick={() => handleSelect(m.key)}
									className={`border rounded-xl p-4 text-left hover:shadow transition flex items-center gap-3
                  ${state.media === m.key ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
									<Icon className="w-5 h-5 text-blue-600" />
									<span>{m.label}</span>
								</button>
							);
						})}
					</div>
				</div>
			))}

			<div className="space-y-2">
				<div className="flex items-center gap-3 mt-2">
					<div className="h-px flex-1 bg-slate-200" />
					<div className="text-xs uppercase tracking-wide text-slate-500">Other</div>
					<div className="h-px flex-1 bg-slate-200" />
				</div>
				<div>
					<button
						onClick={() => handleSelect('Other')}
						className={`border rounded-xl p-4 text-left hover:shadow transition inline-flex items-center gap-3
            ${state.media === 'Other' ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'}`}>
						<MoreHorizontal className="w-5 h-5 text-slate-500" /> Other
					</button>
				</div>
			</div>
		</div>
	);
}
