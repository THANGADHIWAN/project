import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Edit, Eye, Clock, CheckCircle, User, FileText, MessageSquare, Upload } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

interface SOPEditorProps {
  sopId: string;
  onBack: () => void;
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

const mockSOPData = {
  'SOP-QC-001': {
    id: 'SOP-QC-001',
    title: 'HPLC Analysis for Active Pharmaceutical Ingredients',
    version: '3.1',
    status: 'under-review',
    category: 'Quality Control',
    lastModified: '2024-01-16T14:30:00Z',
    modifiedBy: 'John Doe',
    approvedBy: 'Sarah Wilson',
    approvalDate: '2024-01-10T10:00:00Z',
    nextReview: '2025-01-10T00:00:00Z',
    changeReason: 'Updated column lifecycle monitoring procedures',
    content: `# HPLC Analysis for Active Pharmaceutical Ingredients

## 1. PURPOSE
This Standard Operating Procedure (SOP) describes the methodology for High-Performance Liquid Chromatography (HPLC) analysis of Active Pharmaceutical Ingredients (APIs) to ensure accurate and reproducible results.

## 2. SCOPE
This procedure applies to all HPLC analyses performed in the Quality Control laboratory for the determination of API content, related substances, and impurities.

## 3. RESPONSIBILITY
- **Analysts**: Perform HPLC analysis according to this procedure
- **Lab Supervisor**: Review and approve analytical results
- **QA Manager**: Periodic review of procedure effectiveness

## 4. EQUIPMENT AND MATERIALS

### 4.1 Equipment
- HPLC system with UV/PDA detector
- Analytical balance (0.1 mg readability)
- Volumetric flasks and pipettes
- Column oven
- Autosampler

### 4.2 Materials
- HPLC grade solvents (acetonitrile, water, methanol)
- Buffer solutions as specified in analytical methods
- Reference standards
- Sample preparation materials

## 5. PROCEDURE

### 5.1 System Preparation
1. Turn on HPLC system and allow to equilibrate for at least 30 minutes
2. Check mobile phase levels and prepare fresh mobile phase if required
3. Install appropriate analytical column
4. Set column temperature as specified in the method
5. Equilibrate system with mobile phase for at least 10 column volumes

### 5.2 System Suitability
1. Prepare system suitability solution according to analytical method
2. Inject system suitability solution in replicate (minimum 5 injections)
3. Verify the following criteria:
   - **Retention Time RSD**: ≤ 2.0%
   - **Peak Area RSD**: ≤ 2.0%
   - **Tailing Factor**: ≤ 2.0
   - **Theoretical Plates**: ≥ 2000
   - **Resolution**: ≥ 2.0 (between critical peak pairs)

### 5.3 Sample Preparation
1. Weigh accurately the required amount of sample
2. Dissolve in appropriate solvent as per analytical method
3. Dilute to required concentration
4. Filter through 0.45 μm membrane filter if required
5. Transfer to HPLC vials

### 5.4 Analysis
1. Inject blank solution
2. Inject standard solutions in duplicate
3. Inject sample solutions in duplicate
4. Inject standard solutions again to check system stability

### 5.5 Column Lifecycle Monitoring
**[UPDATED SECTION]**
1. Record column usage after each analytical sequence
2. Monitor column performance parameters:
   - Back pressure trends
   - Peak shape deterioration
   - Retention time shifts
   - System suitability failures
3. Replace column when any of the following criteria are met:
   - **Usage exceeds 2000 injections**
   - **Back pressure increases by >50% from initial**
   - **System suitability criteria consistently fail**
   - **Peak tailing factor >2.5**

## 6. CALCULATIONS
Calculate the content using the following formula:

**Content (%) = (As/Ast) × (Wst/Ws) × (P/100) × (Ds/Dst) × 100**

Where:
- As = Peak area of sample
- Ast = Peak area of standard
- Ws = Weight of sample (mg)
- Wst = Weight of standard (mg)
- P = Purity of standard (%)
- Ds = Dilution factor of sample
- Dst = Dilution factor of standard

## 7. ACCEPTANCE CRITERIA
- **Content**: 98.5 - 101.5% of labeled amount
- **Related Substances**: Individual impurity ≤ 0.5%, Total impurities ≤ 2.0%
- **System Suitability**: All criteria must be met before sample analysis

## 8. DOCUMENTATION
1. Record all analytical data in the laboratory notebook
2. Complete the analytical worksheet
3. Review and approve results before reporting
4. Archive chromatograms and raw data

## 9. REFERENCES
- USP General Chapter <621> Chromatography
- ICH Q2(R1) Validation of Analytical Procedures
- Company Analytical Method Validation Policy

## 10. REVISION HISTORY
| Version | Date | Author | Description of Changes |
|---------|------|--------|----------------------|
| 3.1 | 2024-01-16 | John Doe | Updated column lifecycle monitoring procedures |
| 3.0 | 2024-01-10 | John Doe | Added system suitability requirements |
| 2.1 | 2023-12-15 | Sarah Wilson | Updated mobile phase preparation |

---
**Effective Date**: Upon approval
**Review Date**: January 2025`,
    approvalFlow: [
      {
        id: 'APP-001',
        role: 'Author',
        approver: 'John Doe',
        status: 'approved',
        comments: 'Updated column lifecycle monitoring section based on recent investigation findings',
        timestamp: '2024-01-16T14:30:00Z',
        digitalSignature: 'DS-JD-20240116-1430'
      },
      {
        id: 'APP-002',
        role: 'Lab Supervisor',
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
    ]
  }
};

export function SOPEditor({ sopId, onBack }: SOPEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'document' | 'approval' | 'history'>('document');
  const [approvalComment, setApprovalComment] = useState('');

  const sop = mockSOPData[sopId as keyof typeof mockSOPData];

  React.useEffect(() => {
    if (sop) {
      setContent(sop.content);
    }
  }, [sop]);

  if (!sop) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">SOP Not Found</h2>
          <p className="text-gray-600 mt-2">The requested SOP could not be found.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to SOPs
          </button>
        </div>
      </div>
    );
  }

