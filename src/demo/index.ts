export {
  createDemoDatabase,
  getDemoProjects,
  getDemoRecordCounts,
  exportDemoJson,
  importDemoJson,
  isDemoSeeded,
  markDemoSeeded,
  markDemoCleared,
  clearDemoFlag,
  shouldAutoSeed,
  isOnboardingDone,
  markOnboardingDone,
  resetOnboarding,
  summarizeProgress,
  buildDashboardBundle,
  DEMO_SEED_VERSION,
  DEMO_FLAG_KEY,
  ONBOARDING_KEY,
} from './seed'
export { buildDemoProjects } from './projects'
export { computeDashboardStatistics } from './statistics'
export { buildDemoActivityLog } from './activity'
export { getProjectActivity } from './projectActivity'
export { HELP_TOPICS } from './help'
export type { DashboardStatistics } from './statistics'
export type { DemoDatabase } from './seed'
