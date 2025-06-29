import React, { useState } from 'react';
import { Download, Eye, Edit, Clock, AlertTriangle, CheckCircle, Grid3X3, BarChart3, Table, Kanban } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { AdvancedFilters } from './AdvancedFilters';
import { InvestigationTableView } from './InvestigationTableView';
import { InvestigationKanbanView } from './InvestigationKanbanView';
import { InvestigationAnalyticsView } from './InvestigationAnalyticsView';
import { Investigation, Priority, InvestigationStatus } from '../../types/investigation';

interface ActiveInvestigationsProps {
  onInvestigationClick?: (id: string) => void;
}

const mockInvestigations: Investigation[] = [
  {
    id: 'INV-2024-001',
    deviationId: 'DEV-2024-001',
    title: 'Out of Specification - Sample SM-2024-001',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'John Doe',
    createdBy: 'Jane Smith',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    dueDate: '2024-01-25T23:59:59Z',
    currentStep: 'Root Cause Analysis',
    completionPercentage: 45
  },
  {
    id: 'INV-2024-002',
    deviationId: 'DEV-2024-002',
    title: 'Equipment Failure - HPLC-001',
    status: 'capa-pending',
    priority: 'critical',
    assignedTo: 'Mike Johnson',
    createdBy: 'Sarah Wilson',
    createdAt: '2024-01-14T08:15:00Z',
    updatedAt: '2024-01-16T16:45:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    currentStep: 'CAPA Implementation',
    completionPercentage: 75
  },
  {
    id: 'INV-2024-003',
    deviationId: 'DEV-2024-003',
    title: 'Temperature Deviation - Cold Storage',
    status: 'approval-pending',
    priority: 'medium',
    assignedTo: 'Emily Davis',
    createdBy: 'Robert Brown',
    createdAt: '2024-01-13T16:20:00Z',
    updatedAt: '2024-01-16T11:30:00Z',
    dueDate: '2024-01-22T23:59:59Z',
    currentStep: 'Final Approval',
    completionPercentage: 90
  },
  {
    id: 'INV-2024-004',
    deviationId: 'DEV-2024-004',
    title: 'Contamination Event - Clean Room B',
    status: 'initiated',
    priority: 'high',
    assignedTo: 'Alex Thompson',
    createdBy: 'Lisa Garcia',
    createdAt: '2024-01-16T09:45:00Z',
    updatedAt: '2024-01-16T09:45:00Z',
    dueDate: '2024-01-26T23:59:59Z',
    currentStep: 'Initial Assessment',
    completionPercentage: 15
  },
  {
    id: 'INV-2024-005',
    deviationId: 'DEV-2024-005',
    title: 'Procedural Deviation - SOP-QC-001',
    status: 'completed',
    priority: 'low',
    assignedTo: 'David Lee',
    createdBy: 'Maria Rodriguez',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-15T17:20:00Z',
    dueDate: '2024-01-20T23:59:59Z',
    currentStep: 'Closed',
    completionPercentage: 100
  },
  {
    id: 'INV-2024-006',
    deviationId: 'DEV-2024-006',
    title: 'Analytical Method Deviation - UV Spectroscopy',
    status: 'rca-pending',
    priority: 'medium',
    assignedTo: 'Sarah Wilson',
    createdBy: 'John Doe',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-16T13:30:00Z',
    dueDate: '2024-01-24T23:59:59Z',
    currentStep: 'Root Cause Analysis',
    completionPercentage: 60
  },
  {
    id: 'INV-2024-007',
    deviationId: 'DEV-2024-007',
    title: 'Stability Study Deviation - Product X',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Robert Brown',
    createdBy: 'Emily Davis',
    createdAt: '2024-01-11T14:45:00Z',
    updatedAt: '2024-01-16T10:20:00Z',
    dueDate: '2024-01-23T23:59:59Z',
    currentStep: 'Data Analysis',
    completionPercentage: 35
  },
  {
    id: 'INV-2024-008',
    deviationId: 'DEV-2024-008',
    title: 'Microbiological Contamination - Batch 2024-A',
    status: 'initiated',
    priority: 'critical',
    assignedTo: 'Lisa Garcia',
    createdBy: 'Alex Thompson',
    createdAt: '2024-01-16T15:30:00Z',
    updatedAt: '2024-01-16T15:30:00Z',
    dueDate: '2024-01-19T23:59:59Z',
    currentStep: 'Initial Assessment',
    completionPercentage: 5
  },
  {
    id: 'INV-2024-009',
    deviationId: 'DEV-2024-009',
    title: 'Packaging Line Malfunction - Line 3',
    status: 'capa-pending',
    priority: 'medium',
    assignedTo: 'David Lee',
    createdBy: 'Maria Rodriguez',
    createdAt: '2024-01-09T09:20:00Z',
    updatedAt: '2024-01-16T12:15:00Z',
    dueDate: '2024-01-21T23:59:59Z',
    currentStep: 'CAPA Development',
    completionPercentage: 80
  },
  {
    id: 'INV-2024-010',
    deviationId: 'DEV-2024-010',
    title: 'Environmental Monitoring Excursion - Room 205',
    status: 'approval-pending',
    priority: 'low',
    assignedTo: 'Mike Johnson',
    createdBy: 'Sarah Wilson',
    createdAt: '2024-01-08T13:10:00Z',
    updatedAt: '2024-01-16T16:00:00Z',
    dueDate: '2024-01-18T23:59:59Z',
    currentStep: 'Management Review',
    completionPercentage: 95
  }
];

export function ActiveInvestigations({ onInvestigationClick }: ActiveInvestigationsProps) {
  const [currentView, setCurrentView] = useState<'table' | 'kanban' | 'analytics'>('table');
  const [selectedInvestigations, setSelectedInvestigations] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [investigations, setInvestigations] = useState<Investigation[]>(mockInvestigations);

  const handleInvestigationUpdate = (id: string, updates: Partial<Investigation>) => {
    setInvestigations(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, ...updates, updatedAt: new Date().toISOString() } : inv
      )
    );
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleAdvancedFilters = (filters: any) => {
    console.log('Applied advanced filters:', filters);
  };

  const viewButtons = [
    { id: 'table', label: 'Table', icon: Table },
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investigations</h2>
            <p className="text-sm text-gray-600 mt-1">Manage and track all investigation activities</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewButtons.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === view.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View Content */}
      {currentView === 'table' && (
        <InvestigationTableView
          investigations={investigations}
          selectedInvestigations={selectedInvestigations}
          onSelectionChange={setSelectedInvestigations}
          onInvestigationClick={onInvestigationClick}
        />
      )}

      {currentView === 'kanban' && (
        <InvestigationKanbanView
          investigations={investigations}
          onInvestigationClick={onInvestigationClick}
          onInvestigationUpdate={handleInvestigationUpdate}
        />
      )}

      {currentView === 'analytics' && (
        <InvestigationAnalyticsView
          investigations={investigations}
        />
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleAdvancedFilters}
        type="reports"
      />
    </div>
  );
}