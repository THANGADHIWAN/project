import React, { useState, useMemo } from 'react';
import { Plus, Download, Save, BarChart3, PieChart, TrendingUp, Activity, Grid3X3, X, Settings, Layout, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { Investigation } from '../../types/investigation';

interface InvestigationAnalyticsViewProps {
  investigations: Investigation[];
}

interface AnalyticsWidget {
  id: string;
  title: string;
  type: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data?: any;
}

interface ChartData {
  labels: string[];
  data: number[];
  colors?: string[];
  color?: string;
  value?: number;
  total?: number;
  percentage?: number;
}

const availableCharts = [
  { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', icon: PieChart, category: 'Status' },
  { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', icon: PieChart, category: 'Priority' },
  { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', icon: TrendingUp, category: 'Trends' },
  { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', icon: BarChart3, category: 'Resources' },
  { id: 'age-distribution', title: 'Investigation Age Distribution', type: 'histogram', icon: BarChart3, category: 'Time' },
  { id: 'monthly-volume', title: 'Monthly Investigation Volume', type: 'area', icon: Activity, category: 'Volume' },
  { id: 'department-split', title: 'Department-wise Split', type: 'treemap', icon: Grid3X3, category: 'Organization' },
  { id: 'time-to-closure', title: 'Average Time to Closure', type: 'gauge', icon: Activity, category: 'Performance' },
  { id: 'overdue-analysis', title: 'Overdue Analysis', type: 'scatter', icon: TrendingUp, category: 'Risk' },
  { id: 'repeat-incidents', title: 'Repeat Incidents Count', type: 'heatmap', icon: Grid3X3, category: 'Quality' },
  { id: 'capa-effectiveness', title: 'CAPA Effectiveness Rate', type: 'progress', icon: BarChart3, category: 'Quality' },
  { id: 'investigation-funnel', title: 'Investigation Outcomes Funnel', type: 'funnel', icon: TrendingUp, category: 'Process' },
  { id: 'seasonal-patterns', title: 'Seasonal Investigation Patterns', type: 'radar', icon: Activity, category: 'Trends' },
  { id: 'root-cause-frequency', title: 'Root Cause Frequency', type: 'wordcloud', icon: PieChart, category: 'Analysis' },
  { id: 'sla-compliance', title: 'SLA Compliance Rate', type: 'gauge', icon: Activity, category: 'Performance' },
  { id: 'investigation-complexity', title: 'Investigation Complexity Matrix', type: 'bubble', icon: Grid3X3, category: 'Analysis' },
  { id: 'resource-utilization', title: 'Resource Utilization', type: 'stacked-bar', icon: BarChart3, category: 'Resources' },
  { id: 'quality-metrics', title: 'Quality Metrics Dashboard', type: 'multi-metric', icon: Activity, category: 'Quality' },
  { id: 'trend-correlation', title: 'Trend Correlation Analysis', type: 'correlation', icon: TrendingUp, category: 'Analysis' },
  { id: 'performance-scorecard', title: 'Performance Scorecard', type: 'scorecard', icon: BarChart3, category: 'Performance' }
];

const predefinedLayouts = {
  'Executive Summary': [
    { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', size: 'medium' as const, position: { x: 0, y: 0 } },
    { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', size: 'medium' as const, position: { x: 1, y: 0 } },
    { id: 'sla-compliance', title: 'SLA Compliance Rate', type: 'gauge', size: 'medium' as const, position: { x: 2, y: 0 } },
    { id: 'performance-scorecard', title: 'Performance Scorecard', type: 'scorecard', size: 'large' as const, position: { x: 0, y: 1 } }
  ],
  'Operational View': [
    { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', size: 'large' as const, position: { x: 0, y: 0 } },
    { id: 'overdue-analysis', title: 'Overdue Analysis', type: 'scatter', size: 'medium' as const, position: { x: 2, y: 0 } },
    { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', size: 'large' as const, position: { x: 0, y: 1 } },
    { id: 'resource-utilization', title: 'Resource Utilization', type: 'stacked-bar', size: 'medium' as const, position: { x: 2, y: 1 } }
  ],
  'Quality Focus': [
    { id: 'capa-effectiveness', title: 'CAPA Effectiveness Rate', type: 'progress', size: 'medium' as const, position: { x: 0, y: 0 } },
    { id: 'repeat-incidents', title: 'Repeat Incidents Count', type: 'heatmap', size: 'medium' as const, position: { x: 1, y: 0 } },
    { id: 'root-cause-frequency', title: 'Root Cause Frequency', type: 'wordcloud', size: 'medium' as const, position: { x: 2, y: 0 } },
    { id: 'quality-metrics', title: 'Quality Metrics Dashboard', type: 'multi-metric', size: 'large' as const, position: { x: 0, y: 1 } }
  ]
};

export function InvestigationAnalyticsView({ investigations }: InvestigationAnalyticsViewProps) {
  const [activeWidgets, setActiveWidgets] = useState<AnalyticsWidget[]>([
    { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', size: 'medium', position: { x: 0, y: 0 } },
    { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', size: 'medium', position: { x: 1, y: 0 } },
    { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', size: 'large', position: { x: 2, y: 0 } },
    { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', size: 'medium', position: { x: 0, y: 1 } }
  ]);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentLayout, setCurrentLayout] = useState<string>('Custom');
  const [isGridMode, setIsGridMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized analytics data
  const analyticsData = useMemo(() => {
    const statusCounts = investigations.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = investigations.reduce((acc, inv) => {
      acc[inv.priority] = (acc[inv.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assigneeCounts = investigations.reduce((acc, inv) => {
      acc[inv.assignedTo] = (acc[inv.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overdue = investigations.filter(inv => {
      const daysRemaining = Math.ceil((new Date(inv.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysRemaining < 0;
    }).length;

    const avgProgress = investigations.length > 0 
      ? Math.round(investigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / investigations.length)
      : 0;

    return {
      statusCounts,
      priorityCounts,
      assigneeCounts,
      overdue,
      avgProgress,
      total: investigations.length
    };
  }, [investigations]);

  const generateChartData = (type: string, chartId: string): ChartData => {
    switch (chartId) {
      case 'status-distribution':
        return {
          labels: Object.keys(analyticsData.statusCounts),
          data: Object.values(analyticsData.statusCounts),
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280', '#374151']
        };
      case 'priority-breakdown':
        return {
          labels: Object.keys(analyticsData.priorityCounts),
          data: Object.values(analyticsData.priorityCounts),
          colors: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981']
        };
      case 'workload-distribution':
        return {
          labels: Object.keys(analyticsData.assigneeCounts),
          data: Object.values(analyticsData.assigneeCounts),
          color: '#3B82F6'
        };
      case 'sla-compliance':
        const compliance = Math.round(((analyticsData.total - analyticsData.overdue) / analyticsData.total) * 100);
        return {
          labels: ['Compliance'],
          data: [compliance],
          value: compliance,
          total: 100,
          percentage: compliance
        };
      case 'capa-effectiveness':
        return {
          labels: ['Effectiveness'],
          data: [87],
          value: 87,
          total: 100,
          percentage: 87
        };
      default:
        return {
          labels: ['Sample'],
          data: [100],
          colors: ['#3B82F6']
        };
    }
  };

  const addWidget = (chartId: string) => {
    const chart = availableCharts.find(c => c.id === chartId);
    if (chart && !activeWidgets.find(w => w.id === chartId)) {
      const newWidget: AnalyticsWidget = {
        id: chart.id,
        title: chart.title,
        type: chart.type,
        size: 'medium',
        position: { x: activeWidgets.length % 3, y: Math.floor(activeWidgets.length / 3) }
      };
      setActiveWidgets(prev => [...prev, newWidget]);
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

  const loadLayout = (layoutName: string) => {
    if (layoutName in predefinedLayouts) {
      setActiveWidgets(predefinedLayouts[layoutName as keyof typeof predefinedLayouts]);
      setCurrentLayout(layoutName);
    }
  };

  const exportToPDF = async () => {
    setRefreshing(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Exporting analytics to PDF...');
    setRefreshing(false);
  };

  const saveLayout = () => {
    const layoutName = prompt('Enter layout name:');
    if (layoutName) {
      console.log('Layout saved:', layoutName, activeWidgets);
      setCurrentLayout(layoutName);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getWidgetSizeClass = (size: string) => {
    if (!isGridMode) return 'w-full';
    switch (size) {
      case 'small': return 'col-span-1 row-span-1';
      case 'large': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  const renderChart = (widget: AnalyticsWidget) => {
    const data = generateChartData(widget.type, widget.id);
    
    switch (widget.type) {
      case 'pie':
      case 'donut':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {data.data.map((value, index) => {
                    const total = data.data.reduce((a, b) => a + b, 0);
                    const percentage = (value / total) * 100;
                    const strokeDasharray = `${percentage} ${100 - percentage}`;
                    const strokeDashoffset = data.data.slice(0, index).reduce((acc, val) => acc + (val / total) * 100, 0);
                    
                    return (
                      <circle
                        key={index}
                        cx="50"
                        cy="50"
                        r="15"
                        fill="none"
                        stroke={data.colors?.[index] || '#3B82F6'}
                        strokeWidth="8"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={-strokeDashoffset}
                        className="transition-all duration-300"
                      />
                    );
                  })}
                </svg>
                {widget.type === 'donut' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{data.data.reduce((a, b) => a + b, 0)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: data.colors?.[index] || '#3B82F6' }}
                    />
                    <span className="text-gray-600 capitalize">{label.replace('-', ' ')}</span>
                  </div>
                  <span className="font-medium text-gray-900">{data.data[index]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'bar':
        const maxValue = Math.max(...data.data);
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-end justify-center space-x-2 pb-4">
              {data.data.map((value, index) => (
                <div key={index} className="flex flex-col items-center space-y-1">
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-500 w-8"
                    style={{ height: `${(value / maxValue) * 120}px` }}
                  />
                  <span className="text-xs text-gray-600 transform rotate-45 origin-left">
                    {data.labels[index].split(' ')[0]}
                  </span>
                  <span className="text-xs font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'gauge':
        const percentage = data.percentage || 0;
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900">{percentage}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">{widget.title.split(' ').slice(-2).join(' ')}</p>
          </div>
        );
      
      case 'line':
        return (
          <div className="h-full flex items-center justify-center">
            <div className="w-full h-32">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                <polyline
                  points="10,60 50,40 90,45 130,25 170,30"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />
                {[10, 50, 90, 130, 170].map((x, index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={[60, 40, 45, 25, 30][index]}
                    r="3"
                    fill="#3B82F6"
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {widget.type.replace('-', ' ')} Chart
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Interactive visualization
              </p>
            </div>
          </div>
        );
    }
  };

  const categories = ['all', ...Array.from(new Set(availableCharts.map(chart => chart.category)))];
  const filteredCharts = selectedCategory === 'all' 
    ? availableCharts 
    : availableCharts.filter(chart => chart.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Investigation Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Comprehensive data visualization and insights</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={currentLayout}
              onChange={(e) => loadLayout(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="Custom">Custom Layout</option>
              {Object.keys(predefinedLayouts).map((layout) => (
                <option key={layout} value={layout}>{layout}</option>
              ))}
            </select>
            
            <button
              onClick={() => setIsGridMode(!isGridMode)}
              className={`px-3 py-2 border rounded-lg text-sm flex items-center space-x-2 ${
                isGridMode ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Layout className="h-4 w-4" />
              <span>{isGridMode ? 'Grid' : 'List'}</span>
            </button>
            
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={saveLayout}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Layout</span>
            </button>
            
            <button
              onClick={exportToPDF}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{refreshing ? 'Exporting...' : 'Export PDF'}</span>
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

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analyticsData.total}</div>
            <div className="text-sm text-gray-600">Total Investigations</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analyticsData.statusCounts.completed || 0}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {analyticsData.statusCounts['in-progress'] || 0}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{analyticsData.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analyticsData.avgProgress}%</div>
            <div className="text-sm text-gray-600">Avg. Progress</div>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">12.5</div>
            <div className="text-sm text-gray-600">Avg. Days</div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className={isGridMode 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-6"
      }>
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
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                  <button
                    onClick={() => removeWidget(widget.id)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className={`p-4 ${widget.size === 'large' ? 'h-80' : widget.size === 'small' ? 'h-48' : 'h-64'}`}>
              {renderChart(widget)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Selector Modal */}
      {showChartSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Visualization</h3>
              <button
                onClick={() => setShowChartSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCharts.map((chart) => {
                const Icon = chart.icon;
                const isActive = activeWidgets.some(w => w.id === chart.id);
                
                return (
                  <button
                    key={chart.id}
                    onClick={() => !isActive && addWidget(chart.id)}
                    disabled={isActive}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      isActive 
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-gray-400' : 'text-blue-600'}`} />
                      <span className="text-sm font-medium text-gray-900">{chart.title}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-600 capitalize">{chart.type.replace('-', ' ')} • {chart.category}</p>
                      {isActive && (
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Added</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}