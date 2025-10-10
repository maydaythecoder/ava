import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';
import { generateViolationId } from '../utils';

/**
 * Validates file paths against pattern requirements
 */
export class PathChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    const { pathPattern, allowedPaths, forbiddenPaths } = rule.config;
    
    // Check forbidden paths
    if (forbiddenPaths && forbiddenPaths.length > 0) {
      const isForbidden = forbiddenPaths.some(pattern =>
        file.path.includes(pattern)
      );
      
      if (isForbidden) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: `File is in a forbidden location. ${rule.description}`,
          context: {
            filePath: file.path,
            suggestedFix: allowedPaths && allowedPaths.length > 0
              ? `Move to one of: ${allowedPaths.join(', ')}`
              : 'Move file to a different location.',
          },
          detectedAt: new Date(),
        };
      }
    }
    
    // Check allowed paths
    if (allowedPaths && allowedPaths.length > 0) {
      const isAllowed = allowedPaths.some(pattern =>
        file.path.startsWith(pattern) || file.path.includes(pattern)
      );
      
      if (!isAllowed) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: `File must be in one of the allowed paths. ${rule.description}`,
          context: {
            filePath: file.path,
            suggestedFix: `Move to one of: ${allowedPaths.join(', ')}`,
          },
          detectedAt: new Date(),
        };
      }
    }
    
    // Check path pattern
    if (pathPattern) {
      try {
        const regex = new RegExp(pathPattern);
        if (!regex.test(file.path)) {
          return {
            id: generateViolationId(),
            ruleId: rule.id,
            fileNodeId: file.id,
            severity: rule.severity,
            message: `File path doesn't match required pattern. ${rule.description}`,
            context: {
              filePath: file.path,
              suggestedFix: `Ensure path matches pattern: ${pathPattern}`,
            },
            detectedAt: new Date(),
          };
        }
      } catch (error) {
        console.error(`Invalid path pattern in rule ${rule.id}:`, error);
      }
    }
    
    return null;
  }
}

