export interface ExerciseFeedback {
  isFormCorrect: boolean;
  score: number; // 0–100
  exerciseDetected: string;
  repCount: number | null;
  goodPoints: string[];
  issues: FormIssue[];
  corrections: string[];
  safetyWarnings: string[];
  summary: string;
  recommendedDrills: string[];
}

export interface FormIssue {
  severity: "critical" | "moderate" | "minor";
  body_part: string;
  description: string;
}

export interface AnalysisOptions {
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  focusAreas?: string[];
}

export interface AnalyzeRequest {
  exerciseType: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  focusAreas?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, unknown>;
}
