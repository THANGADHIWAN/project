import React from 'react';
import { InvestigationStatus, Priority, ActionStatus, ApprovalStatus } from '../../types/investigation';

interface StatusBadgeProps {
  status: InvestigationStatus | Priority | ActionStatus | ApprovalStatus;
  type?: 'investigation' | 'priority' | 'action' | 'approval';
}

const statusStyles = {
  investigation: {
    'initiated': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'rca-pending': 'bg-orange-100 text-orange-800',
    'capa-pending': 'bg-purple-100 text-purple-800',
    'approval-pending': 'bg-indigo-100 text-indigo-800',
    'completed': 'bg-green-100 text-green-800',
    'closed': 'bg-gray-100 text-gray-800',
  },
  priority: {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  },
  action: {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'verified': 'bg-purple-100 text-purple-800',
  },
  approval: {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
  },
};

export function StatusBadge({ status, type = 'investigation' }: StatusBadgeProps) {
  const styles = statusStyles[type];
  const className = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {status.replace('-', ' ').toUpperCase()}
    </span>
  );
}