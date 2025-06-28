import React, { useState } from 'react';
import { InvestigationProvider } from './contexts/InvestigationContext';
import { Sidebar } from './components/layout/Sidebar';
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
      <div className="flex h-screen bg-gray-50">
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