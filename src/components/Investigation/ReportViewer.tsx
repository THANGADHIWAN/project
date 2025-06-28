import React, { useState } from 'react';
import { ArrowLeft, Download, Printer as Print, Share, Calendar, User, FileText, BarChart3 } from 'lucide-react';
import { StatusBadge } from '../Common/StatusBadge';

interface ReportViewerProps {
  reportId: string;
  onBack: () => void;
}

const mockReportData = {
  'RPT-2024-001': {
    id: 'RPT-2024-001',
    title: 'Monthly Deviation Summary - January 2024',
    type: 'summary',
    status: 'approved',
    createdBy: 'Sarah Wilson',
    createdDate: '2024-01-31T16:00:00Z',
    approvedBy: 'Mike Johnson',
    approvalDate: '2024-01-31T18:00:00Z',
    content: `
# Monthly Deviation Summary Report
**January 2024**

---

## Executive Summary

This report provides a comprehensive overview of all deviations and investigations conducted during January 2024. A total of 12 deviations were reported, with 8 investigations completed and 4 currently in progress.

### Key Metrics
- **Total Deviations**: 12
- **Completed Investigations**: 8 (67%)
- **In Progress**: 4 (33%)
- **Average Resolution Time**: 12.5 days
- **Critical Deviations**: 2 (17%)

---

## Deviation Breakdown by Type

| Deviation Type | Count | Percentage | Avg. Resolution Time |
|----------------|-------|------------|---------------------|
| Out of Specification | 5 | 42% | 15.2 days |
| Equipment Failure | 3 | 25% | 8.7 days |
| Procedural Deviation | 2 | 17% | 10.5 days |
| Environmental | 1 | 8% | 6.0 days |
| Contamination | 1 | 8% | 18.0 days |

---

## Critical Investigations

### INV-2024-001: Out of Specification - Sample SM-2024-001
- **Status**: In Progress (RCA Phase)
- **Priority**: High
- **Assigned To**: John Doe
- **Root Cause**: Under investigation - potential HPLC column degradation
- **Expected Completion**: January 25, 2024

### INV-2024-002: Equipment Failure - HPLC-001
- **Status**: CAPA Implementation
- **Priority**: Critical
- **Assigned To**: Mike Johnson
- **Root Cause**: Pump seal failure due to exceeded maintenance interval
- **CAPA Actions**: 
  - Immediate: Replace pump seals
  - Preventive: Implement automated maintenance scheduling

---

## Trend Analysis

### Monthly Comparison
- **December 2023**: 8 deviations
- **January 2024**: 12 deviations
- **Change**: +50% increase

### Contributing Factors
1. **Equipment Age**: 40% of deviations related to aging HPLC systems
2. **Training Gaps**: 25% attributed to procedural non-compliance
3. **Environmental**: 15% due to HVAC system fluctuations
4. **Other**: 20% miscellaneous causes

---

## CAPA Effectiveness Review

### Completed CAPAs (Q4 2023)
- **Total CAPAs**: 15
- **Effective**: 13 (87%)
- **Partially Effective**: 2 (13%)
- **Ineffective**: 0 (0%)

### Key Improvements Implemented
1. Enhanced equipment maintenance program
2. Revised analyst training curriculum
3. Upgraded environmental monitoring system
4. Implemented real-time deviation tracking

---

## Regulatory Compliance

### Inspection Readiness
- All investigations documented per FDA guidelines
- MHRA decision tree methodology consistently applied
- Electronic signatures and audit trails maintained
- Deviation trending analysis current

### Outstanding Items
- 2 investigations pending final QA review
- 1 CAPA effectiveness validation due February 15
- Annual deviation trend report due February 28

---

## Recommendations

### Immediate Actions (Next 30 Days)
1. **Equipment Replacement**: Prioritize replacement of HPLC-003 (>10 years old)
2. **Training Refresh**: Conduct refresher training for all analysts on sample preparation
3. **Process Improvement**: Implement automated column usage tracking

### Long-term Initiatives (Next 6 Months)
1. **Technology Upgrade**: Evaluate implementation of AI-powered deviation prediction
2. **Process Optimization**: Review and update all QC SOPs
3. **Capacity Planning**: Assess need for additional analytical resources

---

## Conclusion

January 2024 showed an increase in deviation frequency compared to the previous month, primarily driven by equipment-related issues. The implementation of enhanced maintenance programs and training initiatives is expected to reduce deviation rates in the coming months.

All investigations are progressing according to established timelines, with robust root cause analysis and appropriate CAPA implementation. The laboratory continues to maintain high standards of regulatory compliance and quality assurance.

---

**Report Prepared By**: Sarah Wilson, QA Manager  
**Review Date**: January 31, 2024  
**Next Review**: February 28, 2024  
**Distribution**: Lab Management, QA Team, Regulatory Affairs

---

*This report contains confidential and proprietary information. Distribution is restricted to authorized personnel only.*
    `
  },
  'RPT-2024-002': {
    id: 'RPT-2024-002',
    title: 'Investigation Report - INV-2024-001',
    type: 'investigation',
    status: 'pending-review',
    createdBy: 'John Doe',
    createdDate: '2024-01-16T14:30:00Z',
    content: `
# Investigation Report
**Investigation ID**: INV-2024-001  
**Deviation ID**: DEV-2024-001

---

## Investigation Summary

### Deviation Details
- **Sample ID**: SM-2024-001
- **Test Method**: HPLC Assay for API Content
- **Instrument**: HPLC-001
- **Analyst**: John Doe
- **Date of Analysis**: January 15, 2024
- **Deviation Type**: Out of Specification (OOS)

### Observation
Assay result of 98.2% was obtained, which is below the specification limit of 98.5-101.5%. The sample was tested in duplicate with consistent results (98.1% and 98.3%).

---

## Immediate Actions Taken

1. **Sample Quarantine**: Sample immediately quarantined pending investigation
2. **Instrument Check**: HPLC system calibration and performance verified
3. **Method Verification**: Analytical method parameters confirmed
4. **Personnel Verification**: Analyst qualifications and training confirmed current

---

## Root Cause Analysis

### MHRA Decision Tree Application

#### Phase 1: Initial Assessment
- **Question**: Was the test performed correctly?
- **Answer**: Yes - All method parameters followed correctly
- **Evidence**: Analyst training records current, method followed per SOP-QC-001

#### Phase 2: Sample Integrity
- **Question**: Was the sample handled and stored correctly?
- **Answer**: Yes - Sample storage conditions verified within specification
- **Evidence**: Temperature logs reviewed, no deviations noted

#### Phase 3: Instrument Performance
- **Question**: Was the instrument performing within specification?
- **Answer**: Partially - System suitability met but column performance declining
- **Evidence**: 
  - System suitability: RSD 1.8% (Spec: ≤2.0%)
  - Column usage: 2,150 injections (Recommended limit: 2,000)
  - Back pressure: 15% increase from baseline

#### Phase 4: Method Suitability
- **Question**: Is the analytical method appropriate and validated?
- **Answer**: Yes - Method validated and current
- **Evidence**: Method validation report MV-2023-001 reviewed

### Root Cause Determination
**Primary Root Cause**: HPLC column degradation due to usage beyond recommended lifecycle

**Contributing Factors**:
1. Lack of automated column usage tracking
2. Manual record keeping leading to oversight
3. Absence of proactive column replacement schedule

---

## Supporting Evidence

### Laboratory Data
- Original chromatograms showing peak shape deterioration
- System suitability data trending over past 30 days
- Column usage log showing 2,150 injections

### Retesting Results
- New column installed: Results 99.8%, 100.1% (within specification)
- Retained sample tested: Results 99.7%, 99.9% (within specification)
- Adjacent samples from same batch: All results within specification

---

## Impact Assessment

### Product Impact
- **Batch Status**: Released batch SM-2024-001 confirmed compliant after retesting
- **Customer Impact**: None - batch results confirmed within specification
- **Regulatory Impact**: None - investigation documented per requirements

### Process Impact
- Temporary delay in analytical testing during investigation
- Column replacement required earlier than scheduled
- Additional analyst time for retesting and documentation

---

## Corrective and Preventive Actions (CAPA)

### Corrective Actions
1. **CA-001**: Replace HPLC column and perform system suitability testing
   - **Responsible**: John Doe
   - **Due Date**: January 20, 2024
   - **Status**: Completed

2. **CA-002**: Retest affected samples with new column
   - **Responsible**: John Doe  
   - **Due Date**: January 22, 2024
   - **Status**: Completed

### Preventive Actions
1. **PA-001**: Implement automated column usage tracking system
   - **Responsible**: IT Department
   - **Due Date**: February 15, 2024
   - **Status**: In Progress

2. **PA-002**: Update SOP-QC-001 to include mandatory column lifecycle monitoring
   - **Responsible**: QA Department
   - **Due Date**: January 30, 2024
   - **Status**: In Progress

---

## Conclusion

The investigation determined that the OOS result was caused by HPLC column degradation due to usage beyond the recommended lifecycle. The root cause has been addressed through column replacement, and preventive measures are being implemented to prevent recurrence.

The batch in question has been confirmed to meet specifications through retesting with a new column. No customer or regulatory impact has been identified.

---

## Approval Signatures

**Investigator**: John Doe, Lab Analyst  
**Date**: January 16, 2024  
**Digital Signature**: DS-JD-20240116-1430

**Lab Supervisor**: [Pending Review]  
**Date**: [Pending]  
**Digital Signature**: [Pending]

**QA Manager**: [Pending Review]  
**Date**: [Pending]  
**Digital Signature**: [Pending]

---

**Investigation Completion Date**: January 16, 2024  
**Report Distribution**: Lab Management, QA, Regulatory Affairs
    `
  }
};

