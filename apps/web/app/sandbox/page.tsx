'use client';

import { useState } from 'react';
import { Agent, FolderNode } from '@/store/agent-store';
import { FolderTreeWithAgents } from '@/components/folder-tree-with-agents';
import { AgentCreator } from '@/components/agent-creator';
import { AgentListPanel } from '@/components/agent-list-panel';
import { AgentTemplatesPanel } from '@/components/agent-templates-panel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Settings, FolderTree, Play } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  createDemoWorkspaceId,
  createDemoFolderTree,
  createDemoAgents,
  getAgentTemplates,
  AgentTemplate
} from '@/lib/agent-demo-data';

export default function SandboxPage() {
  // Initialize with demo data
  const [folderTree] = useState<FolderNode>(createDemoFolderTree());
  const [agents, setAgents] = useState<Agent[]>(createDemoAgents());
  const [selectedFolder, setSelectedFolder] = useState<FolderNode | null>(null);
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [workspaceName] = useState('Demo Workspace');

  const handleAddAgent = (folder: FolderNode) => {
    setSelectedFolder(folder);
    setIsCreatingAgent(true);
    setShowTemplates(false);
  };

  const handleSaveAgent = (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: `agent-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setAgents([...agents, newAgent]);
    setIsCreatingAgent(false);
  };

  const handleCancelCreate = () => {
    setIsCreatingAgent(false);
  };

  const handleSelectFolder = (folder: FolderNode) => {
    setSelectedFolder(folder);
    setIsCreatingAgent(false);
  };

  const handleEditAgent = (agent: Agent) => {
    // TODO: Implement edit mode
    console.log('Edit agent:', agent);
  };

  const handleDeleteAgent = (agent: Agent) => {
    if (confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      setAgents(agents.filter(a => a.id !== agent.id));
    }
  };

  const handleToggleAgent = (agent: Agent) => {
    setAgents(agents.map(a =>
      a.id === agent.id ? { ...a, enabled: !a.enabled, updatedAt: new Date() } : a
    ));
  };

  const handleRunAgent = (agent: Agent) => {
    alert(`Running agent: ${agent.name}\n\nThis would trigger the agent execution in production.`);
  };

  const handleSelectTemplate = (template: AgentTemplate) => {
    if (!selectedFolder) {
      alert('Please select a folder first');
      return;
    }

    // Pre-fill agent creator with template data
    const templateAgent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> = {
      workspaceId: createDemoWorkspaceId(),
      folderPath: selectedFolder.path,
      name: template.name,
      fileName: `${template.name.toLowerCase().replace(/\s+/g, '-')}.ava`,
      prompt: template.promptTemplate,
      context: template.contextTemplate,
      contextLinks: [],
      contextMcpServers: [],
      triggerType: template.defaultTrigger,
      triggerConfig: {},
      scope: { applyToAll: true },
      type: template.type,
      enabled: true,
      createdBy: 'current-user'
    };

    handleSaveAgent(templateAgent);
    setShowTemplates(false);
  };

  const enabledAgentsCount = agents.filter(a => a.enabled).length;
  const totalAgentsCount = agents.length;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Ava
          </Link>
          <Badge variant="outline" className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            Sandbox Mode
          </Badge>
          <span className="text-sm text-slate-600 dark:text-slate-400">{workspaceName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground mr-2">
            <span className="font-medium">{enabledAgentsCount}</span> / {totalAgentsCount} agents active
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowTemplates(!showTemplates);
              setIsCreatingAgent(false);
            }}
          >
            <Settings size={16} className="mr-2" />
            Templates
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-b border-purple-200 dark:border-purple-900 px-4 py-3 flex-shrink-0">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="text-purple-900 dark:text-purple-100 font-medium mb-1">
              Welcome to Ava Agent Studio!
            </p>
            <p className="text-purple-700 dark:text-purple-300">
              Create AI agents to automate your workflow. Click any folder and hit the + button to add an agent, 
              or use templates to get started quickly. Agents run based on triggers you define.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Folder Tree */}
        <aside className="w-80 border-r bg-muted/30 overflow-y-auto flex-shrink-0">
          <div className="p-3 border-b bg-background sticky top-0 z-10">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <FolderTree size={16} />
              Project Structure
            </h2>
          </div>
          <div className="p-2">
            <FolderTreeWithAgents
              tree={folderTree}
              agents={agents}
              onSelectFolder={handleSelectFolder}
              onAddAgent={handleAddAgent}
              selectedFolderId={selectedFolder?.id}
            />
          </div>
        </aside>

        {/* Center Content - Agent Creator or Welcome */}
        <main className="flex-1 overflow-y-auto bg-background">
          {isCreatingAgent && selectedFolder ? (
            <AgentCreator
              folder={selectedFolder}
              onSave={handleSaveAgent}
              onCancel={handleCancelCreate}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6">
              <div className="max-w-md">
                <Sparkles size={64} className="mx-auto mb-6 text-purple-500 opacity-80" />
                <h1 className="text-3xl font-bold mb-4">Create Your First Agent</h1>
                <p className="text-muted-foreground mb-6">
                  Select a folder from the tree on the left and click the + button to create an agent,
                  or browse templates to get started with pre-built configurations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    onClick={() => setShowTemplates(true)}
                    className="gap-2"
                  >
                    <Settings size={18} />
                    Browse Templates
                  </Button>
                  {selectedFolder && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => handleAddAgent(selectedFolder)}
                      className="gap-2"
                    >
                      <Play size={18} />
                      Create Custom Agent
                    </Button>
                  )}
              </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{totalAgentsCount}</div>
                    <div className="text-xs text-muted-foreground">Total Agents</div>
                            </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{enabledAgentsCount}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                          </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {new Set(agents.map(a => a.folderPath)).size}
                        </div>
                    <div className="text-xs text-muted-foreground">Folders</div>
                  </div>
            </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Agent List or Templates */}
        <aside className="w-96 border-l bg-background overflow-hidden flex flex-col flex-shrink-0">
          {showTemplates ? (
            <AgentTemplatesPanel
              templates={getAgentTemplates()}
              onSelectTemplate={handleSelectTemplate}
              onClose={() => setShowTemplates(false)}
            />
          ) : (
            <AgentListPanel
              folder={selectedFolder}
              agents={agents}
              onAddAgent={selectedFolder ? () => handleAddAgent(selectedFolder) : undefined}
              onEditAgent={handleEditAgent}
              onDeleteAgent={handleDeleteAgent}
              onToggleAgent={handleToggleAgent}
              onRunAgent={handleRunAgent}
            />
          )}
        </aside>
      </div>

      {/* Footer - Active Agents Summary */}
      <footer className="border-t bg-muted/30 px-4 py-2 flex items-center justify-between text-sm flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground font-medium">Active Agents:</span>
          <div className="flex items-center gap-2">
            {agents.filter(a => a.enabled).slice(0, 5).map(agent => (
              <Badge key={agent.id} variant="outline" className="text-xs">
                {agent.name}
            </Badge>
          ))}
            {enabledAgentsCount > 5 && (
              <Badge variant="outline" className="text-xs">
                +{enabledAgentsCount - 5} more
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Sandbox • Changes are not persisted
        </div>
      </footer>
    </div>
  );
}
