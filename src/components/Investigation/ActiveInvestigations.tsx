import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Clock, AlertTriangle, CheckCircle, Grid3X3, BarChart3, Table, Kanban, SortAsc, SortDesc } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestigationStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate-asc');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedInvestigations, setSelectedInvestigations] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [investigations, setInvestigations] = useState<Investigation[]>(mockInvestigations);

  // Get unique assignees for filter
  const uniqueAssignees = [...new Set(investigations.map(inv => inv.assignedTo))];

  // Filter and sort investigations
  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || inv.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || inv.assignedTo === assigneeFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'dueDate':
        aValue = new Date(a.dueDate).getTime();
        bValue = new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'progress':
        aValue = a.completionPercentage;
        bValue = b.completionPercentage;
        break;
      case 'assignee':
        aValue = a.assignedTo.toLowerCase();
        bValue = b.assignedTo.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setSortBy('dueDate');
    setSortOrder('asc');
  };

  const viewButtons = [
    { id: 'table', label: 'Table', icon: Table },
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  // Calculate KPIs
  const totalActive = filteredInvestigations.filter(inv => inv.status !== 'completed' && inv.status !== 'closed').length;
  const overdue = filteredInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length;
  const critical = filteredInvestigations.filter(inv => inv.priority === 'critical').length;
  const completed = filteredInvestigations.filter(inv => inv.status === 'completed').length;
  const avgProgress = filteredInvestigations.length > 0 
    ? Math.round(filteredInvestigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / filteredInvestigations.length)
    : 0;

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

      {/* KPI Cards - Consistent across all views */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Active</p>
              <p className="text-2xl font-bold text-blue-600">{totalActive}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdue}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Priority</p>
              <p className="text-2xl font-bold text-orange-600">{critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-purple-600">{avgProgress}%</p>
            </div>
            <BarChart3 className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Unified Search and Filters - Consistent across all views */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search investigations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InvestigationStatus | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>
          
          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Assignees</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee} value={assignee}>{assignee}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="createdAt">Created Date</option>
              <option value="title">Title</option>
              <option value="progress">Progress</option>
              <option value="assignee">Assignee</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Showing {filteredInvestigations.length} of {investigations.length} investigations
            </span>
            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear filters
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedInvestigations.length > 0 && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Selected ({selectedInvestigations.length})</span>
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
          onInvestigationUpdate={handleInvestigationUpdate}
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