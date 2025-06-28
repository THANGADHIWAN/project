import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  FileText,
  Users,
  Calendar,
  Target
} from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';

interface DashboardStats {
  totalInvestigations: number;
  activeInvestigations: number;
  overdue: number;
  completedThisMonth: number;
  avgCompletionTime: number;
  capasPending: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const mockStats: DashboardStats = {
  totalInvestigations: 127,
  activeInvestigations: 23,
  overdue: 5,
  completedThisMonth: 18,
  avgCompletionTime: 12.5,
  capasPending: 8,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'Investigation Created',
    description: 'New deviation investigation for Sample ID: SM-2024-001',
    timestamp: '2024-01-15T10:30:00Z',
    user: 'John Doe',
    priority: 'high'
  },
  {
    id: '2',
    type: 'CAPA Approved',
    description: 'CAPA for Investigation INV-2024-012 approved by Lab Manager',
    timestamp: '2024-01-15T09:15:00Z',
    user: 'Jane Smith',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'RCA Completed',
    description: 'Root cause analysis completed for temperature deviation',
    timestamp: '2024-01-15T08:45:00Z',
    user: 'Mike Johnson',
    priority: 'high'
  },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Investigations</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalInvestigations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.activeInvestigations}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.overdue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed This Month</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.completedThisMonth}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()} • {activity.user}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge status={activity.priority} type="priority" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Avg. Completion Time</span>
                  <span className="text-sm font-bold text-gray-900">{mockStats.avgCompletionTime} days</span>
                </div>
                <ProgressBar progress={75} color="green" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">On-Time Completion</span>
                  <span className="text-sm font-bold text-gray-900">87%</span>
                </div>
                <ProgressBar progress={87} color="blue" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">CAPA Effectiveness</span>
                  <span className="text-sm font-bold text-gray-900">92%</span>
                </div>
                <ProgressBar progress={92} color="green" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CAPAs Pending Approval</span>
                <span className="text-sm font-bold text-gray-900">{mockStats.capasPending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">SOPs Pending Review</span>
                <span className="text-sm font-bold text-gray-900">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overdue Validations</span>
                <span className="text-sm font-bold text-gray-900">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}