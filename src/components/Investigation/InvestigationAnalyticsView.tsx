import React, { useState, useMemo } from 'react';
import { Plus, Download, BarChart3, PieChart, TrendingUp, Activity, X, RefreshCw, Calendar, Filter } from 'lucide-react';
import { Investigation } from '../../types/investigation';

interface InvestigationAnalyticsViewProps {
  investigations: Investigation[];
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

interface DateRange {
  start: string;
  end: string;
  preset: 'week' | 'month' | 'quarter' | 'year' | 'custom';
}

const availableCharts = [
  { id: 'status-distribution', title: 'Investigation Status Distribution', type: 'pie', icon: PieChart, category: 'Status' },
  { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', icon: PieChart, category: 'Priority' },
  { id: 'completion-trend', title: 'Completion Trend Over Time', type: 'line', icon: TrendingUp, category: 'Trends' },
  { id: 'workload-distribution', title: 'Investigator Workload', type: 'bar', icon: BarChart3, category: 'Resources' },
  { id: 'age-distribution', title: 'Investigation Age Distribution', type: 'histogram', icon: BarChart3, category: 'Time' },
  { id: 'monthly-volume', title: 'Monthly Investigation Volume', type: 'area', icon: Activity, category: 'Volume' },
  { id: 'time-to-closure', title: 'Average Time to Closure', type: 'gauge', icon: Activity, category: 'Performance' },
  { id: 'overdue-analysis', title: 'Overdue Analysis', type: 'scatter', icon: TrendingUp, category: 'Risk' },
  { id: 'capa-effectiveness', title: 'CAPA Effectiveness Rate', type: 'progress', icon: BarChart3, category: 'Quality' },
  { id: 'investigation-funnel', title: 'Investigation Outcomes Funnel', type: 'funnel', icon: TrendingUp, category: 'Process' }
];

export function InvestigationAnalyticsView({ investigations }: InvestigationAnalyticsViewProps) {
  const [activeCharts, setActiveCharts] = useState<string[]>([
    'status-distribution',
    'priority-breakdown', 
    'completion-trend',
    'workload-distribution',
    'monthly-volume'
  ]);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    preset: 'month'
  });

  // Filter investigations by date range
  const filteredInvestigations = useMemo(() => {
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    
    return investigations.filter(inv => {
      const createdDate = new Date(inv.createdAt);
      return createdDate >= startDate && createdDate <= endDate;
    });
  }, [investigations, dateRange]);

