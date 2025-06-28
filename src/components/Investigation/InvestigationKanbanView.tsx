import React, { useState } from 'react';
import { MoreHorizontal, User, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { Investigation, InvestigationStatus } from '../../types/investigation';

interface InvestigationKanbanViewProps {
  investigations: Investigation[];
  onInvestigationClick?: (id: string) => void;
}

const statusColumns: { status: InvestigationStatus; title: string; color: string }[] = [
  { status: 'initiated', title: 'Initiated', color: 'bg-gray-100' },
  { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
  { status: 'rca-pending', title: 'RCA Pending', color: 'bg-yellow-100' },
  { status: 'capa-pending', title: 'CAPA Pending', color: 'bg-orange-100' },
  { status: 'approval-pending', title: 'Approval Pending', color: 'bg-purple-100' },
  { status: 'completed', title: 'Completed', color: 'bg-green-100' },
  { status: 'closed', title: 'Closed', color: 'bg-gray-100' }
];

export function InvestigationKanbanView({ investigations, onInvestigationClick }: InvestigationKanbanViewProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const getInvestigationsByStatus = (status: InvestigationStatus) => {
    return investigations.filter(inv => inv.status === status);
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleDragStart = (e: React.DragEvent, investigationId: string) => {
    setDraggedItem(investigationId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: InvestigationStatus) => {
    e.preventDefault();
    if (draggedItem) {
      console.log(`Moving investigation ${draggedItem} to status ${targetStatus}`);
      // Here you would update the investigation status
      setDraggedItem(null);
    }
  };

  const InvestigationCard = ({ investigation }: { investigation: Investigation }) => {
    const daysRemaining = getDaysRemaining(investigation.dueDate);
    const isOverdue = daysRemaining < 0;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, investigation.id)}
        className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-shadow cursor-move"
      >
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={() => onInvestigationClick?.(investigation.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {investigation.id}
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        
        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {investigation.title}
        </h4>
        
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={investigation.priority} type="priority" />
          <span className="text-xs text-gray-500">{investigation.currentStep}</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{investigation.completionPercentage}%</span>
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
            <span>{investigation.assignedTo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : ''}>
              {isOverdue ? 'Overdue' : `${daysRemaining}d`}
            </span>
          </div>
        </div>
        
        {isOverdue && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-red-600">
            <AlertTriangle className="h-3 w-3" />
            <span>{Math.abs(daysRemaining)} days overdue</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Investigation Board</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>Drag cards to update status</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {statusColumns.map((column) => {
          const columnInvestigations = getInvestigationsByStatus(column.status);
          
          return (
            <div
              key={column.status}
              className="flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <div className={`${column.color} rounded-lg p-3 mb-4`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{column.title}</h4>
                  <span className="text-sm font-medium text-gray-600 bg-white rounded-full px-2 py-1">
                    {columnInvestigations.length}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 min-h-[400px]">
                {columnInvestigations.map((investigation) => (
                  <InvestigationCard
                    key={investigation.id}
                    investigation={investigation}
                  />
                ))}
                
                {columnInvestigations.length === 0 && (
                  <div className="text-center text-gray-400 text-sm mt-8">
                    No investigations
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