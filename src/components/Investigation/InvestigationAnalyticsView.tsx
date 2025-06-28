import React, { useState } from 'react';
import { Plus, Download, Save, BarChart3, PieChart, TrendingUp, Activity, Grid3X3, X, Settings } from 'lucide-react';
import { Investigation } from '../../types/investigation';

interface InvestigationAnalyticsViewProps {
  investigations: Investigation[];
}

interface AnalyticsWidget {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  data?: any;
}

const availableCharts = [
  { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', icon: PieChart },
  { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', icon: PieChart },
  { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', icon: TrendingUp },
  { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', icon: BarChart3 },
  { id: 'age-distribution', title: 'Investigation Age Distribution', type: 'histogram', icon: BarChart3 },
  { id: 'monthly-volume', title: 'Monthly Investigation Volume', type: 'area', icon: Activity },
  { id: 'department-split', title: 'Department-wise Split', type: 'treemap', icon: Grid3X3 },
  { id: 'time-to-closure', title: 'Average Time to Closure', type: 'gauge', icon: Activity },
  { id: 'overdue-analysis', title: 'Overdue Analysis', type: 'scatter', icon: TrendingUp },
  { id: 'repeat-incidents', title: 'Repeat Incidents Count', type: 'heatmap', icon: Grid3X3 },
  { id: 'capa-effectiveness', title: 'CAPA Effectiveness Rate', type: 'progress', icon: BarChart3 },
  { id: 'investigation-funnel', title: 'Investigation Outcomes Funnel', type: 'funnel', icon: TrendingUp },
  { id: 'seasonal-patterns', title: 'Seasonal Investigation Patterns', type: 'radar', icon: Activity },
  { id: 'root-cause-frequency', title: 'Root Cause Frequency', type: 'wordcloud', icon: PieChart },
  { id: 'sla-compliance', title: 'SLA Compliance Rate', type: 'gauge', icon: Activity },
  { id: 'investigation-complexity', title: 'Investigation Complexity Matrix', type: 'bubble', icon: Grid3X3 },
  { id: 'resource-utilization', title: 'Resource Utilization', type: 'stacked-bar', icon: BarChart3 },
  { id: 'quality-metrics', title: 'Quality Metrics Dashboard', type: 'multi-metric', icon: Activity },
  { id: 'trend-correlation', title: 'Trend Correlation Analysis', type: 'correlation', icon: TrendingUp },
  { id: 'performance-scorecard', title: 'Performance Scorecard', type: 'scorecard', icon: BarChart3 }
];

export function InvestigationAnalyticsView({ investigations }: InvestigationAnalyticsViewProps) {
  const [activeWidgets, setActiveWidgets] = useState<AnalyticsWidget[]>([
    { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', size: 'medium' },
    { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', size: 'medium' },
    { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', size: 'large' },
    { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', size: 'medium' }
  ]);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<string[]>(['Default Layout', 'Executive Summary', 'Operational View']);

  const addWidget = (chartId: string) => {
    const chart = availableCharts.find(c => c.id === chartId);
    if (chart && !activeWidgets.find(w => w.id === chartId)) {
      setActiveWidgets(prev => [...prev, {
        id: chart.id,
        title: chart.title,
        type: chart.type,
        size: 'medium'
      }]);
    }
    setShowChartSelector(false);
  };

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const updateWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setActiveWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, size } : w
    ));
  };

  const exportToPDF = () => {
    console.log('Exporting analytics to PDF...');
    // Implementation for PDF export
  };

  const saveLayout = () => {
    const layoutName = prompt('Enter layout name:');
    if (layoutName) {
      setSavedLayouts(prev => [...prev, layoutName]);
      console.log('Layout saved:', layoutName);
    }
  };

  const getWidgetSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const generateMockData = (type: string) => {
    switch (type) {
      case 'pie':
        return {
          labels: ['In Progress', 'Completed', 'CAPA Pending', 'Approval Pending', 'Initiated'],
          data: [8, 12, 5, 3, 2],
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280']
        };
      case 'donut':
        return {
          labels: ['Critical', 'High', 'Medium', 'Low'],
          data: [3, 8, 12, 7],
          colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981']
        };
      case 'bar':
        return {
          labels: ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Alex Thompson'],
          data: [5, 8, 3, 6, 4],
          color: '#3B82F6'
        };
      default:
        return {};
    }
  };

  const renderChart = (widget: AnalyticsWidget) => {
    const data = generateMockData(widget.type);
    
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">
            {widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} Chart
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Interactive visualization
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investigation Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive data visualization and insights</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Load Layout</option>
              {savedLayouts.map((layout, index) => (
                <option key={index} value={layout}>{layout}</option>
              ))}
            </select>
            
            <button
              onClick={saveLayout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Layout</span>
            </button>
            
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
            
            <button
              onClick={() => setShowChartSelector(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeWidgets.map((widget) => (
          <div
            key={widget.id}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 ${getWidgetSizeClass(widget.size)}`}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={widget.size}
                    onChange={(e) => updateWidgetSize(widget.id, e.target.value as any)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 h-64">
              {renderChart(widget)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Selector Modal */}
      {showChartSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Visualization</h3>
              <button
                onClick={() => setShowChartSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCharts.map((chart) => {
                const Icon = chart.icon;
                const isActive = activeWidgets.some(w => w.id === chart.id);
                
                return (
                  <button
                    key={chart.id}
                    onClick={() => !isActive && addWidget(chart.id)}
                    disabled={isActive}
                    className={`p-4 border rounded-lg text-left transition-colors ${
                      isActive 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">{chart.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 capitalize">{chart.type} visualization</p>
                    {isActive && (
                      <p className="text-xs text-gray-500 mt-1">Already added</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{investigations.length}</div>
            <div className="text-sm text-gray-600">Total Investigations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {investigations.filter(i => i.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {investigations.filter(i => i.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {investigations.filter(i => i.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(investigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / investigations.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg. Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">12.5</div>
            <div className="text-sm text-gray-600">Avg. Days</div>
          </div>
        </div>
      </div>
    </div>
  );
}