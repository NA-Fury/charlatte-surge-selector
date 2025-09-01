import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import { useMemo, useState, Suspense } from 'react';
import { capsuleVolumeLitres, litresToUsGallons } from '../lib/sizing';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeVessel from '../components/ThreeVessel';
import { useTranslation } from '../lib/i18n';
import { useTheme } from '../lib/theme';

export default function Sizing() {
  const { state, setState } = useStore();
  const nav = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [mode, setMode] = useState<'capacity' | 'dimensions'>('dimensions');
  const [diameterMm, setD] = useState(state.diameterMm ?? 1000);
  const [lengthMm, setL] = useState(state.lengthMm ?? 2500);
  const [capacityLitres, setCap] = useState(state.capacityLitres ?? 5000);
  const [show3D, setShow3D] = useState(true);

  const computedL = useMemo(() => {
    const straight = Math.max(0, lengthMm - diameterMm);
    return capsuleVolumeLitres(diameterMm, straight);
  }, [diameterMm, lengthMm]);

  const shownL = mode === 'dimensions' ? computedL : capacityLitres;
  const shownGal = litresToUsGallons(shownL);

  const handleNext = () => {
    setState(s => ({ 
      ...s, 
      diameterMm, 
      lengthMm, 
      capacityLitres: mode === 'dimensions' ? shownL : capacityLitres 
    }));
    nav('/summary');
  };

  // Get color based on technology
  const vesselColor = useMemo(() => {
    switch(state.tech) {
      case 'Hydrochoc': return '#0ea5e9';
      case 'EUV': return '#10b981';
      case 'ARAA': return '#8b5cf6';
      default: return '#3b82f6';
    }
  }, [state.tech]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {t('sizing.title')}
        </h1>
        <p className="mt-2 text-lg" style={{ color: theme.textSecondary }}>
          {t('sizing.subtitle')}
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('dimensions')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            mode === 'dimensions' 
              ? 'text-white shadow-lg' 
              : 'bg-white border-2'
          }`}
          style={{
            background: mode === 'dimensions' 
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              : theme.bgSecondary,
            borderColor: mode === 'dimensions' ? 'transparent' : theme.borderColor
          }}
        >
          📐 {t('sizing.dimensionsKnown')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('capacity')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            mode === 'capacity' 
              ? 'text-white shadow-lg' 
              : 'bg-white border-2'
          }`}
          style={{
            background: mode === 'capacity' 
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              : theme.bgSecondary,
            borderColor: mode === 'capacity' ? 'transparent' : theme.borderColor
          }}
        >
          💧 {t('sizing.capacityKnown')}
        </motion.button>
      </div>

      {/* 3D Visualization Toggle */}
      {mode === 'dimensions' && state.orientation && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show3d"
            checked={show3D}
            onChange={(e) => setShow3D(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="show3d" className="text-sm cursor-pointer">
            {t('sizing.show3D')}
          </label>
        </div>
      )}

      {/* 3D Vessel Visualization */}
      <AnimatePresence>
        {show3D && mode === 'dimensions' && state.orientation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={
              <div className="h-96 flex items-center justify-center bg-slate-100 rounded-xl">
                <div className="text-slate-500">Loading 3D model...</div>
              </div>
            }>
              <ThreeVessel
                diameter={diameterMm}
                length={lengthMm}
                orientation={state.orientation}
                color={vesselColor}
                height={400}
              />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Controls */}
      {mode === 'dimensions' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t('sizing.diameter')} (mm)
            </label>
            <input
              type="number"
              value={diameterMm}
              onChange={(e) => setD(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgTertiary
              }}
              min="100"
              max="5000"
            />
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <input
                type="range"
                value={diameterMm}
                onChange={(e) => setD(Number(e.target.value))}
                className="w-full"
                min="100"
                max="5000"
                style={{
                  accentColor: theme.primary
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: theme.textSecondary }}>
                <span>100mm</span>
                <span>{diameterMm}mm</span>
                <span>5000mm</span>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium mb-2">
              {t('sizing.length')} (mm)
            </label>
            <input
              type="number"
              value={lengthMm}
              onChange={(e) => setL(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2"
              style={{
                borderColor: theme.borderColor,
                backgroundColor: theme.bgTertiary
              }}
              min="500"
              max="10000"
            />
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="range"
                value={lengthMm}
                onChange={(e) => setL(Number(e.target.value))}
                className="w-full"
                min="500"
                max="10000"
                style={{
                  accentColor: theme.primary
                }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: theme.textSecondary }}>
                <span>500mm</span>
                <span>{lengthMm}mm</span>
                <span>10000mm</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          className="max-w-md"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <label className="block text-sm font-medium mb-2">
            {t('sizing.capacity')} (litres)
          </label>
          <input
            type="number"
            value={capacityLitres}
            onChange={(e) => setCap(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 rounded-xl transition-all focus:ring-2"
            style={{
              borderColor: theme.borderColor,
              backgroundColor: theme.bgTertiary
            }}
            min="100"
            max="120000"
          />
          <p className="mt-2 text-sm" style={{ color: theme.textSecondary }}>
            {t('sizing.autoCalculate')}
          </p>
        </motion.div>
      )}

      {/* Volume Display Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div 
          className="p-4 rounded-xl shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}22)`,
            borderLeft: `4px solid ${theme.primary}`
          }}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {t('sizing.volumeLitres')}
          </p>
          <p className="text-2xl font-bold" style={{ color: theme.primary }}>
            {mode === 'dimensions' ? computedL.toFixed(0) : capacityLitres} L
          </p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-xl shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.success}22, ${theme.success}44)`,
            borderLeft: `4px solid ${theme.success}`
          }}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {t('sizing.volumeGallons')}
          </p>
          <p className="text-2xl font-bold" style={{ color: theme.success }}>
            {mode === 'dimensions' ? shownGal.toFixed(0) : litresToUsGallons(capacityLitres).toFixed(0)} gal
          </p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-xl shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.warning}22, ${theme.warning}44)`,
            borderLeft: `4px solid ${theme.warning}`
          }}
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            {t('sizing.configuration')}
          </p>
          <p className="text-2xl font-bold" style={{ color: theme.warning }}>
            {state.orientation || 'Not set'}
          </p>
        </motion.div>
      </div>

      {/* Surge Analysis CTA */}
      <motion.div 
        className="p-6 rounded-xl border-2"
        style={{
          borderColor: theme.warning,
          background: `${theme.warning}11`
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: theme.warning }}>
          📋 {t('sizing.surgeAnalysisTitle')}
        </h3>
        <p className="text-sm mb-4" style={{ color: theme.textSecondary }}>
          {t('sizing.surgeAnalysisDesc')}
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-white rounded-lg shadow-lg"
          style={{ backgroundColor: theme.warning }}
        >
          {t('sizing.downloadForm')}
        </motion.button>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => nav('/config')}
          className="px-6 py-3 border-2 rounded-lg font-medium"
          style={{
            borderColor: theme.borderColor,
            color: theme.textPrimary
          }}
        >
          {t('navigation.back')}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="px-8 py-3 text-white rounded-lg font-medium shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
          }}
        >
          {t('navigation.next')} →
        </motion.button>
      </div>
    </motion.div>
  );
}