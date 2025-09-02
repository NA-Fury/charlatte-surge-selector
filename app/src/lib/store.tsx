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
  otherMediaNote?: string;

  // Project Info (Page 2)
  operationType?: 'Pumping' | 'Gravity';
  requireSurgeProtection?: boolean; // Q2
  surgeAnalysisDone?: 'Yes' | 'No' | 'Unsure'; // Q2 a-1
  pressureBoosting?: boolean; // Q3
  pipelineContinuous?: boolean; // Q4a
  pipelineFlat?: boolean; // Q4b
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
