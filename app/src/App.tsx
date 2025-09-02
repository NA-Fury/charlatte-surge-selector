import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import Stepper from './components/Stepper';
import { lazy, Suspense } from 'react';

const Application = lazy(() => import('./routes/Application'));
const ProjectInfo = lazy(() => import('./routes/ProjectInfo'));
const Designer = lazy(() => import('./routes/Designer'));
const Config = lazy(() => import('./routes/Config'));
const Sizing = lazy(() => import('./routes/Sizing'));
const Summary = lazy(() => import('./routes/Summary'));
const Contact = lazy(() => import('./routes/Contact'));
const AQ10 = lazy(() => import('./routes/AQ10'));
import { useTranslation } from './lib/i18n';
import { useTheme } from './lib/theme';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 }
};

const pageTransition: Transition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

export default function App() {
  const isEmbed = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('embed');
  
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary
      }}
    >
      {!isEmbed && (
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="border-b sticky top-0 z-50 backdrop-blur-lg"
          style={{ 
            backgroundColor: theme.bgSecondary + 'ee',
            borderColor: theme.borderColor 
          }}
        >
          <div className="mx-auto max-w-6xl p-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <div 
                className="p-2 rounded-lg shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` 
                }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: theme.primary }}>
                  CHARLATTE RESERVOIRS
                </div>
                <div className="text-xs opacity-60">
                  {t('app.subtitle')}
                </div>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: theme.bgTertiary,
                  color: theme.textSecondary
                }}
              >
                {language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
              </motion.button>
              
              <div className="text-sm opacity-60">
                {t('app.version')} v1.0
              </div>
            </div>
          </div>
        </motion.header>
      )}

      <main className="mx-auto max-w-6xl p-4 grid md:grid-cols-[240px_1fr] gap-6">
        {!isEmbed && (
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Stepper />
          </motion.aside>
        )}
        
        <AnimatePresence mode="wait">
          <motion.section
            key={location.pathname}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="rounded-2xl shadow-xl p-6"
            style={{ 
              backgroundColor: theme.bgSecondary,
              boxShadow: theme.shadow
            }}
          >
            <Suspense fallback={<div>Loading…</div>}>
              <Routes>
                <Route path="/" element={<Navigate to="/application" replace />} />
                <Route path="/application" element={<Application />} />
                <Route path="/project" element={<ProjectInfo />} />
                <Route path="/designer" element={<Designer />} />
                {/* Legacy routes still available */}
                <Route path="/config" element={<Config />} />
                <Route path="/sizing" element={<Sizing />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/aq10" element={<AQ10 />} />
                <Route path="*" element={<Navigate to="/application" replace />} />
              </Routes>
            </Suspense>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}




