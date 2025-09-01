import { Routes, Route, Navigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import Application from './routes/Application';
import Config from './routes/Config';
import Sizing from './routes/Sizing';
import Summary from './routes/Summary';
import Contact from './routes/Contact';
import EnhancedPage from './EnhancedPage';

export default function App() {
  const isEmbed = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('embed');

  return (
    <div className="min-h-screen bg-slate-50">
      {!isEmbed && (
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <div className="font-semibold">CHARLATTE RESERVOIRS — Surge Vessel Selector</div>
            <div className="text-sm text-slate-500">Demo v0.1</div>
          </div>
        </header>
      )}

      <main className="mx-auto max-w-6xl p-4 grid md:grid-cols-[240px_1fr] gap-6">
        {!isEmbed && <aside><Stepper /></aside>}
        <section className="bg-white rounded-2xl shadow p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/application" replace />} />
            <Route path="/application" element={<Application />} />
            <Route path="/config" element={<Config />} />
            <Route path="/sizing" element={<Sizing />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enhanced" element={<EnhancedPage />} />
            <Route path="*" element={<Navigate to="/application" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}
