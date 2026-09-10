import { useEffect } from 'react';
import { getValue } from '../data/mockProjects';

const TAB_SEO_MAP = {
  dashboard: {
    title: 'Command Center Cockpit',
    description: 'National infrastructure intelligence cockpit monitoring 1,981 central sector projects, critical watchlists, and capital allocation.'
  },
  executive_summary: {
    title: 'Executive Portfolio Briefing',
    description: '30-second high-level infrastructure brief for Committee of Secretaries (CoS) and ministry leadership.'
  },
  projects: {
    title: 'Projects Intelligence Directory',
    description: 'Explore active central sector infrastructure projects, physical-financial milestones, cost overruns, and risk scoring.'
  },
  critical_watchlist: {
    title: 'Critical Risk Watchlist',
    description: 'Targeted surveillance of Tier-1 critical infrastructure projects exceeding 15% budget escalation or 12-month schedule slippage.'
  },
  project_map: {
    title: 'National GIS Project Map',
    description: 'Interactive geospatial distribution of central sector capital projects across Indian States and Union Territories.'
  },
  predictive_models: {
    title: 'Predictive Overrun ML Engine',
    description: 'XGBoost v2.4 and Random Forest ML models forecasting completion delays, budget escalations, and SHAP root cause attribution.'
  },
  scenario_simulator: {
    title: 'Scenario What-If Sandbox',
    description: 'Simulate materials inflation shocks, statutory clearance shifts, and contractor liquidity interventions to test project resilience.'
  },
  benchmarking: {
    title: 'Sector & Agency Benchmark Matrix',
    description: 'Comparative performance benchmarks and delay vs. cost overrun scatter matrices across CPSU executing agencies.'
  },
  driver_analysis: {
    title: 'Overrun Root Cause Drivers (Pareto)',
    description: 'Systemic Pareto decomposition of 20+ years of historical MoSPI infrastructure cost escalation root causes.'
  },
  llm_assistant: {
    title: 'Multi-Agent Intelligence Assistant',
    description: 'Autonomous multi-agent query center integrating XGBoost ML inference, pgvector contract RAG, and statutory warning generation.'
  },
  document_intelligence: {
    title: 'Contract RAG Intelligence',
    description: 'Semantic clause retrieval and delay liquidated damages audit across standard GCC contracts and MoSPI guidelines.'
  },
  early_warnings: {
    title: 'Early Warning Center & Approvals',
    description: 'Level-2 early warning advisory docket and human-in-the-loop statutory directive review queue.'
  },
  compliance: {
    title: 'Statutory Compliance Checklist',
    description: 'Institutional compliance audit against Section 23 tamper-evident protocols and national monitoring guidelines.'
  },
  audit_trail: {
    title: 'Audit Trail Records (Section 23)',
    description: 'Immutable, tamper-evident audit logs tracking all operator decisions, model inferences, and notice authorizations.'
  },
  system_health: {
    title: 'System Health & Engine Telemetry',
    description: 'Real-time operational telemetry for FastAPI microservices, NVIDIA NIM inference, and Supabase pgvector stores.'
  },
  privacy_policy: {
    title: 'Privacy Policy',
    description: 'Privacy policy and data governance specifications for the PAIMANA AI infrastructure monitoring platform.'
  },
  terms_of_use: {
    title: 'Terms of Use',
    description: 'Terms of service, AI decision-support limitations, and administrative usage rules for PAIMANA AI.'
  },
  not_found: {
    title: 'Page Not Found',
    description: 'The requested infrastructure intelligence page or dossier reference could not be located.'
  }
};

export function useSEO({ activeTab, selectedProject = null, isDossierOpen = false }) {
  useEffect(() => {
    let pageTitle = 'National Infrastructure Intelligence Cockpit';
    let pageDescription = 'PAIMANA AI provides predictive ML surveillance for 1,981 central infrastructure projects.';

    if (isDossierOpen && selectedProject) {
      const code = getValue(selectedProject.project_code, 'PAIM');
      const name = getValue(selectedProject.project_name, 'Project Dossier');
      pageTitle = `Dossier: ${code} (${name})`;
      pageDescription = `Comprehensive dossier, S-curve trajectory, and SHAP variance drivers for ${code} (${name}).`;
    } else if (TAB_SEO_MAP[activeTab]) {
      pageTitle = TAB_SEO_MAP[activeTab].title;
      pageDescription = TAB_SEO_MAP[activeTab].description;
    }

    const fullTitle = `PAIMANA AI | ${pageTitle} | MoSPI`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', pageDescription);
    }

    // Update Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDescription);

    // Update Twitter Tags
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', fullTitle);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDescription);
  }, [activeTab, selectedProject, isDossierOpen]);
}
