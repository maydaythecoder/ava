'use client';

import { Agent, FolderNode } from '@/store/agent-store';
import { AgentCard } from './agent-card';
import { Button } from './ui/button';
import { Plus, Sparkles } from 'lucide-react';

interface AgentListPanelProps {
  folder: FolderNode | null;
  agents: Agent[];
  onAddAgent?: () => void;
  onEditAgent?: (agent: Agent) => void;
  onDeleteAgent?: (agent: Agent) => void;
  onToggleAgent?: (agent: Agent) => void;
  onRunAgent?: (agent: Agent) => void;
}

export function AgentListPanel({
  folder,
  agents,
  onAddAgent,
  onEditAgent,
  onDeleteAgent,
  onToggleAgent,
  onRunAgent
}: AgentListPanelProps) {
  const folderAgents = folder
    ? agents.filter(a => a.folderPath === folder.path)
    : [];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="text-purple-500" size={20} />
            Agents
          </h2>
          {folder && onAddAgent && (
            <Button onClick={onAddAgent} size="sm" className="gap-2">
              <Plus size={16} />
              Add Agent
            </Button>
          )}
        </div>
        {folder && (
          <p className="text-xs text-muted-foreground">
            In: <code className="bg-muted px-1.5 py-0.5 rounded">{folder.path}</code>
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!folder ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="font-medium">Select a folder</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a folder to view or create agents
              </p>
            </div>
          </div>
        ) : folderAgents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <div>
              <Sparkles size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="font-medium">No agents yet</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create an agent to automate tasks in this folder
              </p>
              {onAddAgent && (
                <Button onClick={onAddAgent} className="gap-2">
                  <Plus size={16} />
                  Create First Agent
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {folderAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onEdit={onEditAgent}
                onDelete={onDeleteAgent}
                onToggle={onToggleAgent}
                onRun={onRunAgent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


