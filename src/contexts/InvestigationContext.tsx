import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Investigation, Deviation, RootCauseAnalysis, CAPA, AuditTrailEntry } from '../types/investigation';

interface InvestigationState {
  investigations: Investigation[];
  currentInvestigation: Investigation | null;
  currentDeviation: Deviation | null;
  currentRCA: RootCauseAnalysis | null;
  currentCAPA: CAPA | null;
  auditTrail: AuditTrailEntry[];
  loading: boolean;
  error: string | null;
}

type InvestigationAction = 
  | { type: 'SET_INVESTIGATIONS'; payload: Investigation[] }
  | { type: 'SET_CURRENT_INVESTIGATION'; payload: Investigation | null }
  | { type: 'SET_CURRENT_DEVIATION'; payload: Deviation | null }
  | { type: 'SET_CURRENT_RCA'; payload: RootCauseAnalysis | null }
  | { type: 'SET_CURRENT_CAPA'; payload: CAPA | null }
  | { type: 'SET_AUDIT_TRAIL'; payload: AuditTrailEntry[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_INVESTIGATION'; payload: Investigation }
  | { type: 'ADD_AUDIT_ENTRY'; payload: AuditTrailEntry };

const initialState: InvestigationState = {
  investigations: [],
  currentInvestigation: null,
  currentDeviation: null,
  currentRCA: null,
  currentCAPA: null,
  auditTrail: [],
  loading: false,
  error: null,
};

function investigationReducer(state: InvestigationState, action: InvestigationAction): InvestigationState {
  switch (action.type) {
    case 'SET_INVESTIGATIONS':
      return { ...state, investigations: action.payload };
    case 'SET_CURRENT_INVESTIGATION':
      return { ...state, currentInvestigation: action.payload };
    case 'SET_CURRENT_DEVIATION':
      return { ...state, currentDeviation: action.payload };
    case 'SET_CURRENT_RCA':
      return { ...state, currentRCA: action.payload };
    case 'SET_CURRENT_CAPA':
      return { ...state, currentCAPA: action.payload };
    case 'SET_AUDIT_TRAIL':
      return { ...state, auditTrail: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_INVESTIGATION':
      return {
        ...state,
        investigations: state.investigations.map(inv => 
          inv.id === action.payload.id ? action.payload : inv
        ),
        currentInvestigation: state.currentInvestigation?.id === action.payload.id 
          ? action.payload 
          : state.currentInvestigation
      };
    case 'ADD_AUDIT_ENTRY':
      return {
        ...state,
        auditTrail: [action.payload, ...state.auditTrail]
      };
    default:
      return state;
  }
}

const InvestigationContext = createContext<{
  state: InvestigationState;
  dispatch: React.Dispatch<InvestigationAction>;
} | null>(null);

export function InvestigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(investigationReducer, initialState);

  return (
    <InvestigationContext.Provider value={{ state, dispatch }}>
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
}