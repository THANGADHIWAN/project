import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp, Download, Filter, Search, MoreHorizontal } from 'lucide-react';

interface Investigation {
  id: string;
  sampleId: string;
  sampleType: string;
  method: string;
  instrument: string;
  deviationId: string;
  capaStatus: string;
  analyst: string;
  startDate: string;
  dueDate: string;
  status: 'New' | 'In Progress' | 'Under Review' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

const mockData: Investigation[] = [
  {
    id: 'INV-2024-001',
    sampleId: 'SM-2024-001',
    sampleType: 'API',
    method: 'HPLC Assay',
    instrument: 'HPLC-001',
    deviationId: 'DEV-2024-001',
    capaStatus: 'In Progress',
    analyst: 'Dr. Sarah Chen',
    startDate: '2024-01-15',
    dueDate: '2024-01-25',
    status: 'In Progress',
    priority: 'High'
  },
  {
    id: 'INV-2024-002',
    sampleId: 'SM-2024-002',
    sampleType: 'Excipient',
    method: 'UV Spectroscopy',
    instrument: 'UV-001',
    deviationId: 'DEV-2024-002',
    capaStatus: 'Pending',
    analyst: 'Dr. Mike Johnson',
    startDate: '2024-01-14',
    dueDate: '2024-01-20',
    status: 'Under Review',
    priority: 'Critical'
  },
  {
    id: 'INV-2024-003',
    sampleId: 'SM-2024-003',
    sampleType: 'Finished Product',
    method: 'Dissolution',
    instrument: 'DIS-001',
    deviationId: 'DEV-2024-003',
    capaStatus: 'Completed',
    analyst: 'Dr. Emily Davis',
    startDate: '2024-01-13',
    dueDate: '2024-01-22',
    status: 'Closed',
    priority: 'Medium'
  },
  {
    id: 'INV-2024-004',
    sampleId: 'SM-2024-004',
    sampleType: 'Raw Material',
    method: 'FTIR',
    instrument: 'FTIR-001',
    deviationId: 'DEV-2024-004',
    capaStatus: 'Not Started',
    analyst: 'Dr. Alex Thompson',
    startDate: '2024-01-16',
    dueDate: '2024-01-26',
    status: 'New',
    priority: 'Low'
  },
  {
    id: 'INV-2024-005',
    sampleId: 'SM-2024-005',
    sampleType: 'API',
    method: 'GC Analysis',
    instrument: 'GC-001',
    deviationId: 'DEV-2024-005',
    capaStatus: 'In Progress',
    analyst: 'Dr. Lisa Garcia',
    startDate: '2024-01-12',
    dueDate: '2024-01-18',
    status: 'In Progress',
    priority: 'High'
  }
];

type SortField = keyof Investigation;
type SortDirection = 'asc' | 'desc';

export function TableView() {
  const [data, setData] = useState<Investigation[]>(mockData);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    analyst: '',
    sampleType: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !filters.search || 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(filters.search.toLowerCase())
        );
      const matchesStatus = !filters.status || item.status === filters.status;
      const matchesPriority = !filters.priority || item.priority === filters.priority;
      const matchesAnalyst = !filters.analyst || item.analyst === filters.analyst;
      const matchesSampleType = !filters.sampleType || item.sampleType === filters.sampleType;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesAnalyst && matchesSampleType;
    });
  }, [data, filters]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  }, [selectedRows.size, paginatedData]);

  const handleSelectRow = useCallback((id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  }, [selectedRows]);

  const exportToCSV = useCallback(() => {
    const headers = ['ID', 'Sample ID', 'Sample Type', 'Method', 'Instrument', 'Deviation ID', 'CAPA Status', 'Analyst', 'Start Date', 'Due Date', 'Status', 'Priority'];
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => [
        row.id, row.sampleId, row.sampleType, row.method, row.instrument,
        row.deviationId, row.capaStatus, row.analyst, row.startDate, row.dueDate,
        row.status, row.priority
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investigations.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [sortedData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-orange-100 text-orange-800';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Filters and Actions */}
      <div className="border-b border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search investigations..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            {selectedRows.size > 0 && (
              <span className="text-sm text-gray-600">{selectedRows.size} selected</span>
            )}
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Closed">Closed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={filters.sampleType}
            onChange={(e) => setFilters(prev => ({ ...prev, sampleType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="">All Sample Types</option>
            <option value="API">API</option>
            <option value="Excipient">Excipient</option>
            <option value="Finished Product">Finished Product</option>
            <option value="Raw Material">Raw Material</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                />
              </th>
              {[
                { field: 'id' as SortField, label: 'Investigation ID' },
                { field: 'sampleId' as SortField, label: 'Sample ID' },
                { field: 'sampleType' as SortField, label: 'Sample Type' },
                { field: 'method' as SortField, label: 'Method' },
                { field: 'instrument' as SortField, label: 'Instrument' },
                { field: 'analyst' as SortField, label: 'Analyst' },
                { field: 'startDate' as SortField, label: 'Start Date' },
                { field: 'dueDate' as SortField, label: 'Due Date' },
                { field: 'status' as SortField, label: 'Status' },
                { field: 'priority' as SortField, label: 'Priority' }
              ].map(({ field, label }) => (
                <th
                  key={field}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{label}</span>
                    <SortIcon field={field} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleSelectRow(item.id)}
                    className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{item.sampleId}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{item.sampleType}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{item.method}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{item.instrument}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{item.analyst}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{new Date(item.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-sm text-gray-900">{new Date(item.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700">entries</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}