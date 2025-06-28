import React from 'react';
import { Eye, Edit, Clock, AlertTriangle, CheckCircle, User, Calendar } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { Investigation, InvestigationStatus } from '../../types/investigation';

interface InvestigationTableViewProps {
  investigations: Investigation[];
  selectedInvestigations: string[];
  onSelectionChange: (selected: string[]) => void;
  onInvestigationClick?: (id: string) => void;
}

export function InvestigationTableView({ 
  investigations, 
  selectedInvestigations, 
  onSelectionChange, 
  onInvestigationClick 
}: InvestigationTableViewProps) {
  
  const handleSelectAll = () => {
    if (selectedInvestigations.length === investigations.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(investigations.map(inv => inv.id));
    }
  };

  const handleSelectInvestigation = (id: string) => {
    onSelectionChange(
      selectedInvestigations.includes(id) 
        ? selectedInvestigations.filter(invId => invId !== id)
        : [...selectedInvestigations, id]
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Investigations ({investigations.length})
          </h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedInvestigations.length === investigations.length && investigations.length > 0}
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
            {investigations.map((investigation) => {
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
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{investigation.assignedTo}</span>
                    </div>
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
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-900">
                          {new Date(investigation.dueDate).toLocaleDateString()}
                        </div>
                        <div className={`text-xs ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days remaining`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onInvestigationClick?.(investigation.id)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title="Edit"
                      >
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
  );
}