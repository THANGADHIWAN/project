import React, { useState } from 'react';
import { MoreHorizontal, User, Calendar, AlertTriangle, Clock, Settings, Filter, Plus, Edit } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { Investigation, InvestigationStatus } from '../../types/investigation';

interface InvestigationKanbanViewProps {
  investigations: Investigation[];
  onInvestigationClick?: (id: string) => void;
  onInvestigationUpdate?: (id: string, updates: Partial<Investigation>) => void;
}

const statusColumns: { status: InvestigationStatus; title: string; color: string; bgColor: string }[] = [
  { status: 'initiated', title: 'Initiated', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300' },
  { status: 'in-progress', title: 'In Progress', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' },
  { status: 'rca-pending', title: 'RCA Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-100 border-yellow-300' },
  { status: 'capa-pending', title: 'CAPA Pending', color: 'text-orange-700', bgColor: 'bg-orange-100 border-orange-300' },
  { status: 'approval-pending', title: 'Approval Pending', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-300' },
  { status: 'completed', title: 'Completed', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300' },
  { status: 'closed', title: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300' }
];

export function InvestigationKanbanView({ investigations, onInvestigationClick, onInvestigationUpdate }: InvestigationKanbanViewProps) {
  const [draggedItem, setDraggedItem] = useState<Investigation | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<InvestigationStatus | null>(null);
  const [localInvestigations, setLocalInvestigations] = useState<Investigation[]>(investigations);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<InvestigationStatus[]>(
    statusColumns.map(col => col.status)
  );
  const [columnOrder, setColumnOrder] = useState<InvestigationStatus[]>(
    statusColumns.map(col => col.status)
  );

  React.useEffect(() => {
    setLocalInvestigations(investigations);
  }, [investigations]);

  const getInvestigationsByStatus = (status: InvestigationStatus) => {
    return localInvestigations.filter(inv => inv.status === status);
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleDragStart = (e: React.DragEvent, investigation: Investigation) => {
    setDraggedItem(investigation);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', investigation.id);
    
    // Add visual feedback
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, targetStatus: InvestigationStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(targetStatus);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: InvestigationStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem && draggedItem.status !== targetStatus) {
      // Update the investigation status
      const updatedInvestigation = { ...draggedItem, status: targetStatus };
      
      // Update local state immediately for smooth UX
      setLocalInvestigations(prev => 
        prev.map(inv => 
          inv.id === draggedItem.id ? updatedInvestigation : inv
        )
      );
      
      // Call the update callback if provided
      onInvestigationUpdate?.(draggedItem.id, { status: targetStatus });
      
      // Log the change for debugging
      console.log(`Investigation ${draggedItem.id} moved from ${draggedItem.status} to ${targetStatus}`);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const toggleColumnVisibility = (status: InvestigationStatus) => {
    setVisibleColumns(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const reorderColumns = (fromIndex: number, toIndex: number) => {
    const newOrder = [...columnOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    setColumnOrder(newOrder);
  };

  const InvestigationCard = ({ investigation }: { investigation: Investigation }) => {
    const daysRemaining = getDaysRemaining(investigation.dueDate);
    const isOverdue = daysRemaining < 0;
    const isDragging = draggedItem?.id === investigation.id;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, investigation)}
        onDragEnd={handleDragEnd}
        className={`bg-white rounded-lg border-2 p-4 mb-3 shadow-sm hover:shadow-md transition-all cursor-move select-none ${
          isDragging 
            ? 'opacity-50 border-blue-400 transform rotate-2' 
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={() => onInvestigationClick?.(investigation.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {investigation.id}
          </button>
          <div className="flex items-center space-x-1">
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
              <Edit className="h-3 w-3" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 leading-tight">
          {investigation.title}
        </h4>
        
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={investigation.priority} type="priority" />
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {investigation.currentStep}
          </span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">{investigation.completionPercentage}%</span>
          </div>
          <ProgressBar 
            progress={investigation.completionPercentage} 
            size="sm" 
            showPercentage={false}
            color={investigation.completionPercentage >= 75 ? 'green' : investigation.completionPercentage >= 50 ? 'blue' : 'yellow'}
          />
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-20">{investigation.assignedTo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span className={`font-medium ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : ''}`}>
              {isOverdue ? 'Overdue' : `${daysRemaining}d`}
            </span>
          </div>
        </div>
        
        {isOverdue && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            <AlertTriangle className="h-3 w-3" />
            <span className="font-medium">{Math.abs(daysRemaining)} days overdue</span>
          </div>
        )}
      </div>
    );
  };

  const orderedColumns = columnOrder
    .filter(status => visibleColumns.includes(status))
    .map(status => statusColumns.find(col => col.status === status)!)
    .filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Investigation Board</h3>
          <p className="text-sm text-gray-600">Drag cards between columns to update status</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Live Updates</span>
          </div>
          
          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Settings className="h-4 w-4" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Column Settings */}
      {showColumnSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Column Settings</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {statusColumns.map((column) => (
              <label key={column.status} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.status)}
                  onChange={() => toggleColumnVisibility(column.status)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{column.title}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 min-w-max pb-4">
          {orderedColumns.map((column) => {
            const columnInvestigations = getInvestigationsByStatus(column.status);
            const isDragOver = dragOverColumn === column.status;
            
            return (
              <div
                key={column.status}
                className={`flex flex-col w-80 flex-shrink-0 transition-all duration-200 ${
                  isDragOver ? 'transform scale-105' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, column.status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className={`${column.bgColor} border-2 rounded-lg p-4 mb-4 transition-all duration-200 ${
                  isDragOver ? 'border-blue-400 bg-blue-50' : ''
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${column.color}`}>{column.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-700 bg-white rounded-full px-3 py-1 shadow-sm">
                        {columnInvestigations.length}
                      </span>
                      <button className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-white/50">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Column Stats */}
                  <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                    <span>
                      Overdue: {columnInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length}
                    </span>
                    <span>
                      Critical: {columnInvestigations.filter(inv => inv.priority === 'critical').length}
                    </span>
                  </div>
                </div>
                
                <div className={`flex-1 min-h-[500px] transition-all duration-200 ${
                  isDragOver ? 'bg-blue-50/50 rounded-lg border-2 border-dashed border-blue-300' : ''
                }`}>
                  {columnInvestigations.map((investigation) => (
                    <InvestigationCard
                      key={investigation.id}
                      investigation={investigation}
                    />
                  ))}
                  
                  {columnInvestigations.length === 0 && (
                    <div className={`text-center text-gray-400 text-sm mt-8 p-8 border-2 border-dashed border-gray-200 rounded-lg transition-all duration-200 ${
                      isDragOver ? 'border-blue-300 bg-blue-50 text-blue-600' : ''
                    }`}>
                      {isDragOver ? 'Drop here to update status' : 'No investigations'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Board Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{localInvestigations.length}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {localInvestigations.filter(inv => inv.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {localInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length}
            </div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(localInvestigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / localInvestigations.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
}