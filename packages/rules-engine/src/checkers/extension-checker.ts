import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';
import { generateViolationId } from '../utils';

/**
 * Validates file extensions against allowed/forbidden lists
 */
export class ExtensionChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    const { allowedExtensions, forbiddenExtensions } = rule.config;
    const fileExtension = file.metadata.extension?.toLowerCase();
    
    if (!fileExtension) {
      return null;
    }
    
    // Check forbidden extensions first
    if (forbiddenExtensions && forbiddenExtensions.length > 0) {
      const isForbidden = forbiddenExtensions.some(
        ext => ext.toLowerCase() === fileExtension
      );
      
      if (isForbidden) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: `File extension ".${fileExtension}" is not allowed. ${rule.description}`,
          context: {
            filePath: file.path,
            suggestedFix: allowedExtensions && allowedExtensions.length > 0
              ? `Use one of the allowed extensions: ${allowedExtensions.join(', ')}`
              : 'Remove or convert this file.',
          },
          detectedAt: new Date(),
        };
      }
    }
    
    // Check allowed extensions
    if (allowedExtensions && allowedExtensions.length > 0) {
      const isAllowed = allowedExtensions.some(
        ext => ext.toLowerCase() === fileExtension
      );
      
      if (!isAllowed) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: `File extension ".${fileExtension}" is not in allowed list. ${rule.description}`,
          context: {
            filePath: file.path,
            suggestedFix: `Use one of the allowed extensions: ${allowedExtensions.join(', ')}`,
          },
          detectedAt: new Date(),
        };
      }
    }
    
    return null;
  }
}

