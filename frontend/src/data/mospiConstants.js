/**
 * MoSPI Portfolio Constants & Benchmark Datasets
 * Source: MoSPI OCMS National Infrastructure Project Database (2001-2026)
 */

export const MOSPI_STATS = {
  totalProjects: 1981,
  totalMinistries: 17,
  totalSectors: 22,
  originalCostLakhCr: 37.13,
  revisedCostLakhCr: 42.78,
  cumulativeExpLakhCr: 20.36,
  costEscalationLakhCr: 5.65,
  overallCostEscalationPct: 15.2,
  highRiskCount: 342,
  delayedProjectsCount: 814,
  avgDelayMonths: 16.8
};

export const SECTOR_METRICS_DATA = [
  { sector: 'Transport', projects: 540, origCost: 12.4, revCost: 14.8, avgDelayMonths: 18.2, escalationPct: 19.3 },
  { sector: 'Energy', projects: 420, origCost: 9.8, revCost: 11.2, avgDelayMonths: 12.5, escalationPct: 14.3 },
  { sector: 'Water', projects: 310, origCost: 4.5, revCost: 5.1, avgDelayMonths: 9.4, escalationPct: 13.3 },
  { sector: 'Railways', projects: 280, origCost: 6.2, revCost: 7.5, avgDelayMonths: 21.0, escalationPct: 20.9 },
  { sector: 'Coal', projects: 190, origCost: 2.8, revCost: 3.0, avgDelayMonths: 7.1, escalationPct: 7.1 },
  { sector: 'Telecom', projects: 120, origCost: 1.4, revCost: 1.5, avgDelayMonths: 4.8, escalationPct: 7.1 },
  { sector: 'Urban / Social', projects: 121, origCost: 0.93, revCost: 0.98, avgDelayMonths: 6.2, escalationPct: 5.4 }
];

export const ESCALATION_DRIVERS_DATA = [
  { driver: 'Land Acquisition Delays', impactPct: 34, croresEscalated: 192000, color: '#F59E0B' },
  { driver: 'Right-of-Way (RoW) Clearances', impactPct: 22, croresEscalated: 124000, color: '#EF4444' },
  { driver: 'Environmental & Forest Approvals', impactPct: 18, croresEscalated: 101000, color: '#06B6D4' },
  { driver: 'Contractor Financial Liquidity', impactPct: 14, croresEscalated: 79000, color: '#10B981' },
  { driver: 'Engineering Scope & Design Revision', impactPct: 12, croresEscalated: 69000, color: '#8B5CF6' }
];

export const RISK_RADAR_DATA = [
  { factor: 'Financial Risk', score: 82, fullMark: 100 },
  { factor: 'Schedule Risk', score: 94, fullMark: 100 },
  { factor: 'Land & RoW', score: 88, fullMark: 100 },
  { factor: 'Regulatory', score: 65, fullMark: 100 },
  { factor: 'Contractor', score: 76, fullMark: 100 }
];

export const AGENCY_BENCHMARK_DATA = [
  { agency: 'NHAI', avgOverrunPct: 19.8, avgDelayMonths: 17.5, count: 410, sector: 'Roads & Highways' },
  { agency: 'RVNL', avgOverrunPct: 21.2, avgDelayMonths: 22.1, count: 185, sector: 'Railways' },
  { agency: 'NTPC', avgOverrunPct: 11.4, avgDelayMonths: 11.2, count: 140, sector: 'Thermal & Renewable Power' },
  { agency: 'DFCCIL', avgOverrunPct: 24.1, avgDelayMonths: 24.5, count: 45, sector: 'Dedicated Freight Corridors' },
  { agency: 'POWERGRID', avgOverrunPct: 6.2, avgDelayMonths: 5.8, count: 120, sector: 'Power Transmission' }
];

export const SCATTER_OVERRUN_DATA = [
  { x: 12, y: 14.2, z: 120, name: 'PAIM-619054 (NHAI)', agency: 'NHAI', sector: 'Transport' },
  { x: 18, y: 22.4, z: 180, name: 'PAIM-1042 (NHAI)', agency: 'NHAI', sector: 'Transport' },
  { x: 8,  y: 9.5,  z: 90,  name: 'PAIM-3088 (NTPC)', agency: 'NTPC', sector: 'Energy' },
  { x: 24, y: 28.9, z: 240, name: 'PAIM-5012 (DFCCIL)', agency: 'DFCCIL', sector: 'Railways' },
  { x: 4,  y: 3.1,  z: 50,  name: 'PAIM-2099 (NJSM)', agency: 'NJSM', sector: 'Water' },
  { x: 30, y: 34.5, z: 310, name: 'PAIM-8891 (Railways)', agency: 'Railways', sector: 'Railways' }
];
