import React, { useState, useEffect } from 'react';
import { ToastProvider, useToast } from './context/ToastContext';
import { useSEO } from './hooks/useSEO';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import CommandPalette from './components/CommandPalette';
import ProjectDossier from './components/projects/ProjectDossier';
import CookieBanner from './components/common/CookieBanner';
import MobileStickyCTA from './components/common/MobileStickyCTA';
import ConfirmationModal from './components/common/ConfirmationModal';

// Feature Views
import DashboardView from './views/DashboardView';
import ExecutiveSummaryView from './views/ExecutiveSummaryView';
import ProjectsView from './views/ProjectsView';
import ProjectMapView from './views/ProjectMapView';
import PredictiveView from './views/PredictiveView';
import ScenarioSimulatorView from './views/ScenarioSimulatorView';
import BenchmarkingView from './views/BenchmarkingView';
import OverrunDriversView from './views/OverrunDriversView';
import AIAssistantView from './views/AIAssistantView';
import GovernanceView from './views/GovernanceView';
import NotFoundView from './views/NotFoundView';
import PrivacyPolicyView from './views/PrivacyPolicyView';
import TermsView from './views/TermsView';

// Services & Datasets
import {
  fetchSystemStatus,
  fetchProjects,
  fetchWarnings,
  fetchAuditLogs,
  runAIQuery,
  approveAction
} from './services/api';
import { trackEvent } from './services/analytics';
import { MOCK_HOLDOUT_PROJECTS, getValue } from './data/mockProjects';

