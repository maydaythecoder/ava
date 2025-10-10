import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';
import { generateViolationId } from '../utils';

/**
 * Validates filenames against regex patterns
 */
export class FilenameChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    const pattern = rule.config.pattern;
    
    if (!pattern) {
      return null;
    }
    
    try {
      const regex = new RegExp(pattern);
      const matches = regex.test(file.name);
      
      if (!matches) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: this.generateMessage(file.name, rule),
          context: {
            filePath: file.path,
            suggestedFix: this.generateSuggestedFix(file.name, pattern),
          },
          detectedAt: new Date(),
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Invalid regex pattern in rule ${rule.id}:`, error);
      return null;
    }
  }
  
  private generateMessage(filename: string, rule: Rule): string {
    return `Filename "${filename}" doesn't match required pattern. ${rule.description}`;
  }
  
  private generateSuggestedFix(filename: string, pattern: string): string {
    // Basic suggestions based on common patterns
    if (pattern.includes('kebab-case')) {
      return filename.toLowerCase().replace(/[_\s]+/g, '-');
    }
    if (pattern.includes('snake_case')) {
      return filename.toLowerCase().replace(/[-\s]+/g, '_');
    }
    if (pattern.includes('camelCase')) {
      return filename.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
    }
    
    return `Ensure filename matches pattern: ${pattern}`;
  }
}

