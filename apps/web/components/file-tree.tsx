'use client';

import { useState } from 'react';
import type { FileTreeNode } from '@ava/common-types';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface FileTreeProps {
  tree: FileTreeNode;
  onSelectFile: (file: FileTreeNode) => void;
  selectedFileId?: string;
  violations?: Record<string, number>; // fileId -> violation count
}

export function FileTree({ tree, onSelectFile, selectedFileId, violations = {} }: FileTreeProps) {
  return (
    <div className="text-sm">
      <TreeNode
        node={tree}
        onSelectFile={onSelectFile}
        selectedFileId={selectedFileId}
        violations={violations}
        depth={0}
      />
    </div>
  );
}

interface FileTreeNodeProps {
  node: FileTreeNode;
  onSelectFile: (file: FileTreeNode) => void;
  selectedFileId?: string;
  violations: Record<string, number>;
  depth: number;
}

function TreeNode({ node, onSelectFile, selectedFileId, violations, depth }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(depth === 0 || depth === 1);
  const isFolder = node.type === 'folder';
  const isSelected = node.id === selectedFileId;
  const violationCount = violations[node.id] || 0;
  const hasViolations = violationCount > 0;

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
    onSelectFile(node);
  };

  return (
    <div>
      <div
        className={cn(
          'tree-node flex items-center gap-1 py-1.5 rounded cursor-pointer hover:bg-slate-100',
          isSelected && 'bg-blue-50 hover:bg-blue-100',
          hasViolations && 'border-l-2 border-orange-400'
        )}
        data-depth={depth}
        onClick={handleClick}
      >
        {isFolder && (
          <span className="text-slate-500">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {!isFolder && <span className="w-4" />}
        
        <span className="text-slate-600">
          {isFolder ? (
            isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
            <File size={16} />
          )}
        </span>
        
        <span className={cn(
          'flex-1 truncate',
          isSelected && 'font-medium text-blue-900',
          !isSelected && 'text-slate-700'
        )}>
          {node.name}
        </span>
        
        {hasViolations && (
          <Badge variant="warning" className="ml-2">
            {violationCount}
          </Badge>
        )}
      </div>
      
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onSelectFile={onSelectFile}
              selectedFileId={selectedFileId}
              violations={violations}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

