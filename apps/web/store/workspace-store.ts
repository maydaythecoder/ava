import { create } from 'zustand';
import { Workspace, FileTreeNode, Rule, Task } from '@ava/common-types';

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  fileTree: FileTreeNode | null;
  selectedFile: FileTreeNode | null;
  rules: Rule[];
  tasks: Task[];
  isLoading: boolean;
  
  // Actions
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setFileTree: (tree: FileTreeNode | null) => void;
  setSelectedFile: (file: FileTreeNode | null) => void;
  setRules: (rules: Rule[]) => void;
  setTasks: (tasks: Task[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // File operations
  addFile: (parentId: string, file: FileTreeNode) => void;
  updateFile: (fileId: string, updates: Partial<FileTreeNode>) => void;
  deleteFile: (fileId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: null,
  fileTree: null,
  selectedFile: null,
  rules: [],
  tasks: [],
  isLoading: false,
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setRules: (rules) => set({ rules }),
  setTasks: (tasks) => set({ tasks }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  addFile: (parentId, file) => set((state) => {
    if (!state.fileTree) return state;
    
    const addToTree = (node: FileTreeNode): FileTreeNode => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), file],
        };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(addToTree),
        };
      }
      return node;
    };
    
    return { fileTree: addToTree(state.fileTree) };
  }),
  
  updateFile: (fileId, updates) => set((state) => {
    if (!state.fileTree) return state;
    
    const updateInTree = (node: FileTreeNode): FileTreeNode => {
      if (node.id === fileId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateInTree),
        };
      }
      return node;
    };
    
    return { fileTree: updateInTree(state.fileTree) };
  }),
  
  deleteFile: (fileId) => set((state) => {
    if (!state.fileTree) return state;
    
    const deleteFromTree = (node: FileTreeNode): FileTreeNode | null => {
      if (node.id === fileId) {
        return null;
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(deleteFromTree).filter(Boolean) as FileTreeNode[],
        };
      }
      return node;
    };
    
    const newTree = deleteFromTree(state.fileTree);
    return { fileTree: newTree };
  }),
}));

