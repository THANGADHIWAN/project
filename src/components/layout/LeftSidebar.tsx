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
    <div className="w-20 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-center">
          <Shield className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <li key={module.id}>
                <button
                  onClick={() => onModuleChange(module.id)}
                  className={`w-full flex flex-col items-center space-y-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-gray-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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