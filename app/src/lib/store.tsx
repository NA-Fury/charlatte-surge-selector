/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react';

export type Media =
  | 'CleanWater' | 'Potable' | 'TSE' | 'NoSolids'
  | 'Sewage' | 'WasteWater' | 'Solids';
export type Tech = 'AirWater' | 'Hydrochoc' | 'EUV' | 'ARAA';
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
  name?: string; email?: string; company?: string; country?: string; notes?: string;
}

const Ctx = createContext<{
  state: FormState;
  setState: Dispatch<SetStateAction<FormState>>;
} | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FormState>({});
  return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Store missing Provider');
  return c;
};
