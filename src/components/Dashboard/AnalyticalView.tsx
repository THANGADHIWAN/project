import React, { useState } from 'react';
import { BarChart3, LineChart, PieChart, TrendingUp, Settings, Download } from 'lucide-react';

interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'stacked';
  icon: any;
  data: any[];
}

const chartConfigs: ChartConfig[] = [
  {
    id: 'investigations-by-status',
    title: 'Investigations by Status',
    type: 'pie',
    icon: PieChart,
    data: [
      { name: 'New', value: 12, color: '#6B7280' },
      { name: 'In Progress', value: 28, color: '#F59E0B' },
      { name: 'Under Review', value: 15, color: '#3B82F6' },
      { name: 'Closed', value: 45, color: '#10B981' }
    ]
  },
  {
    id: 'monthly-trends',
    title: 'Monthly Investigation Trends',
    type: 'line',
    icon: LineChart,
    data: [
      { month: 'Jan', investigations: 45, resolved: 38 },
      { month: 'Feb', investigations: 52, resolved: 41 },
      { month: 'Mar', investigations: 48, resolved: 44 },
      { month: 'Apr', investigations: 61, resolved: 52 },
      { month: 'May', investigations: 55, resolved: 48 },
      { month: 'Jun', investigations: 67, resolved: 59 }
    ]
  },
  {
    id: 'deviation-types',
    title: 'Deviation Types Distribution',
    type: 'bar',
    icon: BarChart3,
    data: [
      { type: 'OOS', count: 25, percentage: 35 },
      { type: 'Equipment', count: 18, percentage: 25 },
      { type: 'Procedural', count: 15, percentage: 21 },
      { type: 'Environmental', count: 8, percentage: 11 },
      { type: 'Contamination', count: 6, percentage: 8 }
    ]
  },
  {
    id: 'lab-efficiency',
    title: 'Lab Efficiency Metrics',
    type: 'stacked',
    icon: TrendingUp,
    data: [
      { metric: 'Sample Throughput', current: 85, target: 90 },
      { metric: 'On-Time Completion', current: 78, target: 85 },
      { metric: 'First-Pass Success', current: 92, target: 95 },
      { metric: 'Instrument Utilization', current: 88, target: 90 }
    ]
  }
];

export function AnalyticalView() {
  const [selectedCharts, setSelectedCharts] = useState<string[]>(['investigations-by-status', 'monthly-trends']);
  const [timeRange, setTimeRange] = useState('6months');

  const toggleChart = (chartId: string) => {
    setSelectedCharts(prev => 
      prev.includes(chartId)
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  const renderPieChart = (data: any[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-700">{item.name}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = (data: any[]) => {
    const maxValue = Math.max(...data.flatMap(d => [d.investigations, d.resolved]));
    const chartHeight = 200;
    const chartWidth = 400;
    const padding = 40;
    
    const xStep = (chartWidth - 2 * padding) / (data.length - 1);
    
    const getY = (value: number) => chartHeight - padding - ((value / maxValue) * (chartHeight - 2 * padding));
    
    const investigationsPath = data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${getY(d.investigations)}`
    ).join(' ');
    
    const resolvedPath = data.map((d, i) => 
      `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${getY(d.resolved)}`
    ).join(' ');
    
    return (
      <div className="h-64 p-4">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ratio * (chartHeight - 2 * padding)}
              x2={chartWidth - padding}
              y2={padding + ratio * (chartHeight - 2 * padding)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Lines */}
          <path d={investigationsPath} fill="none" stroke="#6B7280" strokeWidth="2" />
          <path d={resolvedPath} fill="none" stroke="#10B981" strokeWidth="2" />
          
          {/* Data points */}
          {data.map((d, i) => (
            <g key={i}>
              <circle cx={padding + i * xStep} cy={getY(d.investigations)} r="4" fill="#6B7280" />
              <circle cx={padding + i * xStep} cy={getY(d.resolved)} r="4" fill="#10B981" />
              <text x={padding + i * xStep} y={chartHeight - 10} textAnchor="middle" className="text-xs fill-gray-600">
                {d.month}
              </text>
            </g>
          ))}
        </svg>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Investigations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-700">Resolved</span>
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = (data: any[]) => {
    const maxValue = Math.max(...data.map(d => d.count));
    
    return (
      <div className="h-64 p-4">
        <div className="flex items-end justify-between h-48 space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '100%' }}>
                <div 
                  className="bg-gray-600 rounded-t transition-all duration-500"
                  style={{ 
                    height: `${(item.count / maxValue) * 100}%`,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                ></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white">
                  {item.count}
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-2 text-center">{item.type}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStackedChart = (data: any[]) => {
    return (
      <div className="h-64 p-4 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{item.metric}</span>
              <span className="text-gray-900 font-medium">{item.current}% / {item.target}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="relative h-full">
                <div 
                  className="bg-gray-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(item.current / item.target) * 100}%` }}
                ></div>
                <div 
                  className="absolute top-0 h-full bg-gray-300 rounded-full"
                  style={{ 
                    left: `${(item.current / item.target) * 100}%`,
                    width: `${100 - (item.current / item.target) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = (config: ChartConfig) => {
    switch (config.type) {
      case 'pie':
        return renderPieChart(config.data);
      case 'line':
        return renderLineChart(config.data);
      case 'bar':
        return renderBarChart(config.data);
      case 'stacked':
        return renderStackedChart(config.data);
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Analytics Configuration</h3>
            <p className="text-sm text-gray-500">Select charts and time range for analysis</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {/* Chart Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {chartConfigs.map((config) => {
            const Icon = config.icon;
            const isSelected = selectedCharts.includes(config.id);
            
            return (
              <button
                key={config.id}
                onClick={() => toggleChart(config.id)}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-gray-900' : 'text-gray-500'}`} />
                <div className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {config.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCharts.map((chartId) => {
          const config = chartConfigs.find(c => c.id === chartId);
          if (!config) return null;
          
          const Icon = config.icon;
          
          return (
            <div key={chartId} className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <h4 className="text-lg font-medium text-gray-900">{config.title}</h4>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
              {renderChart(config)}
            </div>
          );
        })}
      </div>
      
      {selectedCharts.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Selected</h3>
          <p className="text-gray-500">Select one or more chart types above to view analytics</p>
        </div>
      )}
    </div>
  );
}