  // Memoized analytics data
  const analyticsData = useMemo(() => {
    const statusCounts = filteredInvestigations.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = filteredInvestigations.reduce((acc, inv) => {
      acc[inv.priority] = (acc[inv.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assigneeCounts = filteredInvestigations.reduce((acc, inv) => {
      acc[inv.assignedTo] = (acc[inv.assignedTo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overdue = filteredInvestigations.filter(inv => {
      const daysRemaining = Math.ceil((new Date(inv.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysRemaining < 0;
    }).length;

    const avgProgress = filteredInvestigations.length > 0 
      ? Math.round(filteredInvestigations.reduce((acc, inv) => acc + inv.completionPercentage, 0) / filteredInvestigations.length)
      : 0;

    // Monthly volume data
    const monthlyData = filteredInvestigations.reduce((acc, inv) => {
      const month = new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      statusCounts,
      priorityCounts,
      assigneeCounts,
      overdue,
      avgProgress,
      total: filteredInvestigations.length,
      monthlyData
    };
  }, [filteredInvestigations]);

  const generateChartData = (chartId: string): ChartData => {
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
      case 'monthly-volume':
        return {
          labels: Object.keys(analyticsData.monthlyData),
          data: Object.values(analyticsData.monthlyData),
          color: '#10B981'
        };
      case 'time-to-closure':
        return {
          labels: ['Avg Days'],
          data: [12.5],
          value: 12.5,
          total: 30,
          percentage: Math.round((12.5 / 30) * 100)
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

  const addChart = (chartId: string) => {
    if (!activeCharts.includes(chartId)) {
      setActiveCharts(prev => [...prev, chartId]);
    }
    setShowChartSelector(false);
  };

  const removeChart = (chartId: string) => {
    setActiveCharts(prev => prev.filter(id => id !== chartId));
  };

  const exportToPDF = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Exporting analytics to PDF...');
    
    // Create sample PDF content
    const pdfContent = `
Investigation Analytics Report
Generated: ${new Date().toLocaleString()}
Date Range: ${dateRange.start} to ${dateRange.end}

Key Metrics:
- Total Investigations: ${analyticsData.total}
- Completed: ${analyticsData.statusCounts.completed || 0}
- In Progress: ${analyticsData.statusCounts['in-progress'] || 0}
- Overdue: ${analyticsData.overdue}
- Average Progress: ${analyticsData.avgProgress}%

Status Distribution:
${Object.entries(analyticsData.statusCounts).map(([status, count]) => `- ${status}: ${count}`).join('\n')}

Priority Breakdown:
${Object.entries(analyticsData.priorityCounts).map(([priority, count]) => `- ${priority}: ${count}`).join('\n')}
    `;
    
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investigation_analytics_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setRefreshing(false);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const setDatePreset = (preset: DateRange['preset']) => {
    const now = new Date();
    let start: Date;
    
    switch (preset) {
      case 'week':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0],
      preset
    });
  };

  const renderChart = (chartId: string) => {
    const chart = availableCharts.find(c => c.id === chartId);
    const data = generateChartData(chartId);
    
    if (!chart) return null;
    
    switch (chart.type) {
      case 'pie':
      case 'donut':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {data.data.map((value, index) => {
                    const total = data.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (value / total) * 100 : 0;
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
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>
                {chart.type === 'donut' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{data.data.reduce((a, b) => a + b, 0)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {data.labels.map((label, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
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
        const maxValue = Math.max(...data.data, 1);
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-end justify-center space-x-3 pb-6">
              {data.data.map((value, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="bg-blue-500 rounded-t transition-all duration-700 w-12 flex items-end justify-center text-white text-xs font-medium pb-1"
                    style={{ height: `${Math.max((value / maxValue) * 150, 20)}px` }}
                  >
                    {value > 0 && value}
                  </div>
                  <span className="text-xs text-gray-600 text-center max-w-16 leading-tight">
                    {data.labels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'line':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline
                  points="30,80 80,60 130,65 180,45 230,50 280,40"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  className="transition-all duration-1000"
                />
                <polygon
                  points="30,80 80,60 130,65 180,45 230,50 280,40 280,100 30,100"
                  fill="url(#lineGradient)"
                  className="transition-all duration-1000"
                />
                {[30, 80, 130, 180, 230, 280].map((x, index) => (
                  <circle
                    key={index}
                    cx={x}
                    cy={[80, 60, 65, 45, 50, 40][index]}
                    r="4"
                    fill="#3B82F6"
                    className="transition-all duration-1000"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
      case 'area':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <path
                  d="M30,90 Q80,70 130,75 T230,55 L280,50 L280,100 L30,100 Z"
                  fill="url(#areaGradient)"
                  stroke="#10B981"
                  strokeWidth="2"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
          </div>
        );
      
      case 'gauge':
        const percentage = data.percentage || 0;
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="relative w-32 h-32">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{data.value}</span>
                <span className="text-xs text-gray-500">
                  {chartId === 'time-to-closure' ? 'days' : '%'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">{chart.title.split(' ').slice(-3).join(' ')}</p>
          </div>
        );
      
      case 'scatter':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {Array.from({ length: 20 }, (_, i) => (
                  <circle
                    key={i}
                    cx={30 + (i * 12)}
                    cy={30 + Math.random() * 60}
                    r={2 + Math.random() * 3}
                    fill="#EF4444"
                    opacity={0.7}
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {chart.type.replace('-', ' ')} Chart
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
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select 
                value={dateRange.preset}
                onChange={(e) => setDatePreset(e.target.value as DateRange['preset'])}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {dateRange.preset === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={exportToPDF}
              disabled={refreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{refreshing ? 'Exporting...' : 'Export'}</span>
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

      {/* Key Metrics */}
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCharts.map((chartId) => {
          const chart = availableCharts.find(c => c.id === chartId);
          if (!chart) return null;
          
          return (
            <div key={chartId} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">{chart.title}</h3>
                  <button
                    onClick={() => removeChart(chartId)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 h-64">
                {renderChart(chartId)}
              </div>
            </div>
          );
        })}
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
                const isActive = activeCharts.includes(chart.id);
                
                return (
                  <button
                    key={chart.id}
                    onClick={() => !isActive && addChart(chart.id)}
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