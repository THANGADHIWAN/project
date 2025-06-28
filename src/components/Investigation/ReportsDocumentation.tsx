import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter, BarChart3, PieChart, TrendingUp, Users, Plus } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { AdvancedFilters } from './AdvancedFilters';

interface ReportsDocumentationProps {
  onReportClick?: (id: string) => void;
}

interface Report {
  id: string;
  title: string;
  type: 'deviation' | 'investigation' | 'capa' | 'trend' | 'summary';
  status: 'draft' | 'pending-review' | 'approved' | 'published';
  createdBy: string;
  createdDate: string;
  lastModified: string;
  investigationIds: string[];
  fileSize: string;
  description: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'deviation' | 'investigation' | 'capa' | 'trend' | 'summary';
  fields: string[];
}

const mockReports: Report[] = [
  {
    id: 'RPT-2024-001',
    title: 'Monthly Deviation Summary - January 2024',
    type: 'summary',
    status: 'approved',
    createdBy: 'Sarah Wilson',
    createdDate: '2024-01-31T16:00:00Z',
    lastModified: '2024-01-31T16:00:00Z',
    investigationIds: ['INV-2024-001', 'INV-2024-002', 'INV-2024-003'],
    fileSize: '2.1 MB',
    description: 'Comprehensive summary of all deviations and investigations for January 2024'
  },
  {
    id: 'RPT-2024-002',
    title: 'Investigation Report - INV-2024-001',
    type: 'investigation',
    status: 'pending-review',
    createdBy: 'John Doe',
    createdDate: '2024-01-16T14:30:00Z',
    lastModified: '2024-01-16T14:30:00Z',
    investigationIds: ['INV-2024-001'],
    fileSize: '1.8 MB',
    description: 'Detailed investigation report for Out of Specification - Sample SM-2024-001'
  },
  {
    id: 'RPT-2024-003',
    title: 'CAPA Effectiveness Report - Q4 2023',
    type: 'capa',
    status: 'published',
    createdBy: 'Mike Johnson',
    createdDate: '2024-01-15T10:00:00Z',
    lastModified: '2024-01-15T10:00:00Z',
    investigationIds: ['INV-2023-045', 'INV-2023-046', 'INV-2023-047'],
    fileSize: '3.2 MB',
    description: 'Analysis of CAPA effectiveness for Q4 2023 investigations'
  },
  {
    id: 'RPT-2024-004',
    title: 'Trend Analysis - HPLC System Performance',
    type: 'trend',
    status: 'draft',
    createdBy: 'Emily Davis',
    createdDate: '2024-01-16T09:15:00Z',
    lastModified: '2024-01-16T11:45:00Z',
    investigationIds: ['INV-2024-001', 'INV-2024-002'],
    fileSize: '1.5 MB',
    description: 'Trend analysis of HPLC system performance and related deviations'
  }
];

const mockTemplates: ReportTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Deviation Investigation Report',
    description: 'Standard template for deviation investigation reports',
    type: 'investigation',
    fields: ['Investigation Summary', 'Root Cause Analysis', 'CAPA Actions', 'Conclusion']
  },
  {
    id: 'TPL-002',
    name: 'Monthly Summary Report',
    description: 'Monthly summary of all investigations and deviations',
    type: 'summary',
    fields: ['Executive Summary', 'Key Metrics', 'Trend Analysis', 'Action Items']
  },
  {
    id: 'TPL-003',
    name: 'CAPA Effectiveness Report',
    description: 'Template for evaluating CAPA effectiveness',
    type: 'capa',
    fields: ['CAPA Overview', 'Implementation Status', 'Effectiveness Metrics', 'Recommendations']
  },
  {
    id: 'TPL-004',
    name: 'Trend Analysis Report',
    description: 'Template for trend analysis and pattern identification',
    type: 'trend',
    fields: ['Data Analysis', 'Trend Identification', 'Risk Assessment', 'Preventive Measures']
  }
];

export function ReportsDocumentation({ onReportClick }: ReportsDocumentationProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'templates' | 'analytics'>('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'investigation':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'summary':
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'capa':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'trend':
        return <PieChart className="h-4 w-4 text-orange-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const generateReport = (templateId: string) => {
    console.log('Generating report from template:', templateId);
    // Create a new report ID
    const newReportId = `RPT-2024-${String(mockReports.length + 1).padStart(3, '0')}`;
    onReportClick?.(newReportId);
  };

  const handleAdvancedFilters = (filters: any) => {
    console.log('Applied advanced filters:', filters);
    // Implement advanced filtering logic here
  };

  const downloadReport = (reportId: string) => {
    // Simulate downloading a sample report
    const blob = new Blob(['Sample report content for ' + reportId], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportId}_sample_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reports & Documentation</h2>
              <p className="text-sm text-gray-600">Generate, manage, and analyze investigation reports</p>
            </div>
          </div>
          <button
            onClick={() => generateReport('TPL-001')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'templates', label: 'Templates', icon: BarChart3 },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reports' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="investigation">Investigation</option>
                    <option value="summary">Summary</option>
                    <option value="capa">CAPA</option>
                    <option value="trend">Trend Analysis</option>
                  </select>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending-review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAdvancedFilters(true)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Advanced Filter</span>
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>Export All</span>
                  </button>
                </div>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(report.type)}
                        <span className="text-xs font-medium text-gray-500 uppercase">{report.type}</span>
                      </div>
                      <StatusBadge 
                        status={report.status} 
                        type={report.status === 'approved' || report.status === 'published' ? 'approval' : 'action'} 
                      />
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 mb-2">{report.title}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created by {report.createdBy}</span>
                        <span>{report.fileSize}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(report.createdDate).toLocaleDateString()}
                      </div>
                      {report.investigationIds.length > 0 && (
                        <div className="text-xs text-blue-600">
                          {report.investigationIds.length} linked investigation(s)
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onReportClick?.(report.id)}
                        className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="px-3 py-2 border border-gray-300 rounded text-xs hover:bg-gray-50 flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(template.type)}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Template Fields:</p>
                      <div className="space-y-1">
                        {template.fields.map((field, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                            <span>{field}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateReport(template.id)}
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
                      >
                        Generate Report
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Reports</p>
                      <p className="text-3xl font-bold">{mockReports.length}</p>
                    </div>
                    <FileText className="h-12 w-12 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Published Reports</p>
                      <p className="text-3xl font-bold">{mockReports.filter(r => r.status === 'published').length}</p>
                    </div>
                    <BarChart3 className="h-12 w-12 text-green-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100">Avg. Generation Time</p>
                      <p className="text-3xl font-bold">2.5h</p>
                    </div>
                    <TrendingUp className="h-12 w-12 text-purple-200" />
                  </div>
                </div>
              </div>

              {/* Report Type Distribution */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Type Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['investigation', 'summary', 'capa', 'trend'].map((type) => {
                    const count = mockReports.filter(r => r.type === type).length;
                    const percentage = Math.round((count / mockReports.length) * 100);
                    
                    return (
                      <div key={type} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          {getTypeIcon(type)}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                        <p className="text-sm text-gray-600 capitalize">{type}</p>
                        <p className="text-xs text-gray-500">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Report Activity</h3>
                <div className="space-y-4">
                  {mockReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {getTypeIcon(report.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                        <p className="text-xs text-gray-500">
                          {report.createdBy} • {new Date(report.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <StatusBadge 
                          status={report.status} 
                          type={report.status === 'approved' || report.status === 'published' ? 'approval' : 'action'} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleAdvancedFilters}
        type="reports"
      />
    </div>
  );
}