export function ReportViewer({ reportId, onBack }: ReportViewerProps) {
  const [showPrintDialog, setShowPrintDialog] = useState(false);

  const report = mockReportData[reportId as keyof typeof mockReportData];

  if (!report) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Report Not Found</h2>
          <p className="text-gray-600 mt-2">The requested report could not be found.</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  const downloadReport = () => {
    // Create a blob with the report content
    const blob = new Blob([report.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}_${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: `Report: ${report.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Report link copied to clipboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 print:shadow-none print:border-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Reports</span>
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={shareReport}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Share className="h-4 w-4 inline mr-1" />
              Share
            </button>
            <button
              onClick={printReport}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Print className="h-4 w-4 inline mr-1" />
              Print
            </button>
            <button
              onClick={downloadReport}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Download className="h-4 w-4 inline mr-1" />
              Download
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-2">
              {report.type === 'summary' ? (
                <BarChart3 className="h-6 w-6 text-green-600" />
              ) : (
                <FileText className="h-6 w-6 text-blue-600" />
              )}
              <h1 className="text-2xl font-bold text-gray-900">{report.id}</h1>
              <StatusBadge status={report.status} type="approval" />
            </div>
            <h2 className="text-lg text-gray-700 mb-4">{report.title}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Created By:</span>
                <p className="font-medium">{report.createdBy}</p>
              </div>
              <div>
                <span className="text-gray-500">Created Date:</span>
                <p className="font-medium">{new Date(report.createdDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-gray-500">Type:</span>
                <p className="font-medium capitalize">{report.type}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 print:hidden">
            <h3 className="font-medium text-gray-900 mb-3">Report Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Generated: {new Date(report.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Author: {report.createdBy}</span>
              </div>
              {report.approvedBy && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>Approved by: {report.approvedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 print:shadow-none print:border-none">
        <div className="p-8 print:p-0">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed">
              {report.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-6 first:mt-0 print:text-2xl print:mt-4 print:mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-4 print:text-xl print:mt-3 print:mb-2">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-medium text-gray-900 mt-5 mb-3 print:text-lg print:mt-2 print:mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <div key={index} className="font-semibold text-gray-900 mt-4 mb-2">{line.substring(2, line.length - 2)}</div>;
                } else if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                  if (match) {
                    return <div key={index} className="ml-4 mb-2"><strong className="text-gray-900">{match[1]}:</strong> <span className="text-gray-700">{match[2]}</span></div>;
                  }
                } else if (line.startsWith('- ')) {
                  return <div key={index} className="ml-4 mb-1 text-gray-700">• {line.substring(2)}</div>;
                } else if (line.match(/^\d+\./)) {
                  return <div key={index} className="mb-1 text-gray-700">{line}</div>;
                } else if (line.startsWith('|')) {
                  return (
                    <div key={index} className="font-mono text-sm text-gray-600 border-b border-gray-200 py-2 grid grid-cols-4 gap-4">
                      {line.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                        <span key={cellIndex} className="text-left">{cell.trim()}</span>
                      ))}
                    </div>
                  );
                } else if (line.startsWith('---')) {
                  return <hr key={index} className="my-6 border-gray-300 print:my-3" />;
                } else if (line.trim() === '') {
                  return <div key={index} className="h-3"></div>;
                } else {
                  return <div key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</div>;
                }
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-4 text-center text-sm text-gray-600 print:hidden">
        <p>This report was generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">For questions about this report, contact the Quality Assurance team.</p>
      </div>
    </div>
  );
}