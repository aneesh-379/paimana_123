/**
 * PAIMANA Holdout & Baseline Project Datasets
 * Sourced from MoSPI OCMS National Infrastructure Central Sector Portfolio (>= 150 Cr)
 */

export const MOCK_HOLDOUT_PROJECTS = [
  {
    project_code: "PAIM-619054",
    project_name: "Greenfield Expressway Expansion Phase I",
    sector: "Transport & Logistics",
    ministry: "Ministry of Road Transport and Highways",
    state: "Maharashtra",
    district: "Thane - Nashik Corridor",
    implementing_agency: "NHAI",
    contractor: "Larsen & Toubro Ltd. - Infra Division",
    original_cost: 1162.76,
    revised_cost: 1390.00,
    expenditure: 494.72,
    physical_progress: 42.5,
    financial_progress: 42.5,
    sanction_date: "2024-03-01",
    original_doc: "2027-12-31",
    snapshot_date: "2026-01-01",
    target_final_delay_months: 16.5,
    target_cost_overrun_pct: 19.5,
    target_is_high_risk: 1,
    composite_risk_score: 84,
    clearance_status: "PENDING",
    primary_risk_driver: "Land Acquisition & RoW Clearances (Forest Zone 4)",
    secondary_risk_driver: "Delayed Utility Relocation on Km 42-68",
    status: "CRITICAL_ATTENTION",
    gcc_delay_clause: "Clause 44.1 - Compensation for Delay (Max 10% Contract Value)",
    warning_notice_id: "ACT-WARN-9041",
    warning_issued: true
  },
  {
    project_code: "PAIM-1042",
    project_name: "Delhi-Mumbai Expressway Connectivity Spur",
    sector: "Transport & Logistics",
    ministry: "Ministry of Road Transport and Highways",
    state: "Gujarat",
    district: "Vadodara Sub-Division",
    implementing_agency: "NHAI",
    contractor: "Dilip Buildcon JV",
    original_cost: 1450.0,
    revised_cost: 1720.0,
    expenditure: 890.0,
    physical_progress: 48.5,
    financial_progress: 61.4,
    sanction_date: "2020-03-15",
    original_doc: "2023-12-31",
    snapshot_date: "2022-09-01",
    target_final_delay_months: 18.0,
    target_cost_overrun_pct: 22.4,
    target_is_high_risk: 1,
    composite_risk_score: 87,
    clearance_status: "CLEAR",
    primary_risk_driver: "Physical vs Financial Progress Deficit (-12.9% Gap)",
    secondary_risk_driver: "Monsoon Inundation & Bridge Substructure Redesign",
    status: "HIGH_RISK",
    gcc_delay_clause: "Clause 44.1 - Liquidated Damages Assessment",
    warning_notice_id: null,
    warning_issued: false
  },
  {
    project_code: "PAIM-3088",
    project_name: "Ultra Mega Solar Park & Grid Substation (2000 MW)",
    sector: "Energy",
    ministry: "Ministry of Power",
    state: "Rajasthan",
    district: "Bhadla - Jodhpur",
    implementing_agency: "NTPC",
    contractor: "Tata Power Solar Systems",
    original_cost: 2100.0,
    revised_cost: 2350.0,
    expenditure: 1420.0,
    physical_progress: 68.0,
    financial_progress: 67.6,
    sanction_date: "2021-06-10",
    original_doc: "2025-06-30",
    snapshot_date: "2024-01-15",
    target_final_delay_months: 8.5,
    target_cost_overrun_pct: 11.9,
    target_is_high_risk: 0,
    composite_risk_score: 46,
    clearance_status: "CLEAR",
    primary_risk_driver: "High-Voltage Transmission Inverter Supply Bottleneck",
    secondary_risk_driver: "Import Tariff Fluctuation on Photovoltaic Modules",
    status: "STABLE_MONITORED",
    gcc_delay_clause: "Clause 38.2 - Extension of Time for Grid Handover",
    warning_notice_id: null,
    warning_issued: false
  },
  {
    project_code: "PAIM-5012",
    project_name: "Dedicated Freight Corridor East Phase III",
    sector: "Transport & Logistics",
    ministry: "Ministry of Railways",
    state: "Uttar Pradesh",
    district: "Prayagraj - Pt. Deen Dayal Upadhyaya Section",
    implementing_agency: "DFCCIL",
    contractor: "GMR Infrastructure Consortium",
    original_cost: 4800.0,
    revised_cost: 5950.0,
    expenditure: 3100.0,
    physical_progress: 54.0,
    financial_progress: 64.6,
    sanction_date: "2019-11-20",
    original_doc: "2024-12-31",
    snapshot_date: "2023-10-01",
    target_final_delay_months: 24.0,
    target_cost_overrun_pct: 23.9,
    target_is_high_risk: 1,
    composite_risk_score: 91,
    clearance_status: "PENDING",
    primary_risk_driver: "Electrification Signaling & Interlocking Re-tendering",
    secondary_risk_driver: "Overbridge Construction Clearances by State PWD",
    status: "CRITICAL_ATTENTION",
    gcc_delay_clause: "Clause 62 - Default and Milestone Termination Notice",
    warning_notice_id: "ACT-WARN-5012",
    warning_issued: false
  },
  {
    project_code: "PAIM-2099",
    project_name: "National Water Grid Pipeline & Bulk Treatment",
    sector: "Water & Sanitation",
    ministry: "Ministry of Jal Shakti",
    state: "Madhya Pradesh",
    district: "Chhindwara - Betul",
    implementing_agency: "NJSM",
    contractor: "NCC Limited",
    original_cost: 950.0,
    revised_cost: 980.0,
    expenditure: 610.0,
    physical_progress: 72.0,
    financial_progress: 64.2,
    sanction_date: "2022-02-14",
    original_doc: "2025-12-31",
    snapshot_date: "2024-05-20",
    target_final_delay_months: 3.0,
    target_cost_overrun_pct: 3.1,
    target_is_high_risk: 0,
    composite_risk_score: 22,
    clearance_status: "CLEAR",
    primary_risk_driver: "Pipeline Trenching Rocky Strata Variations",
    secondary_risk_driver: "Minor Village Piped Distribution Valve Calibration",
    status: "ON_TRACK",
    gcc_delay_clause: "Clause 14 - Inspection and Milestone Compliance",
    warning_notice_id: null,
    warning_issued: false
  }
];

