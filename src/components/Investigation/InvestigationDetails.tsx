import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Clock, AlertTriangle, FileText, MessageSquare, Upload, Download, Edit, CheckCircle, X } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';
import { ProgressBar } from '../Common/ProgressBar';

interface InvestigationDetailsProps {
  investigationId: string;
  onBack: () => void;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  attachments?: string[];
  comments?: string;
}

const mockInvestigationData = {
  'INV-2024-001': {
    id: 'INV-2024-001',
    deviationId: 'DEV-2024-001',
    title: 'Out of Specification - Sample SM-2024-001',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'John Doe',
    createdBy: 'Jane Smith',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    dueDate: '2024-01-25T23:59:59Z',
    currentStep: 'Root Cause Analysis',
    completionPercentage: 45,
    deviation: {
      sampleId: 'SM-2024-001',
      testId: 'T-HPLC-001',
      instrumentId: 'HPLC-001',
      analystId: 'AN-001',
      analystName: 'John Doe',
      dateTime: '2024-01-15T08:30:00Z',
      deviationType: 'out-of-specification',
      description: 'Assay result of 98.2% is below the specification limit of 98.5-101.5%. Sample was tested in duplicate with consistent results.',
      severity: 'high',
      immediateActions: 'Sample quarantined, instrument checked for calibration, analyst verified method parameters.',
      potentialImpact: 'Potential impact on batch release. Customer notification may be required if batch is already shipped.',
      customerImpact: true,
      regulatoryImpact: false,
      relatedSOPs: ['SOP-QC-001', 'SOP-QC-003'],
      attachments: ['chromatogram_001.pdf', 'sample_prep_log.xlsx', 'instrument_log.pdf']
    },
    timeline: [
      {
        id: '1',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'Jane Smith',
        action: 'Investigation Initiated',
        description: 'Investigation triggered due to OOS result. Initial assessment completed.',
        attachments: ['deviation_report.pdf']
      },
      {
        id: '2',
        timestamp: '2024-01-15T14:15:00Z',
        user: 'John Doe',
        action: 'Immediate Actions Taken',
        description: 'Sample quarantined, instrument calibration verified, method parameters checked.',
        comments: 'All immediate containment actions completed. No issues found with instrument or method.'
      },
      {
        id: '3',
        timestamp: '2024-01-16T09:00:00Z',
        user: 'John Doe',
        action: 'Root Cause Analysis Started',
        description: 'Initiated comprehensive RCA using MHRA decision tree methodology.',
        attachments: ['rca_checklist.pdf']
      },
      {
        id: '4',
        timestamp: '2024-01-16T14:20:00Z',
        user: 'John Doe',
        action: 'Additional Testing Requested',
        description: 'Requested retest of retained sample and testing of adjacent samples from same batch.',
        comments: 'Need to confirm if this is an isolated incident or systematic issue.'
      }
    ],
    rca: {
      status: 'in-progress',
      aiSuggestions: [
        'HPLC column degradation due to extended use beyond recommended lifecycle',
        'Sample preparation error during dilution step',
        'Environmental conditions affecting sample stability'
      ],
      checklist: {
        completed: 6,
        total: 12
      },
      rootCause: '',
      contributingFactors: []
    },
    capa: {
      status: 'pending',
      correctiveActions: 0,
      preventiveActions: 0,
      approvalStatus: 'not-started'
    }
  }
};

