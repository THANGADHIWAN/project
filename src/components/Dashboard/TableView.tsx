import React, { useState } from 'react';
import { Eye, Edit, MoreHorizontal, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface Investigation {
  id: string;
  sampleName: string;
  sampleType: string;
  method: string;
  deviation: string;
  status: 'new' | 'in-progress' | 'under-review' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  analyst: string;
  dateCreated: string;
  dueDate: string;
  progress: number;
}

const mockInvestigations: Investigation[] = [
  {
    id: 'INV-2024-001',
    sampleName: 'Batch-A-001',
    sampleType: 'API',
    method: 'HPLC Assay',
    deviation: 'Out of Specification',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Dr. Sarah Chen',
    analyst: 'John Smith',
    dateCreated: '2024-01-15',
    dueDate: '2024-01-25',
    progress: 65
  },
  {
    id: 'INV-2024-002',
    sampleName: 'Batch-B-003',
    sampleType: 'Finished Product',
    method: 'Dissolution',
    deviation: 'Equipment Failure',
    status: 'new',
    priority: 'critical',
    assignedTo: 'Dr. Mike Johnson',
    analyst: 'Emily Davis',
    dateCreated: '2024-01-16',
    dueDate: '2024-01-20',
    progress: 10
  },
  {
    id: 'INV-2024-003',
    sampleName: 'Batch-C-007',
    sampleType: 'Raw Material',
    method: 'Karl Fischer',
    deviation: 'Procedural Deviation',
    status: 'under-review',
    priority: 'medium',
    assignedTo: 'Dr. Lisa Garcia',
    analyst: 'Alex Thompson',
    dateCreated: '2024-01-14',
    dueDate: '2024-01-22',
    progress: 85
  },
  {
    id: 'INV-2024-004',
    sampleName: 'Batch-D-012',
    sampleType: 'API',
    method: 'GC Purity',
    deviation: 'Environmental',
    status: 'closed',
    priority: 'low',
    assignedTo: 'Dr. Robert Brown',
    analyst: 'Maria Rodriguez',
    dateCreated: '2024-01-10',
    dueDate: '2024-01-18',
    progress: 100
  },
  {
    id: 'INV-2024-005',
    sampleName: 'Batch-E-019',
    sampleType: 'Finished Product',
    method: 'Microbiology',
    deviation: 'Contamination',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'Dr. Sarah Chen',
    analyst: 'David Lee',
    dateCreated: '2024-01-16',
    dueDate: '2024-01-26',
    progress: 40
  }
];

export function TableView() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'in-progress':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'under-review':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'new': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-orange-100 text-orange-700',
      'under-review': 'bg-blue-100 text-blue-700',
      'closed': 'bg-green-100 text-green-700'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'critical': 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedRows(prev => 
      prev.length === mockInvestigations.length 
        ? [] 
        : mockInvestigations.map(inv => inv.id)
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === mockInvestigations.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Investigation ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method & Deviation
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
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {mockInvestigations.map((investigation) => (
              <tr key={investigation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(investigation.id)}
                    onChange={() => toggleRowSelection(investigation.id)}
                    className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(investigation.status)}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{investigation.id}</div>
                      <div className="text-sm text-gray-500">{investigation.dateCreated}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{investigation.sampleName}</div>
                  <div className="text-sm text-gray-500">{investigation.sampleType}</div>
                  <div className="text-xs text-gray-400">Analyst: {investigation.analyst}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{investigation.method}</div>
                  <div className="text-sm text-gray-500">{investigation.deviation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(investigation.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(investigation.priority)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{investigation.assignedTo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{investigation.dueDate}</div>
                  {new Date(investigation.dueDate) < new Date() && investigation.status !== 'closed' && (
                    <div className="text-xs text-red-500">Overdue</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gray-600 h-2 rounded-full" 
                        style={{ width: `${investigation.progress}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{investigation.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}