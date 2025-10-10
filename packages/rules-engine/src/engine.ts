import {
  Rule,
  RuleCheckResult,
  RuleViolation,
  FileNode,
} from '@ava/common-types';
import { FilenameChecker } from './checkers/filename-checker';
import { FilesizeChecker } from './checkers/filesize-checker';
import { ExtensionChecker } from './checkers/extension-checker';
import { MetadataChecker } from './checkers/metadata-checker';
import { PathChecker } from './checkers/path-checker';

export interface RuleChecker {
  check(file: FileNode, rule: Rule): RuleViolation | null;
}

/**
 * Core Rules Engine
 * Orchestrates rule checking across all file nodes
 */
export class RulesEngine {
  private checkers: Map<string, RuleChecker>;

  constructor() {
    this.checkers = new Map([
      ['filename', new FilenameChecker()],
      ['filesize', new FilesizeChecker()],
      ['extension', new ExtensionChecker()],
      ['metadata', new MetadataChecker()],
      ['path', new PathChecker()],
    ]);
  }

  /**
   * Check a single file against all enabled rules
   */
  async checkFile(file: FileNode, rules: Rule[]): Promise<RuleViolation[]> {
    const violations: RuleViolation[] = [];
    
    const enabledRules = rules.filter(rule => rule.enabled);
    
    for (const rule of enabledRules) {
      // Check if rule scope applies to this file
      if (!this.isInScope(file, rule)) {
        continue;
      }
      
      const checker = this.checkers.get(rule.type);
      if (!checker) {
        console.warn(`No checker found for rule type: ${rule.type}`);
        continue;
      }
      
      const violation = checker.check(file, rule);
      if (violation) {
        violations.push(violation);
      }
    }
    
    return violations;
  }

  /**
   * Check multiple files against all enabled rules
   */
  async checkFiles(files: FileNode[], rules: Rule[]): Promise<RuleCheckResult> {
    const startTime = Date.now();
    const allViolations: RuleViolation[] = [];
    
    for (const file of files) {
      // Only check files, not folders
      if (file.type === 'file') {
        const violations = await this.checkFile(file, rules);
        allViolations.push(...violations);
      }
    }
    
    return {
      passed: allViolations.length === 0,
      violations: allViolations,
      checkedAt: new Date(),
      totalChecked: files.filter(f => f.type === 'file').length,
      totalViolations: allViolations.length,
    };
  }

  /**
   * Check if a file is within the scope of a rule
   */
  private isInScope(file: FileNode, rule: Rule): boolean {
    const scope = rule.scope;
    
    // If applyToAll is true, always include
    if (scope.applyToAll) {
      return true;
    }
    
    // Check if file type matches
    if (scope.fileTypes && scope.fileTypes.length > 0) {
      const ext = file.metadata.extension?.toLowerCase();
      if (!ext || !scope.fileTypes.includes(ext)) {
        return false;
      }
    }
    
    // Check if tags match
    if (scope.tags && scope.tags.length > 0) {
      const fileTags = file.metadata.tags || [];
      const hasMatchingTag = scope.tags.some(tag => fileTags.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    // TODO: Implement path pattern matching with micromatch
    // For now, simple check
    if (scope.excludePaths && scope.excludePaths.length > 0) {
      // Check if file path matches any exclude pattern
      const isExcluded = scope.excludePaths.some(pattern => 
        file.path.includes(pattern)
      );
      if (isExcluded) {
        return false;
      }
    }
    
    if (scope.includePaths && scope.includePaths.length > 0) {
      // Check if file path matches any include pattern
      const isIncluded = scope.includePaths.some(pattern =>
        file.path.includes(pattern)
      );
      if (!isIncluded) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Register a custom rule checker
   */
  registerChecker(ruleType: string, checker: RuleChecker): void {
    this.checkers.set(ruleType, checker);
  }
}

