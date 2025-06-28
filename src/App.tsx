import React, { useState } from 'react';
import { InvestigationProvider } from './contexts/InvestigationContext';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { DashboardView } from './components/Dashboard/DashboardView';
import { TriggerInvestigation } from './components/Investigation/TriggerInvestigation';
import { DecisionTree } from './components/Investigation/DecisionTree';
import { ActiveInvestigations } from './components/Investigation/ActiveInvestigations';
import { InvestigationDetails } from './components/Investigation/InvestigationDetails';
import { RootCauseAnalysis } from './components/Investigation/RootCauseAnalysis';
import { CAPAManagement } from './components/Investigation/CAPAManagement';
import { SOPManagement } from './components/Investigation/SOPManagement';
import { SOPEditor } from './components/Investigation/SOPEditor';
import { ReportsDocumentation } from './components/Investigation/ReportsDocumentation';
import { ReportViewer } from './components/Investigation/ReportViewer';
import { AuditTrail } from './components/Investigation/AuditTrail';

function App() {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string | null>(null);
  const [selectedSOPId, setSelectedSOPId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const getSectionTitle = (section: string) => {
    if (selectedInvestigationId) return 'Investigation Details';
    if (selectedSOPId) return 'SOP Editor';
    if (selectedReportId) return 'Report Viewer';
    
    switch (section) {
      case 'dashboard':
        return 'Investigation Dashboard';
      case 'investigations':
        return 'Active Investigations';
      case 'trigger':
        return 'Trigger Investigation';
      case 'decision-tree':
        return 'MHRA Decision Tree';
      case 'rca':
        return 'Root Cause Analysis';
      case 'capa':
        return 'CAPA Management';
      case 'sop':
        return 'SOP Management';
      case 'reports':
        return 'Reports & Documentation';
      case 'audit':
        return 'Audit Trail';
      default:
        return 'Investigation Module';
    }
  };
  
  const getSectionSubtitle = (section: string) => {
    if (selectedInvestigationId) return `Detailed view for investigation ${selectedInvestigationId}`;
    if (selectedSOPId) return `Document editor for ${selectedSOPId}`;
    if (selectedReportId) return `Report viewer for ${selectedReportId}`;
    
    switch (section) {
      case 'dashboard':
        return 'Overview of all investigation activities and key metrics';
      case 'investigations':
        return 'Manage and track all active investigations';
      case 'trigger':
        return 'Report deviations and initiate new investigations';
      case 'decision-tree':
        return 'Interactive MHRA investigation workflow';
      case 'rca':
        return 'Conduct comprehensive root cause analysis';
      case 'capa':
        return 'Define and manage corrective and preventive actions';
      case 'sop':
        return 'Manage standard operating procedures with version control';
      case 'reports':
        return 'Generate and manage investigation reports and documentation';
      case 'audit':
        return 'Comprehensive audit trail of all system activities';
      default:
        return '';
    }
  };
  
  const renderContent = () => {
    // Handle detailed views
    if (selectedInvestigationId) {
      return (
        <InvestigationDetails
          investigationId={selectedInvestigationId}
          onBack={() => setSelectedInvestigationId(null)}
        />
      );
    }
    
    if (selectedSOPId) {
      return (
        <SOPEditor
          sopId={selectedSOPId}
          onBack={() => setSelectedSOPId(null)}
        />
      );
    }
    
    if (selectedReportId) {
      return (
        <ReportViewer
          reportId={selectedReportId}
          onBack={() => setSelectedReportId(null)}
        />
      );
    }
    
    // Handle main sections
    switch (currentSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'investigations':
        return (
          <ActiveInvestigations
            onInvestigationClick={(id) => setSelectedInvestigationId(id)}
          />
        );
      case 'trigger':
        return <TriggerInvestigation />;
      case 'decision-tree':
        return <DecisionTree />;
      case 'rca':
        return <RootCauseAnalysis />;
      case 'capa':
        return <CAPAManagement />;
      case 'sop':
        return (
          <SOPManagement
            onSOPClick={(id) => setSelectedSOPId(id)}
          />
        );
      case 'reports':
        return (
          <ReportsDocumentation
            onReportClick={(id) => setSelectedReportId(id)}
          />
        );
      case 'audit':
        return <AuditTrail />;
      default:
        return <DashboardView />;
    }
  };
  
  return (
    <InvestigationProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar 
          currentSection={currentSection} 
          onSectionChange={(section) => {
            setCurrentSection(section);
            setSelectedInvestigationId(null);
            setSelectedSOPId(null);
            setSelectedReportId(null);
          }} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            title={getSectionTitle(currentSection)}
            subtitle={getSectionSubtitle(currentSection)}
          />
          
          <main className="flex-1 overflow-auto bg-gray-50">
            {currentSection === 'decision-tree' ? (
              renderContent()
            ) : (
              <div className="p-6">
                {renderContent()}
              </div>
            )}
          </main>
        </div>
      </div>
    </InvestigationProvider>
  );
}

export default App;