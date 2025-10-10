/**
 * Compliance and Reporting Types
 * Types for compliance checking, reporting, and analytics
 */

export type ComplianceReportId = string;

export interface ComplianceReport {
  id: ComplianceReportId;
  workspaceId: string;
  generatedAt: Date;
  generatedBy: string;
  period: ReportPeriod;
  summary: ComplianceSummary;
  violations: ViolationsByRule[];
  trends: ComplianceTrend[];
  recommendations?: string[];
}

export interface ReportPeriod {
  startDate: Date;
  endDate: Date;
  label: string; // e.g., "Q1 2024", "January 2024"
}

export interface ComplianceSummary {
  totalChecks: number;
  totalViolations: number;
  violationsByType: Record<string, number>;
  violationsBySeverity: Record<string, number>;
  complianceScore: number; // 0-100
  topViolatingRules: RuleViolationCount[];
  mostAffectedFiles: FileViolationCount[];
}

export interface RuleViolationCount {
  ruleId: string;
  ruleName: string;
  count: number;
  severity: string;
}

export interface FileViolationCount {
  fileId: string;
  filePath: string;
  count: number;
}

export interface ViolationsByRule {
  ruleId: string;
  ruleName: string;
  ruleType: string;
  severity: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  examples: ViolationExample[];
}

export interface ViolationExample {
  fileId: string;
  filePath: string;
  message: string;
  detectedAt: Date;
}

export interface ComplianceTrend {
  date: Date;
  totalViolations: number;
  newViolations: number;
  resolvedViolations: number;
  complianceScore: number;
}

export interface ComplianceMetrics {
  workspaceId: string;
  currentScore: number;
  previousScore: number;
  scoreChange: number;
  activeViolations: number;
  resolvedThisWeek: number;
  averageResolutionTime: number; // hours
  mostActiveRule: string;
  calculatedAt: Date;
}

export interface ComplianceGoal {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  targetScore: number;
  targetDate: Date;
  currentProgress: number;
  milestones: GoalMilestone[];
  createdAt: Date;
  createdBy: string;
}

export interface GoalMilestone {
  id: string;
  name: string;
  targetDate: Date;
  targetValue: number;
  achieved: boolean;
  achievedAt?: Date;
}

