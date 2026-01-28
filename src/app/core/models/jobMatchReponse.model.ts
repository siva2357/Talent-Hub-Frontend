export interface JobMatchResponse {
  jobMatchScore: number;
  matchLevel: 'great_match' | 'partial_match' | 'low_match';
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercent: number;
  experienceMatch: 'full' | 'partial' | 'none';
  educationMatch: boolean;
  summary: string;
}
