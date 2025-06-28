import React, { useState, useCallback } from 'react';
import { MoreHorizontal, Plus, Calendar, User } from 'lucide-react';

interface Investigation {
  id: string;
  sampleId: string;
  sampleType: string;
  method: string;
  instrument: string;
  deviationId: string;
  capaStatus: string;
  analyst: string;
  startDate: string;
  dueDate: string;
  status: 'New' | 'In Progress' | 'Under Review' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

const mockData: Investigation[] = [
  {
    id: 'INV-2024-001',
    sampleId: 'SM-2024-001',
    sampleType: 'API',
    method: 'HPLC Assay',
    instrument: 'HPLC-001',
    deviationId: 'DEV-2024-001',
    capaStatus: 'In Progress',
    analyst: 'Dr. Sarah Chen',
    startDate: '2024-01-15',
    dueDate: '2024-01-25',
    status: 'In Progress',
    priority: 'High',
    description: 'Out of specification result for API content analysis'
  },
  {
    id: 'INV-2024-002',
    sampleId: 'SM-2024-002',
    sampleType: 'Excipient',
    method: 'UV Spectroscopy',
    instrument: 'UV-001',
    deviationId: 'DEV-2024-002',
    capaStatus: 'Pending',
    analyst: 'Dr. Mike Johnson',
    startDate: '2024-01-14',
    dueDate: '2024-01-20',
    status: 'Under Review',
    priority: 'Critical',
    description: 'Equipment failure during analysis'
  },
  {
    id: 'INV-2024-003',
    sampleId: 'SM-2024-003',
    sampleType: 'Finished Product',
    method: 'Dissolution',
    instrument: 'DIS-001',
    deviationId: 'DEV-2024-003',
    capaStatus: 'Completed',
    analyst: 'Dr. Emily Davis',
    startDate: '2024-01-13',
    dueDate: '2024-01-22',
    status: 'Closed',
    priority: 'Medium',
    description: 'Temperature deviation in storage area'
  },
  {
    id: 'INV-2024-004',
    sampleId: 'SM-2024-004',
    sampleType: 'Raw Material',
    method: 'FTIR',
    instrument: 'FTIR-001',
    deviationId: 'DEV-2024-004',
    capaStatus: 'Not Started',
    analyst: 'Dr. Alex Thompson',
    startDate: '2024-01-16',
    dueDate: '2024-01-26',
    status: 'New',
    priority: 'Low',
    description: 'Procedural deviation in sample preparation'
  },
  {
    id: 'INV-2024-005',
    sampleId: 'SM-2024-005',
    sampleType: 'API',
    method: 'GC Analysis',
    instrument: 'GC-001',
    deviationId: 'DEV-2024-005',
    capaStatus: 'In Progress',
    analyst: 'Dr. Lisa Garcia',
    startDate: '2024-01-12',
    dueDate: '2024-01-18',
    status: 'In Progress',
    priority: 'High',
    description: 'Contamination event in clean room'
  }
];

const columns = [
  { id: 'New', title: 'New', color: 'bg-blue-50 border-blue-200' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'Under Review', title: 'Under Review', color: 'bg-orange-50 border-orange-200' },
  { id: 'Closed', title: 'Closed', color: 'bg-green-50 border-green-200' }
];

export function KanbanView() {
  const [investigations, setInvestigations] = useState<Investigation[]>(mockData);
  const [selectedCard, setSelectedCard] = useState<Investigation | null>(null);
  const [draggedItem, setDraggedItem] = useState<Investigation | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, investigation: Investigation) => {
    setDraggedItem(investigation);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStatus: Investigation['status']) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      setInvestigations(prev => 
        prev.map(inv => 
          inv.id === draggedItem.id 
            ? { ...inv, status: newStatus }
            : inv
        )
      );
    }
    setDraggedItem(null);
  }, [draggedItem]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getInvestigationsByStatus = (status: Investigation['status']) => {
    return investigations.filter(inv => inv.status === status);
  };

  return (
    <div className="h-full bg-white p-6">
      <div className="grid grid-cols-4 gap-6 h-full">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`flex flex-col rounded-lg border-2 ${column.color} h-full`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id as Investigation['status'])}
          >
            {/* Column Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {getInvestigationsByStatus(column.id as Investigation['status']).length}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {getInvestigationsByStatus(column.id as Investigation['status']).map((investigation) => (
                <div
                  key={investigation.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, investigation)}
                  onClick={() => setSelectedCard(investigation)}
                  className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{investigation.id}</h4>
                      <p className="text-xs text-gray-600">{investigation.sampleId}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(investigation.priority)}`}>
                        {investigation.priority}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 line-clamp-2">{investigation.description}</p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Method:</span>
                        <span className="ml-1">{investigation.method}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Instrument:</span>
                        <span className="ml-1">{investigation.instrument}</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{investigation.analyst}</span>
                      </div>
                      <div className={`flex items-center space-x-1 text-xs ${isOverdue(investigation.dueDate) ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(investigation.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Side Panel for Card Details */}
      {selectedCard && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50">
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Investigation Details</h2>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">{selectedCard.id}</h3>
                <p className="text-sm text-gray-600">{selectedCard.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Sample ID</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCard.sampleId}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Sample Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCard.sampleType}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Method</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCard.method}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Instrument</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCard.instrument}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Analyst</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCard.analyst}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</label>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedCard.priority)}`}>
                    {selectedCard.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(selectedCard.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</label>
                  <p className={`mt-1 text-sm ${isOverdue(selectedCard.dueDate) ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Date(selectedCard.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">CAPA Status</label>
                <p className="text-sm text-gray-900">{selectedCard.capaStatus}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Deviation ID</label>
                <p className="text-sm text-gray-900">{selectedCard.deviationId}</p>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-6 border-t border-gray-200">
              <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}