  const saveDocument = () => {
    console.log('Saving document...');
    setIsEditing(false);
  };

  const approveStep = (stepId: string) => {
    console.log('Approving step:', stepId, 'with comment:', approvalComment);
    setApprovalComment('');
  };

  const rejectStep = (stepId: string) => {
    console.log('Rejecting step:', stepId, 'with comment:', approvalComment);
    setApprovalComment('');
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
            <span>Back to SOPs</span>
          </button>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <Download className="h-4 w-4 inline mr-1" />
              Export PDF
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4 inline mr-1" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 inline mr-1" />
                  Edit
                </>
              )}
            </button>
            {isEditing && (
              <button
                onClick={saveDocument}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Save className="h-4 w-4 inline mr-1" />
                Save
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">{sop.id}</h1>
              <StatusBadge status={sop.status} type="approval" />
            </div>
            <h2 className="text-lg text-gray-700 mb-4">{sop.title}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Version:</span>
                <p className="font-medium">v{sop.version}</p>
              </div>
              <div>
                <span className="text-gray-500">Category:</span>
                <p className="font-medium">{sop.category}</p>
              </div>
              <div>
                <span className="text-gray-500">Last Modified:</span>
                <p className="font-medium">{new Date(sop.lastModified).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Next Review:</span>
                <p className="font-medium">{new Date(sop.nextReview).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Approval Status</h3>
            <div className="space-y-2">
              {sop.approvalFlow.map((step) => (
                <div key={step.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{step.role}</span>
                  <StatusBadge status={step.status} type="approval" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'document', label: 'Document' },
              { id: 'approval', label: 'Approval Workflow' },
              { id: 'history', label: 'Version History' }
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
          {activeTab === 'document' && (
            <div className="space-y-4">
              {sop.changeReason && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-1">Change Reason</h4>
                  <p className="text-sm text-yellow-700">{sop.changeReason}</p>
                </div>
              )}
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="border border-gray-300 rounded-lg">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                      <h3 className="font-medium text-gray-900">Document Editor</h3>
                    </div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-96 p-4 font-mono text-sm border-0 focus:ring-0 resize-none"
                      placeholder="Enter SOP content in Markdown format..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Upload className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload Attachments</p>
                      <p className="text-xs text-gray-500">Add supporting documents, diagrams, or references</p>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                      Browse Files
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                      {content.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4 first:mt-0">{line.substring(2)}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-semibold text-gray-900 mt-5 mb-3">{line.substring(3)}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
                        } else if (line.startsWith('**[UPDATED SECTION]**')) {
                          return <div key={index} className="bg-yellow-100 border-l-4 border-yellow-500 p-2 my-2"><span className="text-yellow-800 font-medium">UPDATED SECTION</span></div>;
                        } else if (line.startsWith('- **')) {
                          const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                          if (match) {
                            return <div key={index} className="ml-4 mb-1"><strong className="text-gray-900">{match[1]}:</strong> <span className="text-gray-700">{match[2]}</span></div>;
                          }
                        } else if (line.startsWith('- ')) {
                          return <div key={index} className="ml-4 mb-1 text-gray-700">• {line.substring(2)}</div>;
                        } else if (line.match(/^\d+\./)) {
                          return <div key={index} className="mb-1 text-gray-700">{line}</div>;
                        } else if (line.startsWith('|')) {
                          return <div key={index} className="font-mono text-xs text-gray-600 border-b border-gray-200 py-1">{line}</div>;
                        } else if (line.trim() === '') {
                          return <div key={index} className="h-2"></div>;
                        } else {
                          return <div key={index} className="mb-2 text-gray-700">{line}</div>;
                        }
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
              
              <div className="space-y-4">
                {sop.approvalFlow.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < sop.approvalFlow.length - 1 && (
                      <div className="absolute left-4 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    <div className="flex items-start space-x-4">
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
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{step.role}</h4>
                            <p className="text-sm text-gray-600">{step.approver}</p>
                          </div>
                          <StatusBadge status={step.status} type="approval" />
                        </div>
                        
                        {step.status === 'approved' && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-700">{step.comments}</p>
                            <p className="text-xs text-gray-500">
                              Approved on {new Date(step.timestamp).toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-600">
                              Digital Signature: {step.digitalSignature}
                            </p>
                          </div>
                        )}
                        
                        {step.status === 'pending' && index === sop.approvalFlow.findIndex(s => s.status === 'pending') && (
                          <div className="mt-3 space-y-3">
                            <textarea
                              value={approvalComment}
                              onChange={(e) => setApprovalComment(e.target.value)}
                              placeholder="Add approval comments..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => approveStep(step.id)}
                                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectStep(step.id)}
                                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                              >
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
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              
              <div className="space-y-4">
                {[
                  {
                    version: '3.1',
                    date: '2024-01-16T14:30:00Z',
                    author: 'John Doe',
                    changes: 'Updated column lifecycle monitoring procedures',
                    status: 'under-review'
                  },
                  {
                    version: '3.0',
                    date: '2024-01-10T10:00:00Z',
                    author: 'John Doe',
                    changes: 'Added system suitability requirements',
                    status: 'approved'
                  },
                  {
                    version: '2.1',
                    date: '2023-12-15T09:00:00Z',
                    author: 'Sarah Wilson',
                    changes: 'Updated mobile phase preparation',
                    status: 'obsolete'
                  }
                ].map((version, index) => (
                  <div key={version.version} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">Version {version.version}</span>
                        <StatusBadge status={version.status} type="approval" />
                        {index === 0 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(version.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{version.changes}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>{version.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}