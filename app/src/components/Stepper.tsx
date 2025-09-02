import { useLocation, Link } from 'react-router-dom';

const steps = [
  { to: '/application', label: 'Application' },
  { to: '/project', label: 'Project Information' },
  { to: '/designer', label: 'Design (Selector + Sizing)' },
  { to: '/summary', label: 'Summary' },
  { to: '/contact', label: 'Contact' },
];

export default function Stepper() {
  const { pathname } = useLocation();
  return (
    <nav className="space-y-2" aria-label="Progress">
      {steps.map((s, i) => {
        const active = pathname.startsWith(s.to);
        return (
          <Link
            key={s.to}
            to={s.to}
            aria-current={active ? 'page' : undefined}
            data-testid={`step-${i + 1}`}
            className={`block px-3 py-2 rounded-lg border text-sm transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60
            ${active ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
            {i + 1}. {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
