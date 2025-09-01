import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { ChevronRight, Info, CheckCircle, Settings, FileText, Droplets, Shield, Gauge, Zap, Wind, Package, Activity, ArrowRight, RotateCw, ZoomIn, ZoomOut, Move3d } from 'lucide-react';

// Types
type Media = 'CleanWater' | 'Potable' | 'TSE' | 'NoSolids' | 'Sewage' | 'WasteWater' | 'Solids';
type Tech = 'AirWater' | 'Hydrochoc' | 'Hydrofort' | 'EUV' | 'ARAA' | 'Compressor';
type Orientation = 'Horizontal' | 'Vertical';

interface FormState {
  media?: Media;
  tech?: Tech;
  orientation?: Orientation;
  capacityLitres?: number;
  diameterMm?: number;
  lengthMm?: number;
  code?: 'ASME' | 'EN' | 'CODAP' | 'AS1210' | 'PD5500';
  uStamp?: boolean;
  tpi?: boolean;
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  phone?: string;
  notes?: string;
}

// Store Context
const StoreContext = createContext<{
  state: FormState;
  setState: React.Dispatch<React.SetStateAction<FormState>>;
} | null>(null);

const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('Store missing Provider');
  return context;
};

// Product Information
const PRODUCTS = {
  Hydrochoc: {
    name: 'HYDROCHOC',
    tagline: 'Bladder tank line for drinking water applications',
    features: [
      'Surge protection',
      'Water in bladder design',
      'Horizontal up to 120,000 liters',
      'Vertical up to 60,000 liters'
    ],
    icon: Shield,
    color: 'from-blue-500 to-cyan-600'
  },
  Hydrofort: {
    name: 'HYDROFORT',
    tagline: 'Bladder tank for drinking or plant water',
    features: [
      'Pump cycle control/water storage',
      'Water in bladder design',
      'Horizontal up to 120,000 liters',
      'Vertical up to 60,000 liters'
    ],
    icon: Droplets,
    color: 'from-cyan-500 to-blue-600'
  },
  EUV: {
    name: 'EUV',
    tagline: 'Bladder tank for wastewater and raw water',
    features: [
      'For surge protection',
      'Heavy sedimentation applications',
      'Air in bladder design',
      'Vertical only, up to 60,000 liters'
    ],
    icon: Wind,
    color: 'from-emerald-500 to-teal-600'
  },
  ARAA: {
    name: 'ARAA',
    tagline: 'Dipping tube style tank',
    features: [
      'For surge protection',
      'Design with no bladder',
      'Low pressure with zero static head',
      'Vertical only, up to 80,000 liters'
    ],
    icon: Activity,
    color: 'from-purple-500 to-indigo-600'
  },
  Compressor: {
    name: 'COMPRESSOR',
    tagline: 'Complete surge protection package',
    features: [
      'Surge protection & pump cycle control',
      'Complete package with control panel',
      'Vertical or horizontal configuration',
      'All water applications'
    ],
    icon: Zap,
    color: 'from-orange-500 to-red-600'
  }
};

