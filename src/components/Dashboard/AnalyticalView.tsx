import React, { useState, useCallback, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Plus, X, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'gauge';
  title: string;
  dataKey: string;
  width: number;
  height: number;
}

const analyticsOptions = [
  { id: 'test-outcomes', label: 'Test Outcomes', type: 'pie' as const },
  { id: 'lab-efficiency', label: 'Lab Efficiency', type: 'line' as const },
  { id: 'capa-aging', label: 'CAPA Aging', type: 'bar' as const },
  { id: 'instrument-utilization', label: 'Instrument Utilization', type: 'bar' as const },
  { id: 'deviation-trends', label: 'Deviation Trends', type: 'line' as const },
  { id: 'analyst-performance', label: 'Analyst Performance', type: 'bar' as const },
  { id: 'method-distribution', label: 'Method Distribution', type: 'pie' as const },
  { id: 'priority-breakdown', label: 'Priority Breakdown', type: 'pie' as const }
];

const mockChartData = {
  'test-outcomes': [
    { name: 'Passed', value: 85, color: '#10B981' },
    { name: 'Failed', value: 12, color: '#EF4444' },
    { name: 'Pending', value: 3, color: '#F59E0B' }
  ],
  'lab-efficiency': [
    { month: 'Jan', efficiency: 92, target: 95 },
    { month: 'Feb', efficiency: 88, target: 95 },
    { month: 'Mar', efficiency: 94, target: 95 },
    { month: 'Apr', efficiency: 91, target: 95 },
    { month: 'May', efficiency: 96, target: 95 },
    { month: 'Jun', efficiency: 93, target: 95 }
  ],
  'capa-aging': [
    { range: '0-30 days', count: 15 },
    { range: '31-60 days', count: 8 },
    { range: '61-90 days', count: 3 },
    { range: '90+ days', count: 2 }
  ],
  'instrument-utilization': [
    { instrument: 'HPLC-001', utilization: 85 },
    { instrument: 'HPLC-002', utilization: 92 },
    { instrument: 'GC-001', utilization: 78 },
    { instrument: 'UV-001', utilization: 88 },
    { instrument: 'FTIR-001', utilization: 65 }
  ],
  'deviation-trends': [
    { month: 'Jan', deviations: 12 },
    { month: 'Feb', deviations: 8 },
    { month: 'Mar', deviations: 15 },
    { month: 'Apr', deviations: 6 },
    { month: 'May', deviations: 10 },
    { month: 'Jun', deviations: 9 }
  ],
  'analyst-performance': [
    { analyst: 'Dr. Chen', completed: 45, pending: 3 },
    { analyst: 'Dr. Johnson', completed: 38, pending: 5 },
    { analyst: 'Dr. Davis', completed: 42, pending: 2 },
    { analyst: 'Dr. Thompson', completed: 35, pending: 4 }
  ],
  'method-distribution': [
    { name: 'HPLC', value: 45, color: '#3B82F6' },
    { name: 'GC', value: 25, color: '#10B981' },
    { name: 'UV', value: 20, color: '#F59E0B' },
    { name: 'FTIR', value: 10, color: '#8B5CF6' }
  ],
  'priority-breakdown': [
    { name: 'Low', value: 35, color: '#10B981' },
    { name: 'Medium', value: 40, color: '#F59E0B' },
    { name: 'High', value: 20, color: '#F97316' },
    { name: 'Critical', value: 5, color: '#EF4444' }
  ]
};

export function AnalyticalView() {
  const [selectedCharts, setSelectedCharts] = useState<ChartConfig[]>([
    {
      id: 'test-outcomes',
      type: 'pie',
      title: 'Test Outcomes',
      dataKey: 'test-outcomes',
      width: 6,
      height: 300
    }
  ]);
  const [selectedAnalytic, setSelectedAnalytic] = useState('');

  const addChart = useCallback(() => {
    if (selectedAnalytic && selectedCharts.length < 5) {
      const option = analyticsOptions.find(opt => opt.id === selectedAnalytic);
      if (option && !selectedCharts.find(chart => chart.id === selectedAnalytic)) {
        const newChart: ChartConfig = {
          id: selectedAnalytic,
          type: option.type,
          title: option.label,
          dataKey: selectedAnalytic,
          width: 6,
          height: 300
        };
        setSelectedCharts(prev => [...prev, newChart]);
        setSelectedAnalytic('');
      }
    }
  }, [selectedAnalytic, selectedCharts]);

  const removeChart = useCallback((chartId: string) => {
    setSelectedCharts(prev => prev.filter(chart => chart.id !== chartId));
  }, []);

  const resizeChart = useCallback((chartId: string, newWidth: number) => {
    setSelectedCharts(prev => 
      prev.map(chart => 
        chart.id === chartId ? { ...chart, width: newWidth } : chart
      )
    );
  }, []);

  const downloadPDF = useCallback(async () => {
    const element = document.getElementById('analytics-canvas');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgWidth = 297;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('analytics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, []);

  const renderChart = useCallback((chart: ChartConfig) => {
    const data = mockChartData[chart.dataKey as keyof typeof mockChartData];
    
    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Bar dataKey="count" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilization" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="#6b7280" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#d1d5db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="efficiency" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280' }} />
              <Line type="monotone" dataKey="target" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#d1d5db' }} />
              <Line type="monotone" dataKey="deviations" stroke="#6b7280" strokeWidth={2} dot={{ fill: '#6b7280' }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={chart.height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#6b7280"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(data as any[]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="flex items-center justify-center h-full text-gray-500">Chart type not supported</div>;
    }
  }, []);

  const gridCols = useMemo(() => {
    return selectedCharts.reduce((total, chart) => total + chart.width, 0);
  }, [selectedCharts]);

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Controls */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedAnalytic}
              onChange={(e) => setSelectedAnalytic(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            >
              <option value="">Select Analytics</option>
              {analyticsOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={addChart}
              disabled={!selectedAnalytic || selectedCharts.length >= 5}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Add Chart</span>
            </button>
            <span className="text-sm text-gray-600">
              {selectedCharts.length}/5 charts
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedCharts([])}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Clear All</span>
            </button>
            <button
              onClick={downloadPDF}
              disabled={selectedCharts.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Canvas */}
      <div className="flex-1 overflow-auto p-6" id="analytics-canvas">
        {selectedCharts.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Charts Selected</h3>
              <p className="text-gray-600 mb-4">Choose analytics from the dropdown above to start building your dashboard.</p>
              <button
                onClick={() => {
                  setSelectedAnalytic('test-outcomes');
                  setTimeout(addChart, 100);
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Add Your First Chart
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6 auto-rows-min">
            {selectedCharts.map((chart) => (
              <div
                key={chart.id}
                className={`col-span-${chart.width} bg-white border border-gray-200 rounded-lg p-4`}
              >
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">{chart.title}</h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={chart.width}
                      onChange={(e) => resizeChart(chart.id, Number(e.target.value))}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value={4}>Small</option>
                      <option value={6}>Medium</option>
                      <option value={8}>Large</option>
                      <option value={12}>Full Width</option>
                    </select>
                    <button
                      onClick={() => removeChart(chart.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Chart Content */}
                <div className="h-64">
                  {renderChart(chart)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}