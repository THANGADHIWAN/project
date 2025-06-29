import React, { useState } from 'react';
import { MoreHorizontal, User, Calendar, AlertTriangle, Clock, Filter, Edit, Eye, CheckCircle, Search } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';
import { Investigation, InvestigationStatus } from '../../types/investigation';

interface InvestigationKanbanViewProps {
  investigations: Investigation[];
  onInvestigationClick?: (id: string) => void;
  onInvestigationUpdate?: (id: string, updates: Partial<Investigation>) => void;
}

interface KanbanColumn {
  status: InvestigationStatus;
  title: string;
  color: string;
  bgColor: string;
  visible: boolean;
  order: number;
}

interface ViewSettings {
  groupBy: 'status' | 'priority' | 'assignee';
  sortBy: 'dueDate-asc' | 'dueDate-desc' | 'priority-asc' | 'priority-desc' | 'createdAt-asc' | 'createdAt-desc' | 'title-asc' | 'title-desc' | 'progress-asc' | 'progress-desc';
  showProgress: boolean;
  showDueDate: boolean;
  showAssignee: boolean;
}

const defaultColumns: KanbanColumn[] = [
  { status: 'initiated', title: 'New Investigations', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', visible: true, order: 0 },
  { status: 'in-progress', title: 'Under Investigation', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200', visible: true, order: 1 },
  { status: 'rca-pending', title: 'Root Cause Analysis', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', visible: true, order: 2 },
  { status: 'capa-pending', title: 'CAPA Development', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200', visible: true, order: 3 },
  { status: 'approval-pending', title: 'Pending Approval', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', visible: true, order: 4 },
  { status: 'completed', title: 'Completed', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', visible: true, order: 5 },
  { status: 'closed', title: 'Closed', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200', visible: false, order: 6 }
];

const priorityColumns = [
  { key: 'critical', title: 'Critical Priority', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  { key: 'high', title: 'High Priority', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
  { key: 'medium', title: 'Medium Priority', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200' },
  { key: 'low', title: 'Low Priority', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' }
];

export function InvestigationKanbanView({ investigations, onInvestigationClick, onInvestigationUpdate }: InvestigationKanbanViewProps) {
  const [draggedItem, setDraggedItem] = useState<Investigation | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [localInvestigations, setLocalInvestigations] = useState<Investigation[]>(investigations);
  const [columns, setColumns] = useState<KanbanColumn[]>(defaultColumns);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    groupBy: 'status',
    sortBy: 'dueDate-asc',
    showProgress: true,
    showDueDate: true,
    showAssignee: true
  });

  React.useEffect(() => {
    setLocalInvestigations(investigations);
  }, [investigations]);

  const filteredInvestigations = localInvestigations.filter(inv => {
    const matchesSearch = inv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortInvestigations = (investigations: Investigation[]) => {
    return [...investigations].sort((a, b) => {
      const [sortField, sortOrder] = viewSettings.sortBy.split('-');
      let aValue: any, bValue: any;
      
      switch (sortField) {
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
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const getInvestigationsByGroup = (groupKey: string) => {
    let groupInvestigations: Investigation[] = [];
    
    if (viewSettings.groupBy === 'status') {
      groupInvestigations = filteredInvestigations.filter(inv => inv.status === groupKey);
    } else if (viewSettings.groupBy === 'priority') {
      groupInvestigations = filteredInvestigations.filter(inv => inv.priority === groupKey);
    } else if (viewSettings.groupBy === 'assignee') {
      groupInvestigations = filteredInvestigations.filter(inv => inv.assignedTo === groupKey);
    }
    
    return sortInvestigations(groupInvestigations);
  };

  const getGroupColumns = () => {
    if (viewSettings.groupBy === 'status') {
      return columns.filter(col => col.visible).sort((a, b) => a.order - b.order);
    } else if (viewSettings.groupBy === 'priority') {
      return priorityColumns.map(col => ({
        status: col.key as InvestigationStatus,
        title: col.title,
        color: col.color,
        bgColor: col.bgColor,
        visible: true,
        order: 0
      }));
    } else if (viewSettings.groupBy === 'assignee') {
      const assignees = [...new Set(filteredInvestigations.map(inv => inv.assignedTo))];
      return assignees.map((assignee, index) => ({
        status: assignee as InvestigationStatus,
        title: assignee,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50 border-blue-200',
        visible: true,
        order: index
      }));
    }
    return [];
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleDragStart = (e: React.DragEvent, investigation: Investigation) => {
    setDraggedItem(investigation);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', investigation.id);
    
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(3deg)';
    dragImage.style.opacity = '0.8';
    dragImage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent, targetGroup: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(targetGroup);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGroup: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedItem) {
      let updates: Partial<Investigation> = {};
      
      if (viewSettings.groupBy === 'status' && draggedItem.status !== targetGroup) {
        updates.status = targetGroup as InvestigationStatus;
        // Update completion percentage based on status
        switch (targetGroup) {
          case 'initiated':
            updates.completionPercentage = 10;
            break;
          case 'in-progress':
            updates.completionPercentage = 30;
            break;
          case 'rca-pending':
            updates.completionPercentage = 50;
            break;
          case 'capa-pending':
            updates.completionPercentage = 75;
            break;
          case 'approval-pending':
            updates.completionPercentage = 90;
            break;
          case 'completed':
            updates.completionPercentage = 100;
            break;
        }
      } else if (viewSettings.groupBy === 'priority' && draggedItem.priority !== targetGroup) {
        updates.priority = targetGroup as any;
      } else if (viewSettings.groupBy === 'assignee' && draggedItem.assignedTo !== targetGroup) {
        updates.assignedTo = targetGroup;
      }
      
      if (Object.keys(updates).length > 0) {
        const updatedInvestigation = { ...draggedItem, ...updates, updatedAt: new Date().toISOString() };
        
        setLocalInvestigations(prev => 
          prev.map(inv => 
            inv.id === draggedItem.id ? updatedInvestigation : inv
          )
        );
        
        onInvestigationUpdate?.(draggedItem.id, updates);
        console.log(`Investigation ${draggedItem.id} updated:`, updates);
      }
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const updateColumnTitle = (status: InvestigationStatus, newTitle: string) => {
    setColumns(prev => prev.map(col => 
      col.status === status ? { ...col, title: newTitle } : col
    ));
    setEditingColumn(null);
    setNewColumnTitle('');
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
        className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-move select-none p-4 mb-3 ${
          isDragging 
            ? 'opacity-50 border-blue-400 transform rotate-2 scale-105' 
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <button
            onClick={() => onInvestigationClick?.(investigation.id)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            {investigation.id}
          </button>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => onInvestigationClick?.(investigation.id)}
              className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50"
              title="View Details"
            >
              <Eye className="h-3 w-3" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight text-sm">
          {investigation.title}
        </h4>
        
        <div className="flex items-center justify-between mb-2">
          <StatusBadge status={investigation.priority} type="priority" />
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {investigation.currentStep}
          </span>
        </div>
        
        {viewSettings.showProgress && (
          <div className="mb-2">
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
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          {viewSettings.showAssignee && (
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="truncate max-w-20">{investigation.assignedTo}</span>
            </div>
          )}
          {viewSettings.showDueDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span className={`font-medium ${isOverdue ? 'text-red-600' : daysRemaining <= 3 ? 'text-orange-600' : ''}`}>
                {isOverdue ? 'Overdue' : `${daysRemaining}d`}
              </span>
            </div>
          )}
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

  const groupColumns = getGroupColumns();

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
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

          {/* Group By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Group by</label>
            <select
              value={viewSettings.groupBy}
              onChange={(e) => setViewSettings(prev => ({ ...prev, groupBy: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="status">Status</option>
              <option value="priority">Priority</option>
              <option value="assignee">Assignee</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
            <select
              value={viewSettings.sortBy}
              onChange={(e) => setViewSettings(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="dueDate-asc">Due Date (Earliest First)</option>
              <option value="dueDate-desc">Due Date (Latest First)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="createdAt-desc">Created Date (Newest First)</option>
              <option value="createdAt-asc">Created Date (Oldest First)</option>
              <option value="title-asc">Title (A to Z)</option>
              <option value="title-desc">Title (Z to A)</option>
              <option value="progress-desc">Progress (High to Low)</option>
              <option value="progress-asc">Progress (Low to High)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Kanban Board - Always Horizontal Scrolling */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="w-full overflow-x-auto">
          <div 
            className="flex gap-4 pb-4" 
            style={{ 
              minWidth: `${groupColumns.length * 300}px`,
              width: 'max-content'
            }}
          >
            {groupColumns.map((column) => {
              const columnInvestigations = getInvestigationsByGroup(column.status);
              const isDragOver = dragOverColumn === column.status;
              
              return (
                <div
                  key={column.status}
                  className={`flex flex-col transition-all duration-200 ${
                    isDragOver ? 'transform scale-105' : ''
                  }`}
                  style={{ 
                    width: '280px',
                    minWidth: '280px',
                    flexShrink: 0
                  }}
                  onDragOver={(e) => handleDragOver(e, column.status)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.status)}
                >
                  <div className={`${column.bgColor} border-2 rounded-lg p-4 mb-4 transition-all duration-200 ${
                    isDragOver ? 'border-blue-400 bg-blue-50' : ''
                  }`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${column.color} truncate`}>{column.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-700 bg-white rounded-full px-3 py-1 shadow-sm">
                          {columnInvestigations.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                      <span>
                        Overdue: {columnInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length}
                      </span>
                      <span>
                        Critical: {columnInvestigations.filter(inv => inv.priority === 'critical').length}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex-1 min-h-[400px] transition-all duration-200 ${
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
                        {isDragOver ? 'Drop here to update' : 'No investigations'}
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
              <div className="text-2xl font-bold text-gray-900">{filteredInvestigations.length}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {filteredInvestigations.filter(inv => inv.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {filteredInvestigations.filter(inv => getDaysRemaining(inv.dueDate) < 0).length}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {filteredInvestigations.length > 0 ? Math.round(filteredInvestigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / filteredInvestigations.length) : 0}%
              </div>
              <div className="text-sm text-gray-600">Avg Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column Title Editor */}
      {editingColumn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Column Title</h3>
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter column title"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setEditingColumn(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => updateColumnTitle(editingColumn as InvestigationStatus, newColumnTitle)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}