// 3D Vessel Visualization Component
const VesselVisualization: React.FC<{ 
  diameter: number; 
  length: number; 
  orientation: 'Horizontal' | 'Vertical';
  tech?: Tech;
}> = ({ diameter, length, orientation, tech }) => {
  const [rotation, setRotation] = useState({ x: -20, y: 45 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - rotation.y, y: e.clientY - rotation.x });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setRotation({
      x: e.clientY - dragStart.y,
      y: e.clientX - dragStart.x
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const scaledDiameter = Math.min(diameter / 10, 100);
  const scaledLength = Math.min(length / 20, 200);

  const productInfo = tech ? PRODUCTS[tech as keyof typeof PRODUCTS] : null;

  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-200 opacity-10"></div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setRotation({ x: -20, y: 45 })}
          className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Vessel */}
      <div 
        className="relative h-64 flex items-center justify-center cursor-move select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="preserve-3d transition-transform duration-300"
          style={{
            transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`
          }}
        >
          {/* Main Cylinder */}
          <div
            className={`relative ${productInfo ? `bg-gradient-to-r ${productInfo.color}` : 'bg-gradient-to-r from-blue-400 to-blue-600'} rounded-full shadow-2xl`}
            style={{
              width: orientation === 'Horizontal' ? `${scaledLength}px` : `${scaledDiameter}px`,
              height: orientation === 'Horizontal' ? `${scaledDiameter}px` : `${scaledLength}px`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 -10px 20px rgba(0,0,0,0.1)'
            }}
          >
            {/* End Caps */}
            <div
              className="absolute bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"
              style={{
                width: orientation === 'Horizontal' ? '20px' : `${scaledDiameter}px`,
                height: orientation === 'Horizontal' ? `${scaledDiameter}px` : '20px',
                left: orientation === 'Horizontal' ? '-10px' : '0',
                top: orientation === 'Horizontal' ? '0' : '-10px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            <div
              className="absolute bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"
              style={{
                width: orientation === 'Horizontal' ? '20px' : `${scaledDiameter}px`,
                height: orientation === 'Horizontal' ? `${scaledDiameter}px` : '20px',
                right: orientation === 'Horizontal' ? '-10px' : '0',
                bottom: orientation === 'Horizontal' ? '0' : '-10px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
            
            {/* Highlights */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="mt-6 flex justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Diameter:</span>
          <span className="font-semibold">{diameter} mm</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Length:</span>
          <span className="font-semibold">{length} mm</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Capacity:</span>
          <span className="font-semibold">{Math.round(calculateVolume(diameter, length))} L</span>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 text-xs text-slate-400 flex items-center gap-1">
        <Move3d className="w-3 h-3" />
        Drag to rotate • Use buttons to zoom
      </div>
    </div>
  );
};

// Utility Functions
const calculateVolume = (diameterMm: number, lengthMm: number): number => {
  const r = diameterMm / 2;
  const straight = Math.max(0, lengthMm - diameterMm);
  const cyl = Math.PI * r * r * straight;
  const sphere = (4 / 3) * Math.PI * Math.pow(r, 3);
  return (cyl + sphere) / 1_000_000;
};

const litresToUsGallons = (l: number): number => l / 3.785411784;

// Step Components (Application, Config, Sizing, Summary, Contact)
// -- ApplicationStep
const ApplicationStep: React.FC = () => {
  const { state, setState } = useStore();
  const [hoveredMedia, setHoveredMedia] = useState<Media | null>(null);

  const MEDIA_OPTIONS = [
    { key: 'CleanWater' as Media, label: 'Clean Water', icon: Droplets, desc: 'For municipal and industrial clean water systems' },
    { key: 'Potable' as Media, label: 'Potable Water', icon: Shield, desc: 'Drinking water compliant systems' },
    { key: 'TSE' as Media, label: 'Treated Sewage Effluent', icon: Activity, desc: 'Recycled water applications' },
    { key: 'NoSolids' as Media, label: 'Media Without Solids', icon: Wind, desc: 'Clear fluids without particulates' },
    { key: 'Sewage' as Media, label: 'Sewage', icon: Package, desc: 'Raw sewage and wastewater' },
    { key: 'WasteWater' as Media, label: 'Waste Water', icon: Gauge, desc: 'Industrial and municipal wastewater' },
    { key: 'Solids' as Media, label: 'Media with Solids', icon: Settings, desc: 'Fluids containing suspended solids' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Media / Application
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          What application or media will you be using this product for?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {MEDIA_OPTIONS.map((m, idx) => {
          const Icon = m.icon;
          const isSelected = state.media === m.key;
          const isHovered = hoveredMedia === m.key;

          return (
            <button
              key={m.key}
              onMouseEnter={() => setHoveredMedia(m.key)}
              onMouseLeave={() => setHoveredMedia(null)}
              onClick={() => setState(s => ({ ...s, media: m.key }))}
              className={`
                relative group border-2 rounded-2xl p-6 text-left transition-all duration-300
                ${isSelected 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-[1.02]' 
                  : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
                ${isHovered ? 'ring-2 ring-blue-300' : ''}
              `}
              style={{ animationDelay: `${idx * 50}ms`, animation: 'slideUp 0.5s ease-out forwards' }}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-xl transition-all duration-300
                  ${isSelected 
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }
                `}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {m.label}
                    {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{m.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {state.media && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl animate-slideUp">
          <p className="text-sm text-blue-700">
            <Info className="inline w-4 h-4 mr-1" />
            {state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids'
              ? 'For media with solids, specialized EUV bladder technology will be recommended.'
              : 'Multiple technology options are available for clean media applications.'}
          </p>
        </div>
      )}
    </div>
  );
};

// -- ConfigStep
const ConfigStep: React.FC = () => {
  const { state, setState } = useStore();
  const [dutyARAA, setDutyARAA] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<Tech | null>(null);

  const hasSolids = state.media === 'Sewage' || state.media === 'WasteWater' || state.media === 'Solids';

  const availableTechs = useMemo(() => {
    if (hasSolids) return ['EUV' as Tech];
    if (dutyARAA) return ['ARAA' as Tech];
    return ['AirWater', 'Hydrochoc', 'Hydrofort', 'Compressor'] as Tech[];
  }, [hasSolids, dutyARAA]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Configuration
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Select the technology and orientation for your application
        </p>
      </div>

      {/* Special Requirements */}
      {!hasSolids && (
        <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={dutyARAA}
              onChange={e => {
                setDutyARAA(e.target.checked);
                if (e.target.checked) {
                  setState(s => ({ ...s, tech: 'ARAA', orientation: 'Vertical' }));
                }
              }}
              className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <div>
              <p className="font-medium">Special Requirements</p>
              <p className="text-sm text-slate-600 mt-1">
                Minimum 1-2 pump start/stops per day with relatively flat pipeline?
                <br />
                <span className="text-xs italic">(No power/electricity implied)</span>
              </p>
              {dutyARAA && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-sm font-medium text-purple-700">
                    ✓ ARAA Technology Selected - Vertical configuration only
                  </p>
                </div>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Technology Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select Technology</h2>
        <div className="grid gap-4">
          {availableTechs.map((tech) => {
            const product = PRODUCTS[tech as keyof typeof PRODUCTS];
            if (!product) return null;
            
            const Icon = product.icon;
            const isSelected = state.tech === tech;
            const isExpanded = expandedProduct === tech;

            return (
              <div
                key={tech}
                className={`
                  border-2 rounded-2xl transition-all duration-300
                  ${isSelected 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <button
                  onClick={() => {
                    setState(s => ({ ...s, tech: tech as Tech }));
                    setExpandedProduct(isExpanded ? null : tech as Tech);
                  }}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${product.color} text-white shadow-lg`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{product.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isSelected && <CheckCircle className="w-6 h-6 text-blue-500" />}
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 animate-slideDown">
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-semibold mb-3 text-slate-700">Key Features:</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Orientation Selection */}
      {state.tech && (
        <div className="space-y-4 animate-slideUp">
          <h2 className="text-xl font-semibold">Select Orientation</h2>
          <div className="grid grid-cols-2 gap-4">
            {(['Horizontal','Vertical'] as Orientation[]).map((orientation) => {
              const onlyVertical = state.tech === 'EUV' || state.tech === 'ARAA';
              if (onlyVertical && orientation === 'Horizontal') return null;

              const isSelected = state.orientation === orientation;
              return (
                <button
                  key={orientation}
                  onClick={() => setState(s => ({ ...s, orientation }))}
                  className={`
                    relative p-6 rounded-xl border-2 transition-all duration-300
                    ${isSelected 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg' 
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className={`
                      ${orientation === 'Horizontal' ? 'w-20 h-10' : 'w-10 h-20'}
                      bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg
                    `} />
                    <span className="font-semibold">{orientation}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// -- SizingStep (kept as in your version; uses visualization)
const SizingStep: React.FC = () => {
  const { state, setState } = useStore();
  const [mode, setMode] = useState<'capacity' | 'dimensions'>('dimensions');
  const [diameter, setDiameter] = useState(state.diameterMm || 1000);
  const [length, setLength] = useState(state.lengthMm || 2500);
  const [capacity, setCapacity] = useState(state.capacityLitres || 5000);

  const computedVolume = useMemo(() => calculateVolume(diameter, length), [diameter, length]);
  const gallons = useMemo(() => litresToUsGallons(computedVolume), [computedVolume]);

  useEffect(() => {
    if (mode === 'dimensions') {
      setState(s => ({ ...s, diameterMm: diameter, lengthMm: length, capacityLitres: computedVolume }));
    } else {
      setState(s => ({ ...s, capacityLitres: capacity }));
    }
  }, [diameter, length, capacity, mode, computedVolume, setState]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Vessel Sizing
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Configure the dimensions or capacity of your surge vessel
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-3">
        <button
          onClick={() => setMode('dimensions')}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${mode === 'dimensions' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
              : 'bg-white border-2 border-slate-200 hover:border-blue-300'
            }
          `}
        >
          <Settings className="inline w-4 h-4 mr-2" />
          Dimensions Known
        </button>
        <button
          onClick={() => setMode('capacity')}
          className={`
            px-6 py-3 rounded-xl font-medium transition-all duration-300
            ${mode === 'capacity' 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
              : 'bg-white border-2 border-slate-200 hover:border-blue-300'
            }
          `}
        >
          <Package className="inline w-4 h-4 mr-2" />
          Capacity Known
        </button>
      </div>

      {/* 3D Visualization */}
      {mode === 'dimensions' && state.orientation && (
        <VesselVisualization
          diameter={diameter}
          length={length}
          orientation={state.orientation}
          tech={state.tech}
        />
      )}

      {/* Input Controls */}
      {mode === 'dimensions' ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Diameter (mm)
            </label>
            <input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              min={100}
              max={5000}
            />
            <input
              type="range"
              value={diameter}
              onChange={(e) => setDiameter(Number(e.target.value))}
              className="w-full mt-2"
              min={100}
              max={5000}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Overall Length (mm)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              min={500}
              max={10000}
            />
            <input
              type="range"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full mt-2"
              min={500}
              max={10000}
            />
          </div>
        </div>
      ) : (
        <div className="max-w-md">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Capacity (litres)
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            min={100}
            max={120000}
          />
          <p className="mt-2 text-sm text-slate-500">
            Dimensions will be automatically calculated based on technology and orientation
          </p>
        </div>
      )}

      {/* Volume Display */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <p className="text-sm text-slate-600">Volume (Litres)</p>
          <p className="text-2xl font-bold text-blue-600">
            {mode === 'dimensions' ? computedVolume.toFixed(0) : capacity} L
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-sm text-slate-600">Volume (US Gallons)</p>
          <p className="text-2xl font-bold text-green-600">
            {mode === 'dimensions' ? gallons.toFixed(0) : litresToUsGallons(capacity).toFixed(0)} gal
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
          <p className="text-sm text-slate-600">Configuration</p>
          <p className="text-2xl font-bold text-purple-600">
            {state.orientation || 'Not set'}
          </p>
        </div>
      </div>

      {/* Surge Analysis Form */}
      <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Professional Surge Analysis Required
        </h3>
        <p className="text-sm text-amber-800 mb-4">
          For accurate sizing and final quotation, a complete surge analysis is required.
        </p>
        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          Download AQ120 Form
        </button>
      </div>
    </div>
  );
};

// -- SummaryStep
const SummaryStep: React.FC = () => {
  const { state } = useStore();
  const volume = state.capacityLitres || calculateVolume(state.diameterMm || 1000, state.lengthMm || 2500);
  const productInfo = state.tech ? PRODUCTS[state.tech as keyof typeof PRODUCTS] : null;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Professional Summary
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Review your surge vessel configuration
        </p>
      </div>

      {productInfo && (
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${productInfo.color} text-white shadow-xl`}>
          <div className="flex items-center gap-4 mb-4">
            <productInfo.icon className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">{productInfo.name}</h2>
              <p className="opacity-90">{productInfo.tagline}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Configuration</h3>
          <div className="space-y-3">
            {[
              { label: 'Media', value: state.media },
              { label: 'Technology', value: state.tech },
              { label: 'Orientation', value: state.orientation },
            ].map(item => (
              <div key={item.label} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">{item.label}:</span>
                <span className="font-medium">{item.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Dimensions</h3>
          <div className="space-y-3">
            {[
              { label: 'Capacity', value: `${Math.round(volume)} L` },
              { label: 'US Gallons', value: `${Math.round(litresToUsGallons(volume))} gal` },
              { label: 'Diameter', value: state.diameterMm ? `${state.diameterMm} mm` : '—' },
              { label: 'Length', value: state.lengthMm ? `${state.lengthMm} mm` : '—' },
            ].map(item => (
              <div key={item.label} className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-slate-600">{item.label}:</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// -- ContactStep (typed)
type Code = 'ASME' | 'EN' | 'CODAP' | 'AS1210' | 'PD5500';
interface ContactForm {
  name: string; email: string; phone: string; company: string; country: string; notes: string;
  code: Code; uStamp: boolean; tpi: boolean;
}
const contactFields = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'company', label: 'Company / Organization' },
  { key: 'country', label: 'Country / Region' },
] as const;
type ContactKey = typeof contactFields[number]['key'];

const ContactStep: React.FC = () => {
  const { state, setState } = useStore();
  const [form, setForm] = useState<ContactForm>({
    name: state.name || '',
    email: state.email || '',
    phone: state.phone || '',
    company: state.company || '',
    country: state.country || '',
    notes: state.notes || '',
    code: state.code || 'ASME',
    uStamp: state.uStamp || false,
    tpi: state.tpi || false
  });

  function setContact<K extends ContactKey>(k: K, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const handleSubmit = () => {
    setState(s => ({ ...s, ...form }));
    alert('Thank you! Your inquiry has been submitted. Our hydraulic department will review your requirements and contact you within 24-48 hours.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          Contact & Quote Request
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Complete your information to receive a detailed quote
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {contactFields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
            <input
              value={form[field.key]}
              onChange={(e) => setContact(field.key, e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Manufacturing Standards</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Manufacturing Code
            </label>
            <select
              value={form.code}
              onChange={(e) => setForm(f => ({ ...f, code: e.target.value as Code }))}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            >
              <option value="ASME">ASME BPVC Sec VIII</option>
              <option value="EN">EN 13445</option>
              <option value="CODAP">CODAP (France)</option>
              <option value="AS1210">AS 1210 (Australia)</option>
              <option value="PD5500">PD 5500 (UK)</option>
            </select>
          </div>
          
          {form.code === 'ASME' && (
            <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={form.uStamp}
                onChange={(e) => setForm(f => ({ ...f, uStamp: e.target.checked }))}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium">ASME U-Stamp Required?</span>
            </label>
          )}
          
          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={form.tpi}
              onChange={(e) => setForm(f => ({ ...f, tpi: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Third-Party Inspector (TPI)?</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
      >
        Submit Quote Request
        <ArrowRight className="inline ml-2 w-5 h-5" />
      </button>
    </div>
  );
};

// Main Demo App (single-page wizard)
export default function App() {
  const [state, setState] = useState<FormState>({});
  const [currentStep, setCurrentStep] = useState(0);
  
  const isEmbed = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).has('embed');

  const steps = [
    { id: 'application', label: 'Application', component: ApplicationStep },
    { id: 'config', label: 'Configuration', component: ConfigStep },
    { id: 'sizing', label: 'Sizing', component: SizingStep },
    { id: 'summary', label: 'Summary', component: SummaryStep },
    { id: 'contact', label: 'Contact', component: ContactStep },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return Boolean(state.media);
      case 1: return Boolean(state.tech && state.orientation);
      case 2: return Boolean(state.capacityLitres || (state.diameterMm && state.lengthMm));
      default: return true;
    }
  };

  return (
    <StoreContext.Provider value={{ state, setState }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Header */}
        {!isEmbed && (
          <header className="relative bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    CHARLATTE RESERVOIRS
                  </div>
                  <div className="text-xs text-slate-500">Surge Vessel Selector</div>
                </div>
              </div>
              <div className="text-sm text-slate-500">Professional Edition v1.0</div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="relative mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-[280px_1fr] gap-8">
          {/* Stepper Sidebar */}
          {!isEmbed && (
            <aside className="space-y-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4 text-slate-700">Configuration Steps</h3>
                <ol className="space-y-3">
                  {steps.map((step, idx) => {
                    const isActive = idx === currentStep;
                    const isComplete = idx < currentStep;
                    
                    return (
                      <li key={step.id} className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg scale-110' 
                            : isComplete
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                          }
                        `}>
                          {isComplete ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </div>
                        <button
                          onClick={() => idx <= currentStep && setCurrentStep(idx)}
                          disabled={idx > currentStep}
                          className={`
                            text-left transition-colors
                            ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-600'}
                            ${idx <= currentStep ? 'hover:text-blue-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
                          `}
                        >
                          {step.label}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </aside>
          )}

          {/* Step Content */}
          <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
            <CurrentStepComponent />
            
            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all duration-300
                  ${currentStep === 0 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-white border-2 border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                Previous
              </button>
              
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={!canProceed()}
                className={`
                  px-8 py-3 rounded-xl font-medium transition-all duration-300
                  ${canProceed() 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                <ChevronRight className="inline ml-2 w-5 h-5" />
              </button>
            </div>
          </section>
        </main>
      </div>

      <style>{`
        @keyframes blob { 0% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-50px) scale(1.1); } 66% { transform: translate(-20px,20px) scale(0.9); } 100% { transform: translate(0,0) scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; height: 0; } to { opacity: 1; height: auto; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .preserve-3d { transform-style: preserve-3d; }
      `}</style>
    </StoreContext.Provider>
  );
}
