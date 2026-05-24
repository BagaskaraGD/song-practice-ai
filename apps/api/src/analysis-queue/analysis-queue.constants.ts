export const ANALYSIS_QUEUE = 'analysis';

export interface AnalysisJobPayload {
  jobId: string;
  songId: string;
  userId: string;
}