/**
 * Robust string / field extractor
 */
export const getValue = (field, fallback = '') => {
  if (field === null || field === undefined) return fallback;
  if (typeof field === 'object') {
    if ('value' in field) return field.value;
    if ('code' in field) return field.code;
    if ('name' in field) return field.name;
    return JSON.stringify(field);
  }
  return field;
};

/**
 * Generates an accurate, mathematically realistic S-Curve dataset
 * Planned Progress vs. Actual Progress vs. Financial Expenditure
 */
export const generateSCurveData = (project) => {
  const origCost = parseFloat(getValue(project.original_cost, 1000));
  const revCost = parseFloat(getValue(project.revised_cost, origCost));
  const phys = parseFloat(getValue(project.physical_progress, 50));
  const exp = parseFloat(getValue(project.expenditure, origCost * 0.5));
  const finPct = Math.min(100, (exp / Math.max(1, revCost)) * 100);

  const points = [];
  const totalMonths = 36;
  const currentMonth = Math.max(6, Math.min(30, Math.round((phys / 100) * totalMonths * 1.2)));

  for (let m = 0; m <= totalMonths; m += 3) {
    // Sigmoidal Planned trajectory: S-Curve
    const t = (m / totalMonths) * 10 - 5;
    const sigmoid = 1 / (1 + Math.exp(-t));
    const plannedPct = Math.min(100, Math.round(sigmoid * 100));

    let actualPhys = null;
    let actualFin = null;

    if (m <= currentMonth) {
      // Actual trajectory lags or matches
      const ratio = m / currentMonth;
      actualPhys = Math.min(100, Math.round(phys * Math.pow(ratio, 1.1)));
      actualFin = Math.min(100, Math.round(finPct * Math.pow(ratio, 0.95)));
    } else if (m <= currentMonth + 6) {
      // Forecast projection line
      const forecastRatio = (m - currentMonth) / 6;
      actualPhys = Math.min(100, Math.round(phys + (100 - phys) * forecastRatio * 0.4));
    }

    points.push({
      month: `M${m}`,
      plannedProgress: plannedPct,
      actualProgress: actualPhys,
      financialExp: actualFin,
      isCurrent: m === currentMonth
    });
  }

  return {
    timeline: points,
    currentMonth: `M${currentMonth}`,
    progressGap: (phys - (points.find(p => p.month === `M${currentMonth}`)?.plannedProgress || phys)).toFixed(1),
    financialGap: (finPct - phys).toFixed(1)
  };
};
