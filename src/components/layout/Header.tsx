import React from 'react';
import { Bell, Search, RefreshCw, Download } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">LabFlow</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Date Range:</span>
            <div className="flex items-center space-x-2">
              <input 
                type="date" 
                defaultValue="2025-06-21"
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <span>to</span>
              <input 
                type="date" 
                defaultValue="2025-06-28"
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
          
          <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          
          <button className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </button>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">TD</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Thanga Dhiwan</div>
              <div className="text-gray-500">Analyst</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}