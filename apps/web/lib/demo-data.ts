import { FileTreeNode, Rule, Workspace } from '@ava/common-types';

/**
 * Demo workspace and data for sandbox experience
 */

export function createDemoWorkspace(): Workspace {
  return {
    id: 'demo-workspace',
    name: 'Demo Project',
    description: 'A sample project to explore Ava compliance features',
    ownerId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    settings: {
      defaultBranchProtection: false,
      autoTaskGeneration: true,
      complianceMode: 'sandbox',
      maxFileSizeMB: 10,
    },
    rootNode: 'root',
    isArchived: false,
  };
}

export function createDemoFileTree(): FileTreeNode {
  const now = new Date();
  
  return {
    id: 'root',
    workspaceId: 'demo-workspace',
    name: 'demo-project',
    type: 'folder',
    parentId: null,
    path: '/',
    metadata: {},
    createdAt: now,
    updatedAt: now,
    children: [
      {
        id: 'src',
        workspaceId: 'demo-workspace',
        name: 'src',
        type: 'folder',
        parentId: 'root',
        path: '/src',
        metadata: {},
        createdAt: now,
        updatedAt: now,
        children: [
          {
            id: 'components',
            workspaceId: 'demo-workspace',
            name: 'components',
            type: 'folder',
            parentId: 'src',
            path: '/src/components',
            metadata: {},
            createdAt: now,
            updatedAt: now,
            children: [
              {
                id: 'button',
                workspaceId: 'demo-workspace',
                name: 'button.tsx',
                type: 'file',
                parentId: 'components',
                path: '/src/components/button.tsx',
                content: '// Button component\nexport function Button() {\n  return <button>Click me</button>;\n}',
                metadata: {
                  size: 150,
                  extension: 'tsx',
                  mimeType: 'text/typescript',
                },
                createdAt: now,
                updatedAt: now,
              },
              {
                id: 'user_profile',
                workspaceId: 'demo-workspace',
                name: 'user_profile.tsx',
                type: 'file',
                parentId: 'components',
                path: '/src/components/user_profile.tsx',
                content: '// User Profile component\nexport function UserProfile() {\n  return <div>User Profile</div>;\n}',
                metadata: {
                  size: 180,
                  extension: 'tsx',
                  mimeType: 'text/typescript',
                },
                createdAt: now,
                updatedAt: now,
              },
              {
                id: 'MyComponent',
                workspaceId: 'demo-workspace',
                name: 'MyComponent.tsx',
                type: 'file',
                parentId: 'components',
                path: '/src/components/MyComponent.tsx',
                content: '// My Component\nexport function MyComponent() {\n  return <div>Hello World</div>;\n}',
                metadata: {
                  size: 160,
                  extension: 'tsx',
                  mimeType: 'text/typescript',
                },
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
          {
            id: 'utils',
            workspaceId: 'demo-workspace',
            name: 'utils',
            type: 'folder',
            parentId: 'src',
            path: '/src/utils',
            metadata: {},
            createdAt: now,
            updatedAt: now,
            children: [
              {
                id: 'formatDate',
                workspaceId: 'demo-workspace',
                name: 'formatDate.ts',
                type: 'file',
                parentId: 'utils',
                path: '/src/utils/formatDate.ts',
                content: 'export function formatDate(date: Date): string {\n  return date.toLocaleDateString();\n}',
                metadata: {
                  size: 120,
                  extension: 'ts',
                  mimeType: 'text/typescript',
                },
                createdAt: now,
                updatedAt: now,
              },
            ],
          },
        ],
      },
      {
        id: 'temp',
        workspaceId: 'demo-workspace',
        name: 'temp',
        type: 'folder',
        parentId: 'root',
        path: '/temp',
        metadata: {},
        createdAt: now,
        updatedAt: now,
        children: [
          {
            id: 'draft',
            workspaceId: 'demo-workspace',
            name: 'draft.txt',
            type: 'file',
            parentId: 'temp',
            path: '/temp/draft.txt',
            content: 'This is a draft file',
            metadata: {
              size: 50,
              extension: 'txt',
              mimeType: 'text/plain',
            },
            createdAt: now,
            updatedAt: now,
          },
        ],
      },
      {
        id: 'large-file',
        workspaceId: 'demo-workspace',
        name: 'large-video.mp4',
        type: 'file',
        parentId: 'root',
        path: '/large-video.mp4',
        content: '',
        metadata: {
          size: 15 * 1024 * 1024, // 15MB
          extension: 'mp4',
          mimeType: 'video/mp4',
        },
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

export function createDemoRules(): Rule[] {
  const now = new Date();
  
  return [
    {
      id: 'rule-1',
      workspaceId: 'demo-workspace',
      name: 'Kebab Case Filenames',
      description: 'All React component files should use kebab-case naming',
      type: 'filename',
      severity: 'warning',
      enabled: true,
      config: {
        pattern: '^[a-z0-9]+(-[a-z0-9]+)*\\.(tsx|ts)$',
      },
      scope: {
        includePaths: ['/src/components'],
        applyToAll: false,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'demo-user',
    },
    {
      id: 'rule-2',
      workspaceId: 'demo-workspace',
      name: 'Max File Size 10MB',
      description: 'Files should not exceed 10MB to maintain repository performance',
      type: 'filesize',
      severity: 'error',
      enabled: true,
      config: {
        maxSizeMB: 10,
      },
      scope: {
        applyToAll: true,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'demo-user',
    },
    {
      id: 'rule-3',
      workspaceId: 'demo-workspace',
      name: 'No Temp Folders',
      description: 'Temporary files should not be committed to the repository',
      type: 'path',
      severity: 'warning',
      enabled: true,
      config: {
        forbiddenPaths: ['/temp', '/tmp'],
      },
      scope: {
        applyToAll: true,
      },
      createdAt: now,
      updatedAt: now,
      createdBy: 'demo-user',
    },
  ];
}

