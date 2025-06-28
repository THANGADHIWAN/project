import React, { useState } from 'react';
import { Clock, AlertTriangle, Eye, CheckCircle, Plus, MoreHorizontal } from 'lucide-react';

interface Investigation {
  id: string;
  sampleName: string;
  sampleType: string;
  method: string;
  deviation: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  analyst: string;
  dateCreated: string;
  dueDate: string;
}

const mockInvestigations: Investigation[] = [
  {
    id: 'INV-2024-001',
    sampleName: 'Batch-A-001',
    sampleType: 'API',
    method: 'HPLC Assay',
    deviation: 'Out of Specification',
    priority: 'high',
    assignedTo: 'Dr. Sarah Chen',
    analyst: 'John Smith',
    dateCreated: '2024-01-15',
    dueDate: '2024-01-25'
  },
  {
    id: 'INV-2024-002',
    sampleName: 'Batch-B-003',
    sampleType: 'Finished Product',
    method: 'Dissolution',
    deviation: 'Equipment Failure',
    priority: 'critical',
    assignedTo: 'Dr. Mike Johnson',
    analyst: 'Emily Davis',
    dateCreated: '2024-01-16',
    dueDate: '2024-01-20'
  },
  {
    id: 'INV-2024-003',
    sampleName: 'Batch-C-007',
    sampleType: 'Raw Material',
    method: 'Karl Fischer',
    deviation: 'Procedural Deviation',
    priority: 'medium',
    assignedTo: 'Dr. Lisa Garcia',
    analyst: 'Alex Thompson',
    dateCreated: '2024-01-14',
    dueDate: '2024-01-22'
  },
  {
    id: 'INV-2024-004',
    sampleName: 'Batch-D-012',
    sampleType: 'API',
    method: 'GC Purity',
    deviation: 'Environmental',
    priority: 'low',
    assignedTo: 'Dr. Robert Brown',
    analyst: 'Maria Rodriguez',
    dateCreated: '2024-01-10',
    dueDate: '2024-01-18'
  },
  {
    id: 'INV-2024-005',
    sampleName: 'Batch-E-019',
    sampleType: 'Finished Product',
    method: 'Microbiology',
    deviation: 'Contamination',
    priority: 'high',
    assignedTo: 'Dr. Sarah Chen',
    analyst: 'David Lee',
    dateCreated: '2024-01-16',
    dueDate: '2024-01-26'
  }
];

const columns = [
  { id: 'new', title: 'New', icon: Clock, color: 'gray' },
  { id: 'in-progress', title: 'In Progress', icon: AlertTriangle, color: 'orange' },
  { id: 'under-review', title: 'Under Review', icon: Eye, color: 'blue' },
  { id: 'closed', title: 'Closed', icon: CheckCircle, color: 'green' }
];

export function KanbanView() {
  const [investigations, setInvestigations] = useState(() => {
    // Distribute investigations across columns for demo
    const distributed = {
      'new': [mockInvestigations[1]],
      'in-progress': [mockInvestigations[0], mockInvestigations[4]],
      'under-review': [mockInvestigations[2]],
      'closed': [mockInvestigations[3]]
    };
    return distributed;
  });

  const [draggedItem, setDraggedItem] = useState<Investigation | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

  const handleDragStart = (investigation: Investigation, columnId: string) => {
    setDraggedItem(investigation);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedFrom && draggedFrom !== targetColumnId) {
      setInvestigations(prev => {
        const newState = { ...prev };
        
        // Remove from source column
        newState[draggedFrom as keyof typeof prev] = prev[draggedFrom as keyof typeof prev].filter(
          item => item.id !== draggedItem.id
        );
        
        // Add to target column
        newState[targetColumnId as keyof typeof prev] = [
          ...prev[targetColumnId as keyof typeof prev],
          draggedItem
        ];
        
        return newState;
      });
    }
    
    setDraggedItem(null);
    setDraggedFrom(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      'low': 'bg-green-100 text-green-700',
      'medium': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700',
      'critical': 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnInvestigations = investigations[column.id as keyof typeof investigations] || [];
          
          return (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className={`h-5 w-5 text-${column.color}-600`} />
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {columnInvestigations.length}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {columnInvestigations.map((investigation) => (
                  <div
                    key={investigation.id}
                    draggable
                    onDragStart={() => handleDragStart(investigation, column.id)}
                    className={`bg-white rounded-lg p-4 border-l-4 ${getPriorityColor(investigation.priority)} shadow-sm hover:shadow-md transition-shadow cursor-move`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {investigation.id}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {investigation.sampleName}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        <div>{investigation.sampleType}</div>
                        <div>{investigation.method}</div>
                      </div>
                      
                      <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {investigation.deviation}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {getPriorityBadge(investigation.priority)}
                        <div className="text-xs text-gray-500">
                          Due: {investigation.dueDate}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                        <div>Assigned: {investigation.assignedTo}</div>
                        <div>Analyst: {investigation.analyst}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnInvestigations.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No investigations</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}