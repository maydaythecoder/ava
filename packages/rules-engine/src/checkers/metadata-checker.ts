import { Rule, RuleViolation, FileNode } from '@ava/common-types';
import { RuleChecker } from '../engine';
import { generateViolationId } from '../utils';

/**
 * Validates file metadata fields
 */
export class MetadataChecker implements RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null {
    const { requiredFields, fieldValidation } = rule.config;
    
    // Check required fields
    if (requiredFields && requiredFields.length > 0) {
      const missingFields = requiredFields.filter(
        field => !file.metadata.customFields?.[field]
      );
      
      if (missingFields.length > 0) {
        return {
          id: generateViolationId(),
          ruleId: rule.id,
          fileNodeId: file.id,
          severity: rule.severity,
          message: `Missing required metadata fields: ${missingFields.join(', ')}. ${rule.description}`,
          context: {
            filePath: file.path,
            suggestedFix: `Add the following metadata fields: ${missingFields.join(', ')}`,
          },
          detectedAt: new Date(),
        };
      }
    }
    
    // Check field validation rules
    if (fieldValidation) {
      for (const [fieldName, validator] of Object.entries(fieldValidation)) {
        const fieldValue = file.metadata.customFields?.[fieldName];
        
        if (validator.required && !fieldValue) {
          return {
            id: generateViolationId(),
            ruleId: rule.id,
            fileNodeId: file.id,
            severity: rule.severity,
            message: `Required metadata field "${fieldName}" is missing. ${rule.description}`,
            context: {
              filePath: file.path,
              suggestedFix: `Add metadata field: ${fieldName}`,
            },
            detectedAt: new Date(),
          };
        }
        
        if (fieldValue && validator.pattern) {
          try {
            const regex = new RegExp(validator.pattern);
            if (!regex.test(String(fieldValue))) {
              return {
                id: generateViolationId(),
                ruleId: rule.id,
                fileNodeId: file.id,
                severity: rule.severity,
                message: `Metadata field "${fieldName}" doesn't match pattern. ${rule.description}`,
                context: {
                  filePath: file.path,
                  suggestedFix: `Ensure ${fieldName} matches pattern: ${validator.pattern}`,
                },
                detectedAt: new Date(),
              };
            }
          } catch (error) {
            console.error(`Invalid regex in field validation for ${fieldName}:`, error);
          }
        }
        
        // Check enum values
        if (fieldValue && validator.enumValues) {
          if (!validator.enumValues.includes(String(fieldValue))) {
            return {
              id: generateViolationId(),
              ruleId: rule.id,
              fileNodeId: file.id,
              severity: rule.severity,
              message: `Metadata field "${fieldName}" must be one of: ${validator.enumValues.join(', ')}. ${rule.description}`,
              context: {
                filePath: file.path,
                suggestedFix: `Use one of: ${validator.enumValues.join(', ')}`,
              },
              detectedAt: new Date(),
            };
          }
        }
      }
    }
    
    return null;
  }
}

