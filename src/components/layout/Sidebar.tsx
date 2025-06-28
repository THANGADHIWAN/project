import React from 'react';
import { 
  FileSearch, 
  AlertTriangle, 
  GitBranch, 
  CheckCircle, 
  FileText, 
  Shield, 
  BarChart3,
  Settings,
  Home,
  FlaskConical
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'investigations', label: 'Investigations', icon: FileSearch },
  { id: 'trigger', label: 'Trigger Investigation', icon: AlertTriangle },
  { id: 'decision-tree', label: 'Decision Tree', icon: GitBranch },
  { id: 'rca', label: 'Root Cause Analysis', icon: CheckCircle },
  { id: 'capa', label: 'CAPA Management', icon: FileText },
  { id: 'sop', label: 'SOP Management', icon: Shield },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'audit', label: 'Audit Trail', icon: Settings },
];

export function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FlaskConical className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">LabFlow</h1>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">Lab Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}