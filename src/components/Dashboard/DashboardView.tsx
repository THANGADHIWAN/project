import React, { useState } from 'react';
import { TableView } from './TableView';
import { KanbanView } from './KanbanView';
import { AnalyticalView } from './AnalyticalView';
import { Table, Kanban, BarChart3, Filter, Download, Plus } from 'lucide-react';

export function DashboardView() {
  const [activeView, setActiveView] = useState<'table' | 'kanban' | 'analytical'>('table');

  const views = [
    { id: 'table', label: 'Table View', icon: Table },
    { id: 'kanban', label: 'Kanban View', icon: Kanban },
    { id: 'analytical', label: 'Analytical View', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Investigation Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Manage and track all laboratory investigations</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm font-medium flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Investigation</span>
            </button>
          </div>
        </div>
        
        {/* View Selector */}
        <div className="flex items-center space-x-1 mt-6 bg-gray-50 p-1 rounded-lg w-fit">
          {views.map((view) => {
            const Icon = view.icon;
            const isActive = activeView === view.id;
            
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Content */}
      <div className="min-h-[600px]">
        {activeView === 'table' && <TableView />}
        {activeView === 'kanban' && <KanbanView />}
        {activeView === 'analytical' && <AnalyticalView />}
      </div>
    </div>
  );
}