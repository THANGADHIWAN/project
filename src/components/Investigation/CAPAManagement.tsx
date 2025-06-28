import React, { useState } from 'react';
import { CheckCircle, Clock, User, Calendar, AlertTriangle, Plus, X, FileText, FileSignature as Signature } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';

interface CAPAAction {
  id: string;
  type: 'corrective' | 'preventive';
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  resources: string[];
  evidence: string[];
}

interface ApprovalStep {
  id: string;
  role: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  timestamp: string;
  digitalSignature: string;
}

const mockActions: CAPAAction[] = [
  {
    id: 'CA-001',
    type: 'corrective',
    description: 'Replace HPLC column and perform system suitability testing',
    assignedTo: 'John Doe',
    dueDate: '2024-01-20T23:59:59Z',
    status: 'completed',
    priority: 'high',
    resources: ['HPLC Column C18', 'System Suitability Standards'],
    evidence: ['Column replacement log', 'System suitability results']
  },
  {
    id: 'CA-002',
    type: 'corrective',
    description: 'Retrain analyst on proper sample preparation procedures',
    assignedTo: 'Training Department',
    dueDate: '2024-01-25T23:59:59Z',
    status: 'in-progress',
    priority: 'medium',
    resources: ['Training Materials', 'SOP-QC-001'],
    evidence: []
  },
  {
    id: 'PA-001',
    type: 'preventive',
    description: 'Implement automated column usage tracking system',
    assignedTo: 'IT Department',
    dueDate: '2024-02-15T23:59:59Z',
    status: 'pending',
    priority: 'medium',
    resources: ['LIMS Integration', 'Column Tracking Software'],
    evidence: []
  },
  {
    id: 'PA-002',
    type: 'preventive',
    description: 'Update SOP to include column lifecycle monitoring',
    assignedTo: 'QA Department',
    dueDate: '2024-01-30T23:59:59Z',
    status: 'pending',
    priority: 'high',
    resources: ['SOP Template', 'Historical Data'],
    evidence: []
  }
];

const mockApprovalFlow: ApprovalStep[] = [
  {
    id: 'APP-001',
    role: 'Lab Analyst',
    approver: 'John Doe',
    status: 'approved',
    comments: 'CAPA actions are appropriate and feasible',
    timestamp: '2024-01-16T10:30:00Z',
    digitalSignature: 'DS-JD-20240116-1030'
  },
  {
    id: 'APP-002',
    role: 'Lab Manager',
    approver: 'Sarah Wilson',
    status: 'pending',
    comments: '',
    timestamp: '',
    digitalSignature: ''
  },
  {
    id: 'APP-003',
    role: 'QA Manager',
    approver: 'Mike Johnson',
    status: 'pending',
    comments: '',
    timestamp: '',
    digitalSignature: ''
  }
];

