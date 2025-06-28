import React, { useState } from 'react';
import { FileText, Edit, Eye, Download, Upload, Clock, CheckCircle, AlertTriangle, GitBranch, User } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

interface SOPManagementProps {
  onSOPClick?: (id: string) => void;
}

interface SOPDocument {
  id: string;
  title: string;
  version: string;
  status: 'draft' | 'under-review' | 'approved' | 'obsolete';
  category: string;
  lastModified: string;
  modifiedBy: string;
  approvedBy: string;
  approvalDate: string;
  nextReview: string;
  linkedInvestigations: string[];
  changeReason: string;
  fileSize: string;
}

interface SOPVersion {
  version: string;
  date: string;
  author: string;
  changes: string;
  status: 'draft' | 'approved' | 'obsolete';
}

const mockSOPs: SOPDocument[] = [
  {
    id: 'SOP-QC-001',
    title: 'HPLC Analysis for Active Pharmaceutical Ingredients',
    version: '3.1',
    status: 'under-review',
    category: 'Quality Control',
    lastModified: '2024-01-16T14:30:00Z',
    modifiedBy: 'John Doe',
    approvedBy: 'Sarah Wilson',
    approvalDate: '2024-01-10T10:00:00Z',
    nextReview: '2025-01-10T00:00:00Z',
    linkedInvestigations: ['INV-2024-001', 'INV-2024-003'],
    changeReason: 'Updated column lifecycle monitoring procedures',
    fileSize: '2.4 MB'
  },
  {
    id: 'SOP-QC-002',
    title: 'Sample Storage and Handling Procedures',
    version: '2.0',
    status: 'approved',
    category: 'Quality Control',
    lastModified: '2024-01-15T09:15:00Z',
    modifiedBy: 'Emily Davis',
    approvedBy: 'Mike Johnson',
    approvalDate: '2024-01-15T16:00:00Z',
    nextReview: '2025-01-15T00:00:00Z',
    linkedInvestigations: ['INV-2024-002'],
    changeReason: 'Added temperature monitoring requirements',
    fileSize: '1.8 MB'
  },
  {
    id: 'SOP-QC-003',
    title: 'Deviation Investigation and Reporting',
    version: '1.5',
    status: 'draft',
    category: 'Quality Assurance',
    lastModified: '2024-01-16T11:45:00Z',
    modifiedBy: 'Alex Thompson',
    approvedBy: '',
    approvalDate: '',
    nextReview: '2025-01-01T00:00:00Z',
    linkedInvestigations: ['INV-2024-001', 'INV-2024-004'],
    changeReason: 'Incorporating MHRA decision tree workflow',
    fileSize: '3.1 MB'
  },
  {
    id: 'SOP-QC-004',
    title: 'Equipment Calibration and Maintenance',
    version: '4.0',
    status: 'approved',
    category: 'Equipment Management',
    lastModified: '2024-01-12T13:20:00Z',
    modifiedBy: 'Lisa Garcia',
    approvedBy: 'Robert Brown',
    approvalDate: '2024-01-12T17:30:00Z',
    nextReview: '2025-01-12T00:00:00Z',
    linkedInvestigations: [],
    changeReason: 'Updated calibration frequencies',
    fileSize: '2.7 MB'
  }
];

const mockVersionHistory: Record<string, SOPVersion[]> = {
  'SOP-QC-001': [
    {
      version: '3.1',
      date: '2024-01-16T14:30:00Z',
      author: 'John Doe',
      changes: 'Updated column lifecycle monitoring procedures',
      status: 'under-review'
    },
    {
      version: '3.0',
      date: '2024-01-10T10:00:00Z',
      author: 'John Doe',
      changes: 'Added system suitability requirements',
      status: 'approved'
    },
    {
      version: '2.1',
      date: '2023-12-15T09:00:00Z',
      author: 'Sarah Wilson',
      changes: 'Updated mobile phase preparation',
      status: 'obsolete'
    },
    {
      version: '2.0',
      date: '2023-11-01T14:00:00Z',
      author: 'Mike Johnson',
      changes: 'Major revision for new HPLC system',
      status: 'obsolete'
    }
  ]
};

export function SOPManagement({ onSOPClick }: SOPManagementProps) {
  const [selectedSOP, setSelectedSOP] = useState<string | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredSOPs = mockSOPs.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sop.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sop.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'obsolete':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const categories = [...new Set(mockSOPs.map(sop => sop.category))];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">SOP Management</h2>
              <p className="text-sm text-gray-600">Standard Operating Procedures with version control and approval workflow</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload New SOP</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search SOPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="obsolete">Obsolete</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Export List
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total SOPs</p>
              <p className="text-2xl font-bold text-gray-900">{filteredSOPs.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-yellow-600">{filteredSOPs.filter(sop => sop.status === 'under-review').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{filteredSOPs.filter(sop => sop.status === 'approved').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due for Review</p>
              <p className="text-2xl font-bold text-orange-600">2</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* SOPs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SOP Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSOPs.map((sop) => (
                <tr key={sop.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(sop.status)}
                      <div>
                        <button
                          onClick={() => onSOPClick?.(sop.id)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {sop.id}
                        </button>
                        <div className="text-sm text-gray-600 mt-1">{sop.title}</div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500">{sop.category}</span>
                          <span className="text-xs text-gray-500">{sop.fileSize}</span>
                          {sop.linkedInvestigations.length > 0 && (
                            <span className="text-xs text-blue-600">
                              {sop.linkedInvestigations.length} linked investigation(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={sop.status} 
                      type={sop.status === 'approved' ? 'approval' : 'action'} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">v{sop.version}</span>
                      <button
                        onClick={() => {
                          setSelectedSOP(sop.id);
                          setShowVersionHistory(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <GitBranch className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(sop.lastModified).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{sop.modifiedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(sop.nextReview).toLocaleDateString()}
                    </div>
                    {new Date(sop.nextReview) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                      <div className="text-xs text-orange-600">Due soon</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSOPClick?.(sop.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && selectedSOP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Version History - {selectedSOP}
              </h3>
              <button
                onClick={() => {
                  setShowVersionHistory(false);
                  setSelectedSOP(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {mockVersionHistory[selectedSOP]?.map((version, index) => (
                <div key={version.version} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Version {version.version}</span>
                      <StatusBadge 
                        status={version.status} 
                        type={version.status === 'approved' ? 'approval' : 'action'} 
                      />
                      {index === 0 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(version.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{version.changes}</p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>{version.author}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowVersionHistory(false);
                  setSelectedSOP(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Compare Versions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}