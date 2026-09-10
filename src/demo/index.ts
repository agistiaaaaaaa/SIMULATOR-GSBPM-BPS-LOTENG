export {
  createDemoDatabase,
  getDemoProjects,
  isDemoProject,
  mergeDemoProjects,
  mergeImportedProjects,
  removeDemoProjects,
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
export {
  computeDashboardStatistics,
  isProjectReadyForReview,
  isRecommendationPreparationPending,
  isReviewStatusStale,
} from './statistics'
export { buildDemoActivityLog } from './activity'
export { getProjectActivity } from './projectActivity'
export { HELP_TOPICS } from './help'
export type { DashboardStatistics } from './statistics'
export type { DemoDatabase } from './seed'
