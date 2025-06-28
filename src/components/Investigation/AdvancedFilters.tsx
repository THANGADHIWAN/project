import React, { useState } from 'react';
import { X, Calendar, User, Filter, Search } from 'lucide-react';

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  type: 'reports' | 'audit';
}

export function AdvancedFilters({ isOpen, onClose, onApply, type }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    users: [] as string[],
    departments: [] as string[],
    priorities: [] as string[],
    statuses: [] as string[],
    actions: [] as string[],
    modules: [] as string[],
    reportTypes: [] as string[],
    keywords: '',
    ipAddress: '',
    sessionId: '',
    recordTypes: [] as string[]
  });

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      users: [],
      departments: [],
      priorities: [],
      statuses: [],
      actions: [],
      modules: [],
      reportTypes: [],
      keywords: '',
      ipAddress: '',
      sessionId: '',
      recordTypes: []
    });
  };

  const toggleArrayFilter = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key as keyof typeof prev].includes(value)
        ? (prev[key as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[key as keyof typeof prev] as string[]), value]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, start: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Start date"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, end: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Users */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Users</label>
            <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              {['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Alex Thompson'].map((user) => (
                <label key={user} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.users.includes(user)}
                    onChange={() => toggleArrayFilter('users', user)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{user}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Departments */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Departments</label>
            <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
              {['Quality Control', 'Quality Assurance', 'Lab Management', 'IT Department', 'Regulatory Affairs'].map((dept) => (
                <label key={dept} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.departments.includes(dept)}
                    onChange={() => toggleArrayFilter('departments', dept)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          {type === 'reports' && (
            <>
              {/* Report Types */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Report Types</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['Investigation', 'Summary', 'CAPA', 'Trend Analysis', 'Deviation'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.reportTypes.includes(type)}
                        onChange={() => toggleArrayFilter('reportTypes', type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['Draft', 'Pending Review', 'Approved', 'Published', 'Rejected'].map((status) => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.statuses.includes(status)}
                        onChange={() => toggleArrayFilter('statuses', status)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['Low', 'Medium', 'High', 'Critical'].map((priority) => (
                    <label key={priority} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.priorities.includes(priority)}
                        onChange={() => toggleArrayFilter('priorities', priority)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'audit' && (
            <>
              {/* Actions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Actions</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'APPROVE', 'REJECT'].map((action) => (
                    <label key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.actions.includes(action)}
                        onChange={() => toggleArrayFilter('actions', action)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{action}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Modules</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['Investigation', 'CAPA', 'SOP', 'Report', 'Deviation', 'User Management'].map((module) => (
                    <label key={module} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.modules.includes(module)}
                        onChange={() => toggleArrayFilter('modules', module)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{module}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Record Types */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Record Types</label>
                <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {['Investigation', 'CAPA Action', 'SOP Document', 'Report Template', 'Deviation Report'].map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.recordTypes.includes(type)}
                        onChange={() => toggleArrayFilter('recordTypes', type)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* IP Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <input
                  type="text"
                  value={filters.ipAddress}
                  onChange={(e) => setFilters(prev => ({ ...prev, ipAddress: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 192.168.1.100"
                />
              </div>

              {/* Session ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Session ID</label>
                <input
                  type="text"
                  value={filters.sessionId}
                  onChange={(e) => setFilters(prev => ({ ...prev, sessionId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SES-20240116-001"
                />
              </div>
            </>
          )}

          {/* Keywords */}
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={filters.keywords}
                onChange={(e) => setFilters(prev => ({ ...prev, keywords: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search in descriptions, comments, record IDs..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}