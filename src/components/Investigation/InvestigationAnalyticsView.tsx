import React, { useState, useMemo } from 'react';
import { Plus, Download, BarChart3, PieChart, TrendingUp, Activity, X, RefreshCw, Calendar, Filter, LineChart, Zap, Target, Users, Clock, AlertTriangle } from 'lucide-react';
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
  { id: 'investigations-over-time', title: 'Investigations Over Time', type: 'line', icon: TrendingUp, category: 'Trends' },
  { id: 'status-distribution', title: 'Status Distribution', type: 'pie', icon: PieChart, category: 'Status' },
  { id: 'priority-breakdown', title: 'Priority Breakdown', type: 'donut', icon: Target, category: 'Priority' },
  { id: 'investigator-workload', title: 'Investigator Workload', type: 'bar', icon: Users, category: 'Resources' },
  { id: 'time-to-closure', title: 'Time to Closure Trends', type: 'area', icon: Clock, category: 'Performance' },
  { id: 'department-analysis', title: 'Department Analysis', type: 'horizontal-bar', icon: BarChart3, category: 'Department' },
  { id: 'root-cause-frequency', title: 'Root Cause Frequency', type: 'bubble', icon: AlertTriangle, category: 'Quality' },
  { id: 'investigation-age', title: 'Investigation Age Distribution', type: 'histogram', icon: Activity, category: 'Time' },
  { id: 'repeat-incidents', title: 'Repeat Incidents Heatmap', type: 'heatmap', icon: Zap, category: 'Risk' },
  { id: 'capa-effectiveness', title: 'CAPA Effectiveness Rate', type: 'gauge', icon: Target, category: 'Quality' },
  { id: 'monthly-volume', title: 'Monthly Investigation Volume', type: 'column', icon: BarChart3, category: 'Volume' },
  { id: 'outcome-funnel', title: 'Investigation Outcomes Funnel', type: 'funnel', icon: TrendingUp, category: 'Process' },
  { id: 'deviation-correlation', title: 'Deviation Type Correlation', type: 'scatter', icon: Activity, category: 'Analysis' },
  { id: 'shift-analysis', title: 'Incident Count by Shift', type: 'radar', icon: Clock, category: 'Operations' },
  { id: 'delay-trends', title: 'Weekly Delay Trends', type: 'step-line', icon: TrendingUp, category: 'Performance' }
];

