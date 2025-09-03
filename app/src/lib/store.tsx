/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

export type Media =
  | 'CleanWater' | 'Potable' | 'TSE' | 'NoSolids'
  | 'Sewage' | 'WasteWater' | 'Solids'
  | 'Other';

export type Tech =
  | 'Hydrochoc'
  | 'Hydrofort'
  | 'EUV'
  | 'ARAA'
  | 'Compressor';

export type Orientation = 'Horizontal' | 'Vertical';

export interface FormState {
  media?: Media;
  tech?: Tech;
  orientation?: Orientation;
  // Designer / sizing data
  capacityLitres?: number;
  diameterMm?: number;
  lengthMm?: number;
  // Project info logic fields
  operationType?: 'Pumping' | 'Gravity';
  requireSurgeProtection?: boolean;
  surgeAnalysisDone?: 'Yes' | 'No';
  pressureBoosting?: boolean;
  pipelineContinuous?: boolean;
  pipelineFlat?: boolean;
  designPressureBar?: number;
  pipelineLengthM?: number;
  notes?: string;
  code?: 'ASME' | 'EN' | 'CODAP' | 'AS1210' | 'PD5500';
  uStamp?: boolean;
  tpi?: boolean;
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  phone?: string;
  otherMediaNote?: string;
  // --- AQ10 (Surge / Transient Study Intake) ---
  enquiryRef?: string;          // auto-generated (locked)
  enquiryDateISO?: string;      // auto-generated (locked)
  inquiryType?: 'Study' | 'Estimation';
  fluidOtherSpec?: string;
  tmh?: number;                 // Total Manometric Head
  tmhZeroFlow?: number;
  surgeVesselElevationM?: number;
  flowMaxM3h?: number;
  flowMinM3h?: number;
  suctionMinElevM?: number;
  suctionMaxElevM?: number;
  pipelineIntDiamMm?: number;
  pipelineMaterial?: string;
  profileDescription?: string;  // combined description of profile rows or user note
  profileCumulativeDistance?: string;
  profileElevation?: string;
  profileAirValves?: string;
  endOfPipeDescription?: string;
  siteConditions?: string;
  speedRotationRpm?: number;
  momentInertiaKgM2?: number;
  pumpsInOperation?: number;
  checkedByName?: string;
  checkedByCompany?: string;
  checkedSignedAtISO?: string;
}

const Ctx = createContext<{
  state: FormState;
  setState: Dispatch<SetStateAction<FormState>>;
} | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormState>({});
  return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('Store missing Provider');
  return c;
}
