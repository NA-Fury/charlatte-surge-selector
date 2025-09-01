import React, { createContext, useContext, useState } from 'react';

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
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  phone?: string; // added
  notes?: string;
}

const Ctx = createContext<{ 
  state: FormState; 
  setState: React.Dispatch<React.SetStateAction<FormState>> 
} | null>(null);

export const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>({});
  return <Ctx.Provider value={{ state, setState }}>{children}</Ctx.Provider>;
};

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('Store missing Provider');
  return c;
};