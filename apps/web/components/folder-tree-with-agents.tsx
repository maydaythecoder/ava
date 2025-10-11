'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus } from 'lucide-react';
import { FolderNode, Agent } from '@/store/agent-store';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface FolderTreeProps {
  tree: FolderNode;
  agents: Agent[];
  onSelectFolder: (folder: FolderNode) => void;
  onAddAgent: (folder: FolderNode) => void;
  selectedFolderId?: string;
}

export function FolderTreeWithAgents({
  tree,
  agents,
  onSelectFolder,
  onAddAgent,
  selectedFolderId
}: FolderTreeProps) {
  return (
    <div className="space-y-1">
      <FolderTreeNode
        node={tree}
        agents={agents}
        onSelectFolder={onSelectFolder}
        onAddAgent={onAddAgent}
        selectedFolderId={selectedFolderId}
        level={0}
      />
    </div>
  );
}

interface FolderTreeNodeProps {
  node: FolderNode;
  agents: Agent[];
  onSelectFolder: (folder: FolderNode) => void;
  onAddAgent: (folder: FolderNode) => void;
  selectedFolderId?: string;
  level: number;
}

function FolderTreeNode({
  node,
  agents,
  onSelectFolder,
  onAddAgent,
  selectedFolderId,
  level
}: FolderTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const isSelected = node.id === selectedFolderId;
  
  // Count agents in this folder
  const agentCount = agents.filter(a => a.folderPath === node.path).length;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };
  
  const handleSelect = () => {
    onSelectFolder(node);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };
  
  const handleAddAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddAgent(node);
  };

  // Calculate padding for indentation
  const paddingLeft = level * 12 + 8;

  return (
    <div>
      <div
        className={`
          group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer
          hover:bg-muted transition-colors
          ${isSelected ? 'bg-muted ring-1 ring-border' : ''}
        `}
        style={{ paddingLeft: `${paddingLeft}px` } as React.CSSProperties}
        onClick={handleSelect}
      >
        {/* Expand/collapse icon */}
        {node.children && node.children.length > 0 && (
          <button
            onClick={handleToggle}
            className="p-0 hover:bg-transparent flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown size={16} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}
          </button>
        )}
        
        {/* Spacer if no children */}
        {(!node.children || node.children.length === 0) && (
          <div className="w-4 flex-shrink-0" />
        )}
        
        {/* Folder icon */}
        {isExpanded ? (
          <FolderOpen size={16} className="text-blue-500 flex-shrink-0" />
        ) : (
          <Folder size={16} className="text-blue-500 flex-shrink-0" />
        )}
        
        {/* Folder name */}
        <span className="text-sm flex-1 truncate">{node.name}</span>
        
        {/* Agent count badge */}
        {agentCount > 0 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0">
            {agentCount}
          </Badge>
        )}
        
        {/* Add agent button (visible on hover) */}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 flex-shrink-0"
          onClick={handleAddAgent}
          title="Add agent"
        >
          <Plus size={14} />
        </Button>
      </div>
      
      {/* Children */}
      {isExpanded && node.children && node.children.length > 0 && (
        <div>
          {node.children.map(child => (
            <FolderTreeNode
              key={child.id}
              node={child}
              agents={agents}
              onSelectFolder={onSelectFolder}
              onAddAgent={onAddAgent}
              selectedFolderId={selectedFolderId}
              level={level + 1}
            />
          ))}
        </div>
      )}
      
      {/* Agents in this folder */}
      {isExpanded && agentCount > 0 && (
        <div className="ml-8 space-y-1">
          {agents
            .filter(a => a.folderPath === node.path)
            .map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Select agent
                }}
              >
                <div className="w-4 flex-shrink-0" />
                <span className="text-purple-500 flex-shrink-0">⚡</span>
                <span className="flex-1 truncate text-muted-foreground">
                  {agent.fileName}
                </span>
                <Badge
                  variant={agent.enabled ? 'default' : 'secondary'}
                  className="text-xs px-1.5 py-0"
                >
                  {agent.triggerType.replace('_', ' ')}
                </Badge>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}


