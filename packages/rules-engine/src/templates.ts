import { RuleTemplate } from '@ava/common-types';

/**
 * Built-in rule templates for common use cases
 */
export const RuleTemplates: RuleTemplate[] = [
  {
    id: 'kebab-case-filenames',
    name: 'Kebab Case Filenames',
    description: 'Enforce kebab-case naming for all files',
    category: 'Naming Conventions',
    type: 'filename',
    icon: '📝',
    config: {
      pattern: '^[a-z0-9]+(-[a-z0-9]+)*\\.[a-z]+$',
    },
    exampleUsage: 'my-component.tsx, user-profile.ts',
    isBuiltIn: true,
  },
  {
    id: 'snake-case-filenames',
    name: 'Snake Case Filenames',
    description: 'Enforce snake_case naming for all files',
    category: 'Naming Conventions',
    type: 'filename',
    icon: '🐍',
    config: {
      pattern: '^[a-z0-9]+(_[a-z0-9]+)*\\.[a-z]+$',
    },
    exampleUsage: 'my_component.tsx, user_profile.ts',
    isBuiltIn: true,
  },
  {
    id: 'pascal-case-components',
    name: 'PascalCase Components',
    description: 'Enforce PascalCase naming for React components',
    category: 'Naming Conventions',
    type: 'filename',
    icon: '⚛️',
    config: {
      pattern: '^[A-Z][a-zA-Z0-9]+\\.(tsx|jsx)$',
    },
    exampleUsage: 'MyComponent.tsx, UserProfile.tsx',
    isBuiltIn: true,
  },
  {
    id: 'max-file-size-10mb',
    name: 'Max File Size 10MB',
    description: 'Limit file size to 10MB',
    category: 'File Constraints',
    type: 'filesize',
    icon: '📦',
    config: {
      maxSizeMB: 10,
    },
    exampleUsage: 'Prevent large files from being added',
    isBuiltIn: true,
  },
  {
    id: 'no-executable-files',
    name: 'No Executable Files',
    description: 'Prevent executable files from being added',
    category: 'Security',
    type: 'extension',
    icon: '🔒',
    config: {
      forbiddenExtensions: ['exe', 'bat', 'sh', 'cmd', 'bin'],
    },
    exampleUsage: 'Block potentially dangerous file types',
    isBuiltIn: true,
  },
  {
    id: 'typescript-only',
    name: 'TypeScript Only',
    description: 'Only allow TypeScript files',
    category: 'Language Standards',
    type: 'extension',
    icon: '📘',
    config: {
      allowedExtensions: ['ts', 'tsx', 'json', 'md'],
    },
    exampleUsage: 'Enforce TypeScript usage in the project',
    isBuiltIn: true,
  },
  {
    id: 'require-author-metadata',
    name: 'Require Author Metadata',
    description: 'All files must have an author field',
    category: 'Documentation',
    type: 'metadata',
    icon: '👤',
    config: {
      requiredFields: ['author'],
    },
    exampleUsage: 'Track file ownership',
    isBuiltIn: true,
  },
  {
    id: 'no-temp-folders',
    name: 'No Temp Folders',
    description: 'Prevent files in temporary directories',
    category: 'Organization',
    type: 'path',
    icon: '📁',
    config: {
      forbiddenPaths: ['/temp', '/tmp', '/.cache'],
    },
    exampleUsage: 'Keep repository clean',
    isBuiltIn: true,
  },
  {
    id: 'components-in-components-folder',
    name: 'Components in /components',
    description: 'React components must be in components folder',
    category: 'Organization',
    type: 'path',
    icon: '📂',
    config: {
      allowedPaths: ['/components', '/src/components'],
    },
    exampleUsage: 'Enforce project structure',
    isBuiltIn: true,
  },
];

export default RuleTemplates;

