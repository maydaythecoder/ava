import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';
import { generateViolationId } from '../utils';

/**
 * Validates file sizes against maximum limits
 */
export class FilesizeChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    const maxSizeMB = rule.config.maxSizeMB;
    
    if (!maxSizeMB || !file.metadata.size) {
      return null;
    }
    
    const fileSizeMB = file.metadata.size / (1024 * 1024);
    
    if (fileSizeMB > maxSizeMB) {
      return {
        id: generateViolationId(),
        ruleId: rule.id,
        fileNodeId: file.id,
        severity: rule.severity,
        message: `File size ${fileSizeMB.toFixed(2)}MB exceeds limit of ${maxSizeMB}MB. ${rule.description}`,
        context: {
          filePath: file.path,
          suggestedFix: 'Consider compressing the file or splitting it into smaller parts.',
        },
        detectedAt: new Date(),
      };
    }
    
    return null;
  }
}