export function InvestigationAnalyticsView({ investigations }: InvestigationAnalyticsViewProps) {
  const [activeCharts, setActiveCharts] = useState<string[]>([
    'investigations-over-time',
    'status-distribution', 
    'priority-breakdown',
    'investigator-workload',
    'time-to-closure'
  ]);
  const [showChartSelector, setShowChartSelector] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
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

    // Time series data for trends
    const timeSeriesData = filteredInvestigations.reduce((acc, inv) => {
      const date = new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Department analysis (simulated)
    const departments = ['QC Lab', 'QA Department', 'Production', 'R&D', 'Regulatory'];
    const departmentData = departments.reduce((acc, dept) => {
      acc[dept] = Math.floor(Math.random() * 15) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      statusCounts,
      priorityCounts,
      assigneeCounts,
      overdue,
      avgProgress,
      total: filteredInvestigations.length,
      timeSeriesData,
      departmentData
    };
  }, [filteredInvestigations]);

  const generateChartData = (chartId: string): ChartData => {
    switch (chartId) {
      case 'investigations-over-time':
        return {
          labels: Object.keys(analyticsData.timeSeriesData),
          data: Object.values(analyticsData.timeSeriesData),
          color: '#3B82F6'
        };
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
      case 'investigator-workload':
        return {
          labels: Object.keys(analyticsData.assigneeCounts),
          data: Object.values(analyticsData.assigneeCounts),
          color: '#8B5CF6'
        };
      case 'time-to-closure':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [12.5, 11.8, 13.2, 10.9],
          color: '#10B981'
        };
      case 'department-analysis':
        return {
          labels: Object.keys(analyticsData.departmentData),
          data: Object.values(analyticsData.departmentData),
          color: '#F59E0B'
        };
      case 'capa-effectiveness':
        return {
          labels: ['Effectiveness'],
          data: [87],
          value: 87,
          total: 100,
          percentage: 87
        };
      case 'monthly-volume':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [23, 19, 31, 28, 25, 22],
          color: '#06B6D4'
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

Active Charts: ${activeCharts.length}
${activeCharts.map(id => `- ${availableCharts.find(c => c.id === id)?.title || id}`).join('\n')}
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
      case 'line':
      case 'step-line':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-48">
              <svg viewBox="0 0 400 160" className="w-full h-full">
                <defs>
                  <linearGradient id={`lineGradient-${chartId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={data.color || '#3B82F6'} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={data.color || '#3B82F6'} stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline
                  points={data.data.map((value, index) => 
                    `${50 + (index * 300 / (data.data.length - 1))},${140 - (value / Math.max(...data.data)) * 80}`
                  ).join(' ')}
                  fill="none"
                  stroke={data.color || '#3B82F6'}
                  strokeWidth="3"
                  className="transition-all duration-1000"
                />
                <polygon
                  points={`50,140 ${data.data.map((value, index) => 
                    `${50 + (index * 300 / (data.data.length - 1))},${140 - (value / Math.max(...data.data)) * 80}`
                  ).join(' ')} 350,140`}
                  fill={`url(#lineGradient-${chartId})`}
                  className="transition-all duration-1000"
                />
                {data.data.map((value, index) => (
                  <circle
                    key={index}
                    cx={50 + (index * 300 / (data.data.length - 1))}
                    cy={140 - (value / Math.max(...data.data)) * 80}
                    r="4"
                    fill={data.color || '#3B82F6'}
                    className="transition-all duration-1000"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
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
                        r={chart.type === 'donut' ? "15" : "20"}
                        fill="none"
                        stroke={data.colors?.[index] || '#3B82F6'}
                        strokeWidth={chart.type === 'donut' ? "8" : "12"}
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
            <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
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
      case 'column':
        const maxValue = Math.max(...data.data, 1);
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-end justify-center space-x-2 pb-6">
              {data.data.map((value, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="rounded-t transition-all duration-700 w-8 flex items-end justify-center text-white text-xs font-medium pb-1"
                    style={{ 
                      height: `${Math.max((value / maxValue) * 120, 20)}px`,
                      backgroundColor: data.color || '#3B82F6'
                    }}
                  >
                    {value > 0 && value}
                  </div>
                  <span className="text-xs text-gray-600 text-center max-w-12 leading-tight">
                    {data.labels[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'horizontal-bar':
        const maxHorizontalValue = Math.max(...data.data, 1);
        return (
          <div className="h-full flex flex-col justify-center space-y-3 p-4">
            {data.data.map((value, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-xs text-gray-600 w-16 text-right">{data.labels[index]}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ 
                      width: `${(value / maxHorizontalValue) * 100}%`,
                      backgroundColor: data.color || '#F59E0B'
                    }}
                  >
                    <span className="text-xs text-white font-medium">{value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'area':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                <defs>
                  <linearGradient id={`areaGradient-${chartId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={data.color || '#10B981'} stopOpacity="0.6"/>
                    <stop offset="100%" stopColor={data.color || '#10B981'} stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                <path
                  d={`M30,90 ${data.data.map((value, index) => 
                    `L${30 + (index * 240 / (data.data.length - 1))},${90 - (value / Math.max(...data.data)) * 60}`
                  ).join(' ')} L270,90 Z`}
                  fill={`url(#areaGradient-${chartId})`}
                  stroke={data.color || '#10B981'}
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
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center">{chart.title.split(' ').slice(-2).join(' ')}</p>
          </div>
        );

      case 'scatter':
      case 'bubble':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full h-40">
              <svg viewBox="0 0 300 120" className="w-full h-full">
                {Array.from({ length: 20 }, (_, i) => (
                  <circle
                    key={i}
                    cx={30 + (i * 12)}
                    cy={30 + Math.random() * 60}
                    r={chart.type === 'bubble' ? 2 + Math.random() * 4 : 3}
                    fill={data.color || '#EF4444'}
                    opacity={0.7}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div className="h-full p-4">
            <div className="grid grid-cols-7 gap-1 h-full">
              {Array.from({ length: 35 }, (_, i) => (
                <div
                  key={i}
                  className="rounded transition-all duration-300"
                  style={{
                    backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8 + 0.1})`
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'radar':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon
                  points="50,10 80,30 80,70 50,90 20,70 20,30"
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                <polygon
                  points="50,20 70,35 70,65 50,80 30,65 30,35"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 30 * Math.cos((i * Math.PI) / 3 - Math.PI / 2)}
                    y2={50 + 30 * Math.sin((i * Math.PI) / 3 - Math.PI / 2)}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                  />
                ))}
              </svg>
            </div>
          </div>
        );

      case 'funnel':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 p-4">
            {data.data.map((value, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="h-8 rounded transition-all duration-700 flex items-center justify-center text-white text-sm font-medium"
                  style={{ 
                    width: `${(value / Math.max(...data.data)) * 100}%`,
                    backgroundColor: data.colors?.[index] || '#8B5CF6'
                  }}
                >
                  {value}
                </div>
                <span className="text-sm text-gray-600">{data.labels[index]}</span>
              </div>
            ))}
          </div>
        );

      case 'histogram':
        return (
          <div className="h-full flex items-end justify-center space-x-1 pb-6 p-4">
            {data.data.map((value, index) => (
              <div
                key={index}
                className="transition-all duration-700 w-6 rounded-t"
                style={{ 
                  height: `${(value / Math.max(...data.data)) * 100}%`,
                  backgroundColor: data.color || '#06B6D4'
                }}
              />
            ))}
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

  // Auto-refresh effect
  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
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

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto Refresh</span>
            </label>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowChartSelector(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chart</span>
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
              onClick={refreshData}
              disabled={refreshing}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCharts.map((chart) => {
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