export function InvestigationDetails({ investigationId, onBack }: InvestigationDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'deviation' | 'timeline' | 'rca' | 'capa'>('overview');
  const [newComment, setNewComment] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);

  const investigation = mockInvestigationData[investigationId as keyof typeof mockInvestigationData];

  if (!investigation) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Investigation Not Found</h2>
          <p className="text-gray-600 mt-2">The requested investigation could not be found.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Investigations
          </button>
        </div>
      </div>
    );
  }

  const addComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log('Adding comment:', newComment);
      setNewComment('');
      setShowAddComment(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Investigations</span>
          </button>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="h-4 w-4 inline mr-1" />
              Export
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Edit className="h-4 w-4 inline mr-1" />
              Edit
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">{investigation.id}</h1>
              <StatusBadge status={investigation.status} type="investigation" />
              <StatusBadge status={investigation.priority} type="priority" />
            </div>
            <h2 className="text-lg text-gray-700 mb-4">{investigation.title}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Assigned To:</span>
                <p className="font-medium">{investigation.assignedTo}</p>
              </div>
              <div>
                <span className="text-gray-500">Created By:</span>
                <p className="font-medium">{investigation.createdBy}</p>
              </div>
              <div>
                <span className="text-gray-500">Due Date:</span>
                <p className="font-medium">{new Date(investigation.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Current Step:</span>
                <p className="font-medium">{investigation.currentStep}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Progress Overview</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{investigation.completionPercentage}%</span>
                </div>
                <ProgressBar progress={investigation.completionPercentage} />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-medium text-gray-900">{investigation.rca.checklist.completed}/{investigation.rca.checklist.total}</div>
                  <div className="text-gray-500">RCA Items</div>
                </div>
                <div className="text-center p-2 bg-white rounded">
                  <div className="font-medium text-gray-900">{investigation.capa.correctiveActions + investigation.capa.preventiveActions}</div>
                  <div className="text-gray-500">CAPA Actions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'deviation', label: 'Deviation Details' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'rca', label: 'Root Cause Analysis' },
              { id: 'capa', label: 'CAPA' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Deviation Type</h4>
                    <p className="text-sm text-gray-700 capitalize">{investigation.deviation.deviationType.replace('-', ' ')}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-700">{investigation.deviation.description}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Immediate Actions</h4>
                    <p className="text-sm text-gray-700">{investigation.deviation.immediateActions}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600">Sample ID</div>
                      <div className="font-medium text-blue-900">{investigation.deviation.sampleId}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-green-600">Test ID</div>
                      <div className="font-medium text-green-900">{investigation.deviation.testId}</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600">Instrument</div>
                      <div className="font-medium text-purple-900">{investigation.deviation.instrumentId}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-sm text-orange-600">Analyst</div>
                      <div className="font-medium text-orange-900">{investigation.deviation.analystName}</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Impact Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {investigation.deviation.customerImpact ? (
                          <CheckCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <X className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm">Customer Impact</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {investigation.deviation.regulatoryImpact ? (
                          <CheckCircle className="h-4 w-4 text-red-600" />
                        ) : (
                          <X className="h-4 w-4 text-green-600" />
                        )}
                        <span className="text-sm">Regulatory Impact</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Related SOPs</h4>
                    <div className="flex flex-wrap gap-2">
                      {investigation.deviation.relatedSOPs.map((sop) => (
                        <span key={sop} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                          {sop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deviation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deviation Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sample ID</label>
                        <p className="mt-1 text-sm text-gray-900">{investigation.deviation.sampleId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Test ID</label>
                        <p className="mt-1 text-sm text-gray-900">{investigation.deviation.testId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Instrument ID</label>
                        <p className="mt-1 text-sm text-gray-900">{investigation.deviation.instrumentId}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Analyst</label>
                        <p className="mt-1 text-sm text-gray-900">{investigation.deviation.analystName}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(investigation.deviation.dateTime).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Deviation Type</label>
                      <p className="mt-1 text-sm text-gray-900 capitalize">
                        {investigation.deviation.deviationType.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {investigation.deviation.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-900">{attachment}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Description</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{investigation.deviation.description}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Potential Impact</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{investigation.deviation.potentialImpact}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Investigation Timeline</h3>
                <button
                  onClick={() => setShowAddComment(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Update
                </button>
              </div>
              
              <div className="relative">
                {investigation.timeline.map((event, index) => (
                  <div key={event.id} className="relative pb-8">
                    {index < investigation.timeline.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{event.action}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                        {event.comments && (
                          <div className="p-2 bg-gray-50 rounded text-sm text-gray-600 mb-2">
                            <strong>Comments:</strong> {event.comments}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            <span>{event.user}</span>
                          </div>
                          {event.attachments && event.attachments.length > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-blue-600">
                              <FileText className="h-3 w-3" />
                              <span>{event.attachments.length} attachment(s)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {showAddComment && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Add Timeline Update</h4>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe the update or action taken..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => setShowAddComment(false)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addComment}
                      className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Add Update
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rca' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Root Cause Analysis</h3>
              <p className="text-gray-600 mb-4">RCA is currently in progress. {investigation.rca.checklist.completed} of {investigation.rca.checklist.total} checklist items completed.</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Continue RCA
              </button>
            </div>
          )}

          {activeTab === 'capa' && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CAPA Management</h3>
              <p className="text-gray-600 mb-4">CAPA definition will begin after RCA completion.</p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700" disabled>
                Define CAPA Actions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}