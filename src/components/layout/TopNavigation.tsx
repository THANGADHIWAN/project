import React from 'react';
import { 
  Home,
  FileSearch, 
  AlertTriangle, 
  GitBranch, 
  CheckCircle, 
  FileText, 
  Shield, 
  BarChart3,
  Settings
} from 'lucide-react';

interface TopNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
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

export function TopNavigation({ currentSection, onSectionChange }: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-6">
      <nav className="flex space-x-8">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}