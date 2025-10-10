/**
 * Utility functions for the rules engine
 */

export function generateViolationId(): string {
  return `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRuleId(): string {
  return `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

