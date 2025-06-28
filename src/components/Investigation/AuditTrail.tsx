import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, Activity, FileText, Clock } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { AdvancedFilters } from './AdvancedFilters';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userRole: string;
  userName: string;
  action: string;
  module: string;
  recordId: string;
  recordType: string;
  changes: Record<string, { from: any; to: any }>;
  ipAddress: string;
  sessionId: string;
  description: string;
}

const mockAuditEntries: AuditEntry[] = [
  {
    id: 'AUD-2024-001',
    timestamp: '2024-01-16T14:30:00Z',
    userId: 'USR-001',
    userRole: 'Lab Analyst',
    userName: 'John Doe',
    action: 'UPDATE',
    module: 'Investigation',
    recordId: 'INV-2024-001',
    recordType: 'Investigation',
    changes: {
      status: { from: 'in-progress', to: 'rca-pending' },
      currentStep: { from: 'Initial Assessment', to: 'Root Cause Analysis' }
    },
    ipAddress: '192.168.1.100',
    sessionId: 'SES-20240116-001',
    description: 'Investigation status updated to RCA pending'
  },
  {
    id: 'AUD-2024-002',
    timestamp: '2024-01-16T13:45:00Z',
    userId: 'USR-002',
    userRole: 'QA Manager',
    userName: 'Sarah Wilson',
    action: 'APPROVE',
    module: 'CAPA',
    recordId: 'CAPA-2024-001',
    recordType: 'CAPA Action',
    changes: {
      approvalStatus: { from: 'pending', to: 'approved' },
      approvedBy: { from: null, to: 'Sarah Wilson' }
    },
    ipAddress: '192.168.1.105',
    sessionId: 'SES-20240116-002',
    description: 'CAPA action approved by QA Manager'
  },
  {
    id: 'AUD-2024-003',
    timestamp: '2024-01-16T12:20:00Z',
    userId: 'USR-003',
    userRole: 'Lab Manager',
    userName: 'Mike Johnson',
    action: 'CREATE',
    module: 'SOP',
    recordId: 'SOP-QC-005',
    recordType: 'SOP Document',
    changes: {
      title: { from: null, to: 'Updated HPLC Maintenance Procedures' },
      version: { from: null, to: '1.0' },
      status: { from: null, to: 'draft' }
    },
    ipAddress: '192.168.1.110',
    sessionId: 'SES-20240116-003',
    description: 'New SOP document created'
  },
  {
    id: 'AUD-2024-004',
    timestamp: '2024-01-16T11:15:00Z',
    userId: 'USR-001',
    userRole: 'Lab Analyst',
    userName: 'John Doe',
    action: 'VIEW',
    module: 'Investigation',
    recordId: 'INV-2024-002',
    recordType: 'Investigation',
    changes: {},
    ipAddress: '192.168.1.100',
    sessionId: 'SES-20240116-001',
    description: 'Investigation record accessed for review'
  },
  {
    id: 'AUD-2024-005',
    timestamp: '2024-01-16T10:30:00Z',
    userId: 'USR-004',
    userRole: 'Analyst',
    userName: 'Emily Davis',
    action: 'UPDATE',
    module: 'Deviation',
    recordId: 'DEV-2024-003',
    recordType: 'Deviation Report',
    changes: {
      severity: { from: 'medium', to: 'high' },
      description: { from: 'Initial description', to: 'Updated description with additional details' }
    },
    ipAddress: '192.168.1.115',
    sessionId: 'SES-20240116-004',
    description: 'Deviation severity updated based on additional findings'
  },
  {
    id: 'AUD-2024-006',
    timestamp: '2024-01-16T09:45:00Z',
    userId: 'USR-005',
    userRole: 'System Admin',
    userName: 'Alex Thompson',
    action: 'DELETE',
    module: 'Report',
    recordId: 'RPT-2024-TEMP-001',
    recordType: 'Report Template',
    changes: {
      status: { from: 'active', to: 'deleted' },
      deletedBy: { from: null, to: 'Alex Thompson' }
    },
    ipAddress: '192.168.1.120',
    sessionId: 'SES-20240116-005',
    description: 'Temporary report template deleted'
  }
];

