import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Clock, AlertTriangle, CheckCircle, Grid3X3, BarChart3, Table, Kanban } from 'lucide-react';
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
  }
];

export function ActiveInvestigations({ onInvestigationClick }: ActiveInvestigationsProps) {
  const [currentView, setCurrentView] = useState<'table' | 'kanban' | 'analytics'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedInvestigations, setSelectedInvestigations] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredInvestigations = mockInvestigations.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || inv.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

      {/* Filters - Only show for table and kanban views */}
      {currentView !== 'analytics' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search investigations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvestigationStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="initiated">Initiated</option>
                <option value="in-progress">In Progress</option>
                <option value="rca-pending">RCA Pending</option>
                <option value="capa-pending">CAPA Pending</option>
                <option value="approval-pending">Approval Pending</option>
                <option value="completed">Completed</option>
                <option value="closed">Closed</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              {selectedInvestigations.length > 0 && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Selected</span>
                </button>
              )}
              <button
                onClick={() => setShowAdvancedFilters(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filter</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards - Only show for table and kanban views */}
      {currentView !== 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-2xl font-bold text-gray-900">{filteredInvestigations.filter(inv => inv.status !== 'completed' && inv.status !== 'closed').length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{filteredInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Priority</p>
                <p className="text-2xl font-bold text-orange-600">{filteredInvestigations.filter(inv => inv.priority === 'critical').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{filteredInvestigations.filter(inv => inv.status === 'completed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* View Content */}
      {currentView === 'table' && (
        <InvestigationTableView
          investigations={filteredInvestigations}
          selectedInvestigations={selectedInvestigations}
          onSelectionChange={setSelectedInvestigations}
          onInvestigationClick={onInvestigationClick}
        />
      )}

      {currentView === 'kanban' && (
        <InvestigationKanbanView
          investigations={filteredInvestigations}
          onInvestigationClick={onInvestigationClick}
        />
      )}

      {currentView === 'analytics' && (
        <InvestigationAnalyticsView
          investigations={filteredInvestigations}
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