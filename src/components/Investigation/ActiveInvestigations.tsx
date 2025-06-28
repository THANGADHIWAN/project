import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { AdvancedFilters } from './AdvancedFilters';
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

  const handleSelectAll = () => {
    if (selectedInvestigations.length === filteredInvestigations.length) {
      setSelectedInvestigations([]);
    } else {
      setSelectedInvestigations(filteredInvestigations.map(inv => inv.id));
    }
  };

  const handleSelectInvestigation = (id: string) => {
    setSelectedInvestigations(prev => 
      prev.includes(id) 
        ? prev.filter(invId => invId !== id)
        : [...prev, id]
    );
  };

  const getStatusIcon = (status: InvestigationStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
      case 'rca-pending':
      case 'capa-pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approval-pending':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleAdvancedFilters = (filters: any) => {
    console.log('Applied advanced filters:', filters);
    // Implement advanced filtering logic here
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
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

      {/* Summary Cards */}
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

      {/* Investigations Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Investigations ({filteredInvestigations.length})
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedInvestigations.length === filteredInvestigations.length && filteredInvestigations.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investigation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvestigations.map((investigation) => {
                const daysRemaining = getDaysRemaining(investigation.dueDate);
                const isOverdue = daysRemaining < 0;
                
                return (
                  <tr key={investigation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedInvestigations.includes(investigation.id)}
                          onChange={() => handleSelectInvestigation(investigation.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(investigation.status)}
                            <button
                              onClick={() => onInvestigationClick?.(investigation.id)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              {investigation.id}
                            </button>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{investigation.title}</div>
                          <div className="text-xs text-gray-500 mt-1">Current: {investigation.currentStep}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={investigation.status} type="investigation" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={investigation.priority} type="priority" />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {investigation.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-24">
                        <ProgressBar 
                          progress={investigation.completionPercentage} 
                          size="sm" 
                          showPercentage={false}
                          color={investigation.completionPercentage >= 75 ? 'green' : investigation.completionPercentage >= 50 ? 'blue' : 'yellow'}
                        />
                        <div className="text-xs text-gray-500 mt-1">{investigation.completionPercentage}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(investigation.dueDate).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onInvestigationClick?.(investigation.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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