function CockpitApp() {
  const toast = useToast();

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar Collapsed State (persisted in localStorage)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('paimana_sidebar_collapsed') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('paimana_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Confirmation / Thank You Modal State
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    referenceId: '',
    title: '',
    message: ''
  });

  // Projects State
  const [projects, setProjects] = useState(MOCK_HOLDOUT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState(MOCK_HOLDOUT_PROJECTS[0]);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Dynamic Document Title and SEO Meta Tags
  useSEO({ activeTab, selectedProject, isDossierOpen });

  // AI & Chat State
  const [chatInput, setChatInput] = useState("Why is this project flagged high risk?");
  const [chatLoading, setChatLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [orchestrationResult, setOrchestrationResult] = useState(null);
  const [attachedFile, setAttachedFile] = useState(null);

  // Governance State
  const [warningsList, setWarningsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    status: 'ONLINE',
    llm: { provider: 'nvidia-nim', model: 'meta/llama-3.2-11b-vision-instruct', status: 'ACTIVE' },
    database: { backend: 'Supabase PostgreSQL / Local DB', connected: true },
    agents: { total_agents: 5 }
  });

  const ragResults = [
    {
      document: "NHAI_Standard_Contract_GCC_2024.pdf",
      clause: "Clause 44.1 - Compensation for Delay",
      text: "If the Contractor fails to comply with the Time for Completion under Sub-Clause 8.2, the Contractor shall pay to the Employer 0.05% of the Contract Price per day of delay, capped at 10% of total Contract Value.",
      score: 0.94
    },
    {
      document: "MoSPI_Infrastructure_Monitoring_Guidelines_2025.pdf",
      clause: "Section 12.3 - Mandatory Early Warning Protocol",
      text: "Any project incurring a milestone slippage exceeding 90 days or cost escalation >15% must trigger an automated Level-2 Advisory Notice to the Empowered Committee of Secretaries (CoS).",
      score: 0.89
    }
  ];

  // Load telemetry & initial data
  useEffect(() => {
    async function loadData() {
      const [status, projList, warns, logs] = await Promise.all([
        fetchSystemStatus(),
        fetchProjects(50),
        fetchWarnings(),
        fetchAuditLogs()
      ]);
      if (status) setSystemStatus(status);
      if (projList && projList.length > 0) {
        setProjects(projList);
        setSelectedProject(projList[0]);
      }
      if (warns) setWarningsList(warns);
      if (logs) setAuditLogs(logs);
    }
    loadData();
  }, []);

  // Keyboard shortcut: Ctrl + K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Handlers
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setIsDossierOpen(true);
    trackEvent('project_opened', { project_code: project?.project_code });
  };

  const handleAnalyzeProject = (project) => {
    setSelectedProject(project);
    setActiveTab('llm_assistant');
    const prompt = `Why is ${getValue(project.project_name)} (${getValue(project.project_code)}) flagged high risk?`;
    setChatInput(prompt);
    handleExecuteQuery(prompt, null, project);
  };

  const handleDraftWarning = (project) => {
    setSelectedProject(project);
    setActiveTab('early_warnings');
    toast.info(
      "Directives Docket Loaded",
      `Viewing early warnings and statutory notices for ${getValue(project.project_code)}.`
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isCsv = file.name.toLowerCase().endsWith('.csv');
    const isPdf = file.name.toLowerCase().endsWith('.pdf');

    if (!isCsv && !isPdf) {
      toast.error("Invalid File Format", "Please upload a valid .CSV snapshot dataset or .PDF contract document.");
      return;
    }

    const fileObj = {
      name: file.name,
      type: isCsv ? 'csv' : 'pdf',
      size: (file.size / 1024).toFixed(1) + ' KB',
      rawFile: file
    };

    setAttachedFile(fileObj);
    setActiveTab('llm_assistant');
    toast.success("File Ingested", `Loaded ${file.name} for autonomous AI processing.`);

    const msg = isCsv
      ? `[CSV Dataset Ingestion] Ingested project snapshot "${file.name}". Run XGBoost ML cost overrun & schedule delay prediction model.`
      : `[PDF Contract Ingestion] Ingested contract agreement "${file.name}". Extract GCC clauses & liquidated damages via pgvector RAG.`;

    handleExecuteQuery(msg, fileObj);
    e.target.value = null;
  };

  const handleLoadDemoFile = (type) => {
    const demoObj = type === 'csv'
      ? { name: "MoSPI_2026_Holdout_Projects_Snapshot.csv", type: 'csv', size: "148.5 KB", rawFile: null }
      : { name: "NHAI_Standard_Contract_GCC_2024.pdf", type: 'pdf', size: "1.4 MB", rawFile: null };

    setAttachedFile(demoObj);
    setActiveTab('llm_assistant');
    toast.info("Demo Target Loaded", `Loaded sample ${type.toUpperCase()} file for demonstration.`);

    const msg = type === 'csv'
      ? `[CSV Dataset Ingestion] Ingested holdout dataset "${demoObj.name}". Run XGBoost ML cost overrun & delay predictions.`
      : `[PDF Contract Ingestion] Ingested contract agreement "${demoObj.name}". Extract GCC delay clauses & liquidated damages using RAG.`;

    handleExecuteQuery(msg, demoObj);
  };

  const handleExecuteQuery = async (queryText, fileOverride = undefined, projectOverride = undefined) => {
    const activeFile = fileOverride !== undefined ? fileOverride : attachedFile;
    const promptMessage = queryText || chatInput;
    const targetProjObj = projectOverride || selectedProject;

    if (!promptMessage && !activeFile) return;

    setChatLoading(true);
    setPipelineStep(1);
    trackEvent('ai_query_submitted', { prompt: promptMessage });

    setPipelineStep(4);
    try {
      const result = await runAIQuery({
        projectId: targetProjObj?.project_code || "PROJECT-ACTIVE",
        message: promptMessage,
        fileType: activeFile?.type || null,
        fileContent: null,
        rawFile: activeFile?.rawFile || null,
        projectObj: targetProjObj
      });

      setOrchestrationResult(result);
    } catch (err) {
      console.error("AI execution error:", err);
      toast.error("Inference Error", "Failed to execute AI pipeline. Please try again.");
    } finally {
      setChatLoading(false);
      setPipelineStep(0);
    }
  };

  const handleApproveActionState = async (actionId, approved, comments = "Reviewed by MoSPI Director.") => {
    await approveAction(actionId, approved, comments);

    setWarningsList(prev => prev.map(w =>
      w.action_id === actionId
        ? { ...w, status: approved ? 'APPROVED_DISPATCHED' : 'REJECTED' }
        : w
    ));

    setAuditLogs(prev => [
      {
        id: `AUD-${Math.floor(Math.random() * 9000 + 1000)}`,
        action: approved ? "ACTION_APPROVED_DISPATCHED" : "ACTION_REJECTED",
        user: "director.ipmd@mospi.gov.in",
        resource: actionId,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);

    trackEvent('warning_reviewed', { action_id: actionId, approved });

    // Trigger statutory confirmation / thank you modal
    setConfirmationModal({
      isOpen: true,
      referenceId: actionId,
      title: approved ? "Statutory Directive Authorized & Dispatched" : "Directive Formally Rejected",
      message: approved
        ? `The Level-2 statutory notice for ${actionId} has been signed, authorized, and logged into the Section 23 compliance audit trail.`
        : `The recommended notice for ${actionId} has been formally rejected and recorded in the audit log.`
    });
  };

  // Tab Title & Category mapping for Header breadcrumbs
  const tabMetadata = {
    dashboard: { title: 'Cockpit Overview', category: 'COMMAND CENTER' },
    executive_summary: { title: 'Executive Summary Briefing', category: 'COMMAND CENTER' },
    projects: { title: 'Projects Intelligence Directory', category: 'PROJECT INTELLIGENCE' },
    project_map: { title: 'National Project Map (GIS)', category: 'PROJECT INTELLIGENCE' },
    critical_watchlist: { title: 'Critical Risk Watchlist', category: 'PROJECT INTELLIGENCE' },
    predictive_models: { title: 'Cost & Time ML Overrun Predictor', category: 'ANALYTICS & ML' },
    scenario_simulator: { title: 'Scenario What-If Sandbox', category: 'ANALYTICS & ML' },
    benchmarking: { title: 'Sector Benchmarks & Scatter Matrix', category: 'ANALYTICS & ML' },
    driver_analysis: { title: 'Root Cause Overrun Drivers (Pareto)', category: 'ANALYTICS & ML' },
    llm_assistant: { title: 'Autonomous Multi-Agent Assistant', category: 'AI & CONTRACTS' },
    document_intelligence: { title: 'Contract RAG Intelligence', category: 'AI & CONTRACTS' },
    early_warnings: { title: 'Early Warning Action Center', category: 'GOVERNANCE & AUDIT' },
    compliance: { title: 'Statutory Compliance Checklist', category: 'GOVERNANCE & AUDIT' },
    audit_trail: { title: 'Audit Trail Records (Section 23)', category: 'GOVERNANCE & AUDIT' },
    privacy_policy: { title: 'Institutional Privacy Policy', category: 'LEGAL & PLATFORM' },
    terms_of_use: { title: 'Terms of Use & Advisory Framework', category: 'LEGAL & PLATFORM' },
    not_found: { title: 'Page Not Found (404)', category: 'SYSTEM RECOVERY' },
    system_health: { title: 'System Health & Engine Telemetry', category: 'SYSTEM' }
  }[activeTab] || { title: 'Cockpit Overview', category: 'COMMAND CENTER' };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-slate-900 font-sans flex flex-col">
      {/* Top Header / Masthead (Full width across top of viewport) */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          trackEvent('page_view', { page: tab });
        }}
        onOpenCmd={() => setIsCmdOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        selectedProject={selectedProject}
        onOpenDossier={handleSelectProject}
        systemStatus={systemStatus}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
        {/* Navigation Sidebar (Desktop sticky below header, mobile sliding drawer) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            trackEvent('page_view', { page: tab });
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          criticalCount={342}
          pendingWarningsCount={warningsList.filter(w => w.status === 'PENDING_HUMAN_APPROVAL').length}
          systemStatus={systemStatus}
          isMobileMenuOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
          onOpenCmd={() => setIsCmdOpen(true)}
        />

        {/* Main Content Column */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Centered Main Content Area */}
          <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 sm:pb-8">
        <div>
            {activeTab === 'dashboard' && (
              <DashboardView
                projects={projects}
                onSelectProject={handleSelectProject}
                onAnalyzeProject={handleAnalyzeProject}
                onDraftWarning={handleDraftWarning}
                onTriggerQuickAI={(prompt) => {
                  setActiveTab('llm_assistant');
                  setChatInput(prompt);
                  handleExecuteQuery(prompt);
                }}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onOpenSimulator={() => setActiveTab('predictive_models')}
              />
            )}

            {activeTab === 'executive_summary' && (
              <ExecutiveSummaryView
                projects={projects}
                warningsList={warningsList}
                onSelectProject={handleSelectProject}
              />
            )}

            {(activeTab === 'projects' || activeTab === 'critical_watchlist') && (
              <ProjectsView
                projects={
                  activeTab === 'critical_watchlist'
                    ? projects.filter(p => getValue(p.target_is_high_risk) == 1 || p.composite_risk_score > 70)
                    : projects
                }
                onSelectProject={handleSelectProject}
                onAnalyzeProject={handleAnalyzeProject}
              />
            )}



            {activeTab === 'predictive_models' && (
              <PredictiveView />
            )}

            {activeTab === 'scenario_simulator' && (
              <ScenarioSimulatorView />
            )}

            {activeTab === 'benchmarking' && (
              <BenchmarkingView />
            )}

            {activeTab === 'driver_analysis' && (
              <OverrunDriversView />
            )}

            {(activeTab === 'llm_assistant' || activeTab === 'document_intelligence') && (
              <AIAssistantView
                chatInput={chatInput}
                setChatInput={setChatInput}
                onRunQuery={(q) => handleExecuteQuery(q)}
                chatLoading={chatLoading}
                pipelineStep={pipelineStep}
                orchestrationResult={orchestrationResult}
                selectedProject={selectedProject}
                attachedFile={attachedFile}
                onFileSelect={handleFileSelect}
                onLoadDemoFile={handleLoadDemoFile}
                onClearFile={() => setAttachedFile(null)}
                ragResults={ragResults}
                onApproveAction={handleApproveActionState}
              />
            )}

            {(activeTab === 'early_warnings' || activeTab === 'compliance' || activeTab === 'audit_trail' || activeTab === 'system_health') && (
              <GovernanceView
                warningsList={warningsList}
                auditLogs={auditLogs}
                onApproveAction={handleApproveActionState}
              />
            )}

            {activeTab === 'privacy_policy' && (
              <PrivacyPolicyView onNavigateHome={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'terms_of_use' && (
              <TermsView onNavigateHome={() => setActiveTab('dashboard')} />
            )}

            {activeTab === 'not_found' && (
              <NotFoundView onNavigateHome={() => setActiveTab('dashboard')} />
            )}
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 sm:px-6 text-xs text-slate-500 font-sans">
        <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <img
              src="/national-emblem.png"
              alt="National Emblem of India"
              className="h-8 w-auto object-contain shrink-0 opacity-85"
              style={{ maxHeight: '32px' }}
            />
            <div className="h-6 w-px bg-slate-200 shrink-0 hidden sm:block" />
            <div>
              <div className="font-sans font-semibold text-slate-800 text-xs">
                PAIMANA AI · National Infrastructure Intelligence System
              </div>
              <div className="text-[11px] text-slate-500">
                MoSPI | SIH26103 · Infrastructure &amp; Project Monitoring Division (IPMD)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <button onClick={() => setActiveTab('privacy_policy')} className="hover:text-purple-700 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveTab('terms_of_use')} className="hover:text-purple-700 transition-colors">Terms of Use</button>
            <span className="font-mono text-slate-400">SIH 26103</span>
          </div>
        </div>
      </footer>
        </div>
      </div>

      {/* Slide-over Project Dossier */}
      <ProjectDossier
        project={selectedProject}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onRunAIAudit={handleAnalyzeProject}
        onDraftWarning={handleDraftWarning}
      />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCmdOpen}
        onClose={setIsCmdOpen}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          trackEvent('page_view', { page: tab });
        }}
        onSelectProject={(proj) => {
          setSelectedProject(proj);
          setIsDossierOpen(true);
        }}
        onTriggerQuery={(prompt) => {
          setChatInput(prompt);
          setActiveTab('llm_assistant');
          handleExecuteQuery(prompt);
        }}
        projects={projects}
      />

      {/* Mobile Sticky CTA */}
      <MobileStickyCTA
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          trackEvent('cta_click', { target: tab });
        }}
      />

      {/* Session Cookie / Preferences Banner */}
      <CookieBanner />

      {/* Statutory Action Confirmation / Thank You Modal */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmationModal.title}
        referenceId={confirmationModal.referenceId}
        message={confirmationModal.message}
        onViewAuditTrail={() => setActiveTab('audit_trail')}
        onReturnHome={() => setActiveTab('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CockpitApp />
    </ToastProvider>
  );
}