export function CAPAManagement() {
  const [actions, setActions] = useState<CAPAAction[]>(mockActions);
  const [approvalFlow, setApprovalFlow] = useState<ApprovalStep[]>(mockApprovalFlow);
  const [newAction, setNewAction] = useState({
    type: 'corrective' as 'corrective' | 'preventive',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    resources: [] as string[]
  });
  const [showAddAction, setShowAddAction] = useState(false);
  const [newResource, setNewResource] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const addAction = () => {
    if (newAction.description && newAction.assignedTo && newAction.dueDate) {
      const action: CAPAAction = {
        id: `${newAction.type === 'corrective' ? 'CA' : 'PA'}-${String(actions.length + 1).padStart(3, '0')}`,
        ...newAction,
        status: 'pending',
        evidence: []
      };
      setActions(prev => [...prev, action]);
      setNewAction({
        type: 'corrective',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium',
        resources: []
      });
      setShowAddAction(false);
    }
  };

  const addResource = () => {
    if (newResource.trim()) {
      setNewAction(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    setNewAction(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const updateActionStatus = (actionId: string, status: CAPAAction['status']) => {
    setActions(prev => prev.map(action => 
      action.id === actionId ? { ...action, status } : action
    ));
  };

  const approveStep = (stepId: string, comments: string) => {
    setApprovalFlow(prev => prev.map(step => 
      step.id === stepId ? {
        ...step,
        status: 'approved',
        comments,
        timestamp: new Date().toISOString(),
        digitalSignature: `DS-${step.approver.replace(' ', '')}-${new Date().toISOString().slice(0, 10)}`
      } : step
    ));
  };

  const getOverallProgress = () => {
    const completedActions = actions.filter(action => action.status === 'completed' || action.status === 'verified').length;
    return Math.round((completedActions / actions.length) * 100);
  };

  const correctiveActions = actions.filter(action => action.type === 'corrective');
  const preventiveActions = actions.filter(action => action.type === 'preventive');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">CAPA Management</h2>
              <p className="text-sm text-gray-600">Investigation ID: INV-2024-001 - Corrective and Preventive Actions</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Overall Progress</div>
            <div className="text-2xl font-bold text-green-600">{getOverallProgress()}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Actions Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Corrective Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Corrective Actions</h3>
                  <span className="text-sm text-gray-500">({correctiveActions.length})</span>
                </div>
                <button
                  onClick={() => {
                    setNewAction(prev => ({ ...prev, type: 'corrective' }));
                    setShowAddAction(true);
                  }}
                  className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Action</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {correctiveActions.map((action) => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{action.id}</span>
                        <StatusBadge status={action.status} type="action" />
                        <StatusBadge status={action.priority} type="priority" />
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{action.assignedTo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(action.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {action.status === 'pending' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'in-progress')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Start
                        </button>
                      )}
                      {action.status === 'in-progress' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'completed')}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
                      {action.status === 'completed' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'verified')}
                          className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {action.resources.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Resources:</p>
                      <div className="flex flex-wrap gap-1">
                        {action.resources.map((resource, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {action.evidence.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Evidence:</p>
                      <div className="space-y-1">
                        {action.evidence.map((evidence, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                            <FileText className="h-3 w-3" />
                            <span>{evidence}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preventive Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Preventive Actions</h3>
                  <span className="text-sm text-gray-500">({preventiveActions.length})</span>
                </div>
                <button
                  onClick={() => {
                    setNewAction(prev => ({ ...prev, type: 'preventive' }));
                    setShowAddAction(true);
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Action</span>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {preventiveActions.map((action) => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">{action.id}</span>
                        <StatusBadge status={action.status} type="action" />
                        <StatusBadge status={action.priority} type="priority" />
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{action.assignedTo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(action.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {action.status === 'pending' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'in-progress')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                        >
                          Start
                        </button>
                      )}
                      {action.status === 'in-progress' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'completed')}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
                      {action.status === 'completed' && (
                        <button
                          onClick={() => updateActionStatus(action.id, 'verified')}
                          className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                        >
                          Verify
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {action.resources.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Resources:</p>
                      <div className="flex flex-wrap gap-1">
                        {action.resources.map((resource, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Approval Flow */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Signature className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Approval Flow</h3>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {approvalFlow.map((step, index) => (
                <div key={step.id} className="relative">
                  {index < approvalFlow.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'approved' ? 'bg-green-100 text-green-600' :
                      step.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {step.status === 'approved' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : step.status === 'rejected' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{step.role}</p>
                          <p className="text-xs text-gray-600">{step.approver}</p>
                        </div>
                        <StatusBadge status={step.status} type="approval" />
                      </div>
                      {step.status === 'approved' && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600">{step.comments}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Signature: {step.digitalSignature}
                          </p>
                        </div>
                      )}
                      {step.status === 'pending' && index === approvalFlow.findIndex(s => s.status === 'pending') && (
                        <div className="mt-2">
                          <textarea
                            placeholder="Add approval comments..."
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            rows={2}
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => approveStep(step.id, 'Approved')}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Progress Summary</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Corrective Actions</span>
                  <span>{correctiveActions.filter(a => a.status === 'completed' || a.status === 'verified').length}/{correctiveActions.length}</span>
                </div>
                <ProgressBar 
                  progress={(correctiveActions.filter(a => a.status === 'completed' || a.status === 'verified').length / correctiveActions.length) * 100}
                  color="orange"
                  size="sm"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Preventive Actions</span>
                  <span>{preventiveActions.filter(a => a.status === 'completed' || a.status === 'verified').length}/{preventiveActions.length}</span>
                </div>
                <ProgressBar 
                  progress={(preventiveActions.filter(a => a.status === 'completed' || a.status === 'verified').length / preventiveActions.length) * 100}
                  color="green"
                  size="sm"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Approvals</span>
                  <span>{approvalFlow.filter(s => s.status === 'approved').length}/{approvalFlow.length}</span>
                </div>
                <ProgressBar 
                  progress={(approvalFlow.filter(s => s.status === 'approved').length / approvalFlow.length) * 100}
                  color="blue"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Action Modal */}
      {showAddAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add {newAction.type === 'corrective' ? 'Corrective' : 'Preventive'} Action
              </h3>
              <button
                onClick={() => setShowAddAction(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newAction.description}
                  onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the action to be taken..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To *
                </label>
                <input
                  type="text"
                  value={newAction.assignedTo}
                  onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Person or department responsible"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={newAction.dueDate.split('T')[0]}
                    onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e.target.value + 'T23:59:59Z' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newAction.priority}
                    onChange={(e) => setNewAction(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resources
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add required resource..."
                    onKeyPress={(e) => e.key === 'Enter' && addResource()}
                  />
                  <button
                    onClick={addResource}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {newAction.resources.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newAction.resources.map((resource, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {resource}
                        <button
                          onClick={() => removeResource(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddAction(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Add Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}