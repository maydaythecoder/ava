'use client';

import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, FolderOpenIcon, PlusIcon } from '@heroicons/react/24/outline';
import { FolderNode, Agent } from '@/store/agent-store';
import { Badge } from './ui/badge';

interface FolderTreeProps {
  tree: FolderNode;
  agents: Agent[];
  onSelectFolder: (folder: FolderNode) => void;
  onAddAgent: (folder: FolderNode) => void;
  selectedFolderId?: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function FolderTreeWithAgents({
  tree,
  agents,
  onSelectFolder,
  onAddAgent,
  selectedFolderId
}: FolderTreeProps) {
  return (
    <nav aria-label="Folder tree">
      <FolderTreeNode
        node={tree}
        agents={agents}
        onSelectFolder={onSelectFolder}
        onAddAgent={onAddAgent}
        selectedFolderId={selectedFolderId}
        level={0}
      />
    </nav>
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
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const isSelected = node.id === selectedFolderId;
  
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

  return (
    <div>
      <button
        onClick={handleSelect}
        aria-label={`Select ${node.name}`}
        className={classNames(
          isSelected
            ? 'bg-gray-50 text-purple-600 dark:bg-white/5 dark:text-white'
            : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
          'group flex w-full items-center gap-x-2 rounded-md p-2 text-sm font-medium transition-colors'
        )}
        // Dynamic padding based on nesting level - inline style necessary for dynamic calculation
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {node.children && node.children.length > 0 && (
          <button
            onClick={handleToggle}
            className="p-0 hover:bg-transparent flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDownIcon className="size-4 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronRightIcon className="size-4 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        )}
        
        {(!node.children || node.children.length === 0) && (
          <div className="w-4 flex-shrink-0" />
        )}
        
        {isExpanded ? (
          <FolderOpenIcon className={classNames(
            isSelected
              ? 'text-purple-600 dark:text-white'
              : 'text-blue-500 group-hover:text-purple-600 dark:text-blue-400 dark:group-hover:text-white',
            'size-5 flex-shrink-0'
          )} />
        ) : (
          <FolderIcon className={classNames(
            isSelected
              ? 'text-purple-600 dark:text-white'
              : 'text-blue-500 group-hover:text-purple-600 dark:text-blue-400 dark:group-hover:text-white',
            'size-5 flex-shrink-0'
          )} />
        )}
        
        <span className="flex-1 truncate text-left">{node.name}</span>
        
        {agentCount > 0 && (
          <span className="ml-auto inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 outline-1 -outline-offset-1 outline-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:outline-white/10">
            {agentCount}
          </span>
        )}
        
        <button
          onClick={handleAddAgent}
          className="opacity-0 group-hover:opacity-100 ml-1 inline-flex items-center justify-center size-6 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:text-white dark:hover:bg-white/10 transition-all"
          title="Add agent"
        >
          <PlusIcon className="size-4" />
        </button>
      </button>
      
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
      
      {isExpanded && agentCount > 0 && (
        <div className="ml-8 space-y-1">
          {agents
            .filter(a => a.folderPath === node.path)
            .map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-50 cursor-pointer dark:text-gray-400 dark:hover:bg-white/5"
              >
                <div className="w-4 flex-shrink-0" />
                <span className="text-purple-500 flex-shrink-0 dark:text-purple-400">⚡</span>
                <span className="flex-1 truncate">
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
