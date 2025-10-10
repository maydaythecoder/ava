import { Rule, RuleConfig, RuleType } from '@ava/common-types';

/**
 * Validates rule configurations before saving
 */
export class RuleValidator {
  static validateRule(rule: Partial<Rule>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!rule.name || rule.name.trim() === '') {
      errors.push('Rule name is required');
    }
    
    if (!rule.type) {
      errors.push('Rule type is required');
    }
    
    if (!rule.severity) {
      errors.push('Rule severity is required');
    }
    
    if (rule.config) {
      const configErrors = this.validateConfig(rule.type!, rule.config);
      errors.push(...configErrors);
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  static validateConfig(ruleType: RuleType, config: RuleConfig): string[] {
    const errors: string[] = [];
    
    switch (ruleType) {
      case 'filename':
        if (!config.pattern) {
          errors.push('Filename rule requires a pattern');
        } else {
          try {
            new RegExp(config.pattern);
          } catch (e) {
            errors.push('Invalid regex pattern');
          }
        }
        break;
        
      case 'filesize':
        if (!config.maxSizeMB || config.maxSizeMB <= 0) {
          errors.push('Filesize rule requires a positive maxSizeMB value');
        }
        break;
        
      case 'extension':
        if (
          (!config.allowedExtensions || config.allowedExtensions.length === 0) &&
          (!config.forbiddenExtensions || config.forbiddenExtensions.length === 0)
        ) {
          errors.push('Extension rule requires either allowedExtensions or forbiddenExtensions');
        }
        break;
        
      case 'metadata':
        if (
          (!config.requiredFields || config.requiredFields.length === 0) &&
          !config.fieldValidation
        ) {
          errors.push('Metadata rule requires either requiredFields or fieldValidation');
        }
        break;
        
      case 'path':
        if (
          !config.pathPattern &&
          (!config.allowedPaths || config.allowedPaths.length === 0) &&
          (!config.forbiddenPaths || config.forbiddenPaths.length === 0)
        ) {
          errors.push('Path rule requires pathPattern, allowedPaths, or forbiddenPaths');
        }
        break;
        
      case 'content':
        if (!config.contentPattern) {
          errors.push('Content rule requires a contentPattern');
        }
        break;
    }
    
    return errors;
  }
}

