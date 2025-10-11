import { create } from 'zustand';

export interface Agent {
  id: string;
  workspaceId: string;
  folderPath: string;
  name: string;
  fileName: string;
  prompt: string;
  context: string;
  contextLinks: string[];
  contextMcpServers: string[];
  triggerType: 'on_commit' | 'hourly' | 'daily' | 'on_change' | 'manual';
  triggerConfig: Record<string, any>;
  scope: {
    applyToAll?: boolean;
    includePaths?: string[];
    excludePaths?: string[];
    fileTypes?: string[];
  };
  type?: 'watcher' | 'notifier' | 'runner' | 'pipeline';
  enabled: boolean;
  ownerId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
}

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  agents?: Agent[];
}

interface AgentState {
  currentWorkspaceId: string | null;
  folderTree: FolderNode | null;
  agents: Agent[];
  selectedFolder: FolderNode | null;
  selectedAgent: Agent | null;
  isCreatingAgent: boolean;
  
  // Actions
  setCurrentWorkspace: (workspaceId: string) => void;
  setFolderTree: (tree: FolderNode | null) => void;
  setAgents: (agents: Agent[]) => void;
  setSelectedFolder: (folder: FolderNode | null) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setIsCreatingAgent: (isCreating: boolean) => void;
  
  // Agent operations
  addAgent: (agent: Agent) => void;
  updateAgent: (agentId: string, updates: Partial<Agent>) => void;
  deleteAgent: (agentId: string) => void;
  
  // Folder operations
  addFolder: (parentPath: string, folderName: string) => void;
}

export const useAgentStore = create<AgentState>((set) => ({
  currentWorkspaceId: null,
  folderTree: null,
  agents: [],
  selectedFolder: null,
  selectedAgent: null,
  isCreatingAgent: false,
  
  setCurrentWorkspace: (workspaceId) => set({ currentWorkspaceId: workspaceId }),
  setFolderTree: (tree) => set({ folderTree: tree }),
  setAgents: (agents) => set({ agents }),
  setSelectedFolder: (folder) => set({ selectedFolder: folder, selectedAgent: null }),
  setSelectedAgent: (agent) => set({ selectedAgent: agent }),
  setIsCreatingAgent: (isCreating) => set({ isCreatingAgent: isCreating }),
  
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent],
    selectedAgent: agent,
    isCreatingAgent: false
  })),
  
  updateAgent: (agentId, updates) => set((state) => ({
    agents: state.agents.map(agent =>
      agent.id === agentId ? { ...agent, ...updates, updatedAt: new Date() } : agent
    ),
    selectedAgent: state.selectedAgent?.id === agentId
      ? { ...state.selectedAgent, ...updates, updatedAt: new Date() }
      : state.selectedAgent
  })),
  
  deleteAgent: (agentId) => set((state) => ({
    agents: state.agents.filter(agent => agent.id !== agentId),
    selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent
  })),
  
  addFolder: (parentPath, folderName) => set((state) => {
    if (!state.folderTree) return state;
    
    const addToTree = (node: FolderNode): FolderNode => {
      if (node.path === parentPath) {
        const newFolder: FolderNode = {
          id: `folder-${Date.now()}`,
          name: folderName,
          path: `${parentPath}/${folderName}`.replace('//', '/'),
          type: 'folder',
          children: [],
          agents: []
        };
        return {
          ...node,
          children: [...(node.children || []), newFolder]
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addToTree)
        };
      }
      return node;
    };
    
    return { folderTree: addToTree(state.folderTree) };
  })
}));


