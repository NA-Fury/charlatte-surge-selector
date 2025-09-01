import { useLocation, Link } from 'react-router-dom';

const steps = [
  { to: '/application', label: 'Application' },
  { to: '/config', label: 'Configuration' },
  { to: '/sizing', label: 'Sizing' },
  { to: '/summary', label: 'Summary' },
  { to: '/contact', label: 'Contact' },
];

export default function Stepper() {
  const { pathname } = useLocation();
  return (
    <nav className="space-y-2">
      {steps.map((s, i) => {
        const active = pathname.startsWith(s.to);
        return (
          <Link
            key={s.to}
            to={s.to}
            className={`block px-3 py-2 rounded-lg border text-sm
            ${active ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
            {i + 1}. {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
