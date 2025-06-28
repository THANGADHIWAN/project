import React from 'react';
import { FileSearch, Shield } from 'lucide-react';

interface LeftSidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: 'investigation', label: 'Investigation', icon: FileSearch },
];

export function LeftSidebar({ activeModule, onModuleChange }: LeftSidebarProps) {
  return (
    <div className="w-20 bg-white border-r border-gray-100 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-center">
          <Shield className="h-8 w-8 text-gray-600" />
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-2 px-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <li key={module.id}>
                <button
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full flex flex-col items-center space-y-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                  title={module.label}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{module.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}