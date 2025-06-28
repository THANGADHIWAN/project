import React from 'react';

interface ProgressBarProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
}

export function ProgressBar({ 
  progress, 
  size = 'md', 
  color = 'blue', 
  showPercentage = true 
}: ProgressBarProps) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}