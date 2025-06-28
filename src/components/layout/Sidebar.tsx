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
  Home
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
    <div className="w-64 bg-slate-900 text-white h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold">LIMS</h1>
            <p className="text-sm text-slate-400">Investigation Module</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
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
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-400">Lab Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}