export function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredEntries = mockAuditEntries.filter(entry => {
    const matchesSearch = entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.recordId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter;
    const matchesModule = moduleFilter === 'all' || entry.module === moduleFilter;
    const matchesUser = userFilter === 'all' || entry.userId === userFilter;
    
    return matchesSearch && matchesAction && matchesModule && matchesUser;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'UPDATE':
        return <Activity className="h-4 w-4 text-blue-600" />;
      case 'DELETE':
        return <Activity className="h-4 w-4 text-red-600" />;
      case 'VIEW':
        return <Eye className="h-4 w-4 text-gray-600" />;
      case 'APPROVE':
        return <Activity className="h-4 w-4 text-purple-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'VIEW':
        return 'bg-gray-100 text-gray-800';
      case 'APPROVE':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueActions = [...new Set(mockAuditEntries.map(entry => entry.action))];
  const uniqueModules = [...new Set(mockAuditEntries.map(entry => entry.module))];
  const uniqueUsers = [...new Set(mockAuditEntries.map(entry => entry.userId))];

  const exportAuditLog = () => {
    // Create sample audit log content
    const auditLogContent = filteredEntries.map(entry => 
      `${entry.timestamp}\t${entry.userName}\t${entry.action}\t${entry.module}\t${entry.recordId}\t${entry.description}`
    ).join('\n');
    
    const blob = new Blob([`Timestamp\tUser\tAction\tModule\tRecord ID\tDescription\n${auditLogContent}`], { type: 'text/tab-separated-values' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().split('T')[0]}.tsv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAdvancedFilters = (filters: any) => {
    console.log('Applied advanced filters:', filters);
    // Implement advanced filtering logic here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Audit Trail</h2>
              <p className="text-sm text-gray-600">Comprehensive log of all system activities and changes</p>
            </div>
          </div>
          <button
            onClick={exportAuditLog}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search audit entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Modules</option>
            {uniqueModules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
          
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(userId => {
              const entry = mockAuditEntries.find(e => e.userId === userId);
              return (
                <option key={userId} value={userId}>
                  {entry?.userName || userId}
                </option>
              );
            })}
          </select>
          
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-1"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{filteredEntries.length}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Activity</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredEntries.filter(entry => 
                  new Date(entry.timestamp).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{uniqueUsers.length}</p>
            </div>
            <User className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Actions</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredEntries.filter(entry => 
                  entry.action === 'DELETE' || entry.action === 'APPROVE'
                ).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Audit Entries Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Audit Entries ({filteredEntries.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                        <div className="text-xs text-gray-500">{entry.userRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getActionIcon(entry.action)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                        {entry.action}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{entry.module}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{entry.recordId}</div>
                    <div className="text-xs text-gray-500">{entry.recordType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {entry.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setShowDetails(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Audit Entry Details
              </h3>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEntry(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entry ID</label>
                  <p className="text-sm text-gray-900">{selectedEntry.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedEntry.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="text-sm text-gray-900">
                    {selectedEntry.userName} ({selectedEntry.userRole})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Action</label>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(selectedEntry.action)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(selectedEntry.action)}`}>
                      {selectedEntry.action}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module</label>
                  <p className="text-sm text-gray-900">{selectedEntry.module}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Record ID</label>
                  <p className="text-sm text-gray-900">{selectedEntry.recordId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-sm text-gray-900">{selectedEntry.ipAddress}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Session ID</label>
                  <p className="text-sm text-gray-900">{selectedEntry.sessionId}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded">
                  {selectedEntry.description}
                </p>
              </div>
              
              {Object.keys(selectedEntry.changes).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Changes Made</label>
                  <div className="space-y-2">
                    {Object.entries(selectedEntry.changes).map(([field, change]) => (
                      <div key={field} className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-900 mb-1">{field}</p>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">From:</span>
                            <p className="text-red-600 font-mono">
                              {change.from === null ? 'null' : String(change.from)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">To:</span>
                            <p className="text-green-600 font-mono">
                              {change.to === null ? 'null' : String(change.to)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedEntry(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700">
                Export Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleAdvancedFilters}
        type="audit"
      />
    </div>
  );
}