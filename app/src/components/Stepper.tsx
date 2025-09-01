import { Link, useLocation } from 'react-router-dom';

const labels = ['Application', 'Configuration', 'Sizing', 'Summary', 'Contact'];
const paths  = ['/application','/config','/sizing','/summary','/contact'];

export default function Stepper() {
  const { pathname } = useLocation();
  const i = Math.max(0, paths.indexOf(pathname));
  return (
    <ol className="space-y-3">
      {labels.map((label, idx) => {
        const active = idx <= i;
        return (
          <li className="flex items-center gap-3" key={label}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border text-sm
              ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-300'}`}>
              {idx + 1}
            </span>
            <Link to={paths[idx]} className={`text-sm hover:underline ${active ? 'text-blue-700' : 'text-slate-500'}`}>
              {label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
