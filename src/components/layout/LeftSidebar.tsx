import React from 'react';
import { 
  Home,
  FileText,
  TestTube,
  Package,
  Wrench,
  FlaskConical,
  Calendar,
  Settings
} from 'lucide-react';

interface LeftSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'specifications', label: 'Specifications', icon: FileText },
  { id: 'samples', label: 'Samples', icon: TestTube },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'equipments', label: 'Equipments', icon: Wrench },
  { id: 'parameter-tests', label: 'Parameter Tests', icon: FlaskConical },
  { id: 'test-master', label: 'Test Master', icon: FlaskConical },
  { id: 'scheduling', label: 'Scheduling', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function LeftSidebar({ activeModule, onModuleChange }: LeftSidebarProps) {
  return (
    <div className="w-20 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <li key={module.id}>
                <button
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full flex flex-col items-center space-y-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={module.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs leading-tight text-center">{module.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}