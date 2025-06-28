export interface Investigation {
  id: string;
  deviationId: string;
  title: string;
  status: InvestigationStatus;
  priority: Priority;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  currentStep: string;
  completionPercentage: number;
}

export type InvestigationStatus = 
  | 'initiated' 
  | 'in-progress' 
  | 'rca-pending' 
  | 'capa-pending' 
  | 'approval-pending' 
  | 'completed' 
  | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Deviation {
  id: string;
  sampleId: string;
  testId: string;
  instrumentId: string;
  analystId: string;
  dateTime: string;
  deviationType: string;
  description: string;
  severity: Priority;
  attachments: Attachment[];
  relatedSOPs: string[];
}

export interface RootCauseAnalysis {
  id: string;
  investigationId: string;
  aiSuggestions: string[];
  manualAnalysis: string;
  checklist: ChecklistItem[];
  rootCause: string;
  contributingFactors: string[];
  evidenceFiles: Attachment[];
}

export interface ChecklistItem {
  id: string;
  question: string;
  response: boolean | null;
  comments: string;
  required: boolean;
}

export interface CAPA {
  id: string;
  investigationId: string;
  correctiveActions: Action[];
  preventiveActions: Action[];
  approvalFlow: ApprovalStep[];
  status: CAPAStatus;
  effectivenessValidation: EffectivenessValidation;
}

export interface Action {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: ActionStatus;
  priority: Priority;
  resources: string[];
}

export type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'verified';
export type CAPAStatus = 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'implemented';

export interface ApprovalStep {
  id: string;
  role: string;
  approver: string;
  status: ApprovalStatus;
  comments: string;
  timestamp: string;
  digitalSignature: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface EffectivenessValidation {
  id: string;
  validationCriteria: string[];
  results: ValidationResult[];
  conclusion: string;
  validatedBy: string;
  validationDate: string;
}

export interface ValidationResult {
  criterion: string;
  result: 'pass' | 'fail';
  evidence: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  filename: string;
  fileType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  action: string;
  module: string;
  recordId: string;
  changes: Record<string, any>;
  ipAddress: string;
}

export interface DecisionTreeNode {
  id: string;
  label: string;
  type: 'decision' | 'action' | 'end';
  position: { x: number; y: number };
  data: {
    question?: string;
    description: string;
    status: 'pending' | 'current' | 'completed';
    requirements?: string[];
  };
}

export interface DecisionTreeEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: 'yes' | 'no' | 'next';
}