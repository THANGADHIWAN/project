import React, { useState, useCallback, useMemo } from 'react';
import { TableView } from './TableView';
import { KanbanView } from './KanbanView';
import { AnalyticalView } from './AnalyticalView';

type ViewType = 'table' | 'kanban' | 'analytical';

export function DashboardView() {
  const [activeView, setActiveView] = useState<ViewType>('table');

  const renderView = () => {
    switch (activeView) {
      case 'table':
        return <TableView />;
      case 'kanban':
        return <KanbanView />;
      case 'analytical':
        return <AnalyticalView />;
      default:
        return <TableView />;
    }
  };

  return (
    <div className="h-full bg-white">
      {/* View Selector */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex space-x-1">
          {[
            { id: 'table', label: 'Table View' },
            { id: 'kanban', label: 'Kanban View' },
            { id: 'analytical', label: 'Analytical View' }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as ViewType)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeView === view.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
}