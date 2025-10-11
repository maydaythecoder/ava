'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  Cog6ToothIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { Agent, FolderNode } from '@/store/agent-store';
import { FolderTreeWithAgents } from '@/components/folder-tree-with-agents';
import { AgentCreator } from '@/components/agent-creator';
import { AgentListPanel } from '@/components/agent-list-panel';
import { AgentTemplatesPanel } from '@/components/agent-templates-panel';
import { Badge } from '@/components/ui/badge';
import {
  createDemoWorkspaceId,
  createDemoFolderTree,
  createDemoAgents,
  getAgentTemplates,
  AgentTemplate
} from '@/lib/agent-demo-data';

export default function SandboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="h-screen bg-white dark:bg-gray-900">
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-r dark:before:border-white/10 dark:before:bg-black/10">
            <div className="relative flex h-16 shrink-0 items-center">
              <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-xl font-bold dark:text-white">Ava</span>
            </div>
              <nav className="relative flex flex-1 flex-col">
                <div className="flex-1">
                  <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3">PROJECT STRUCTURE</h2>
                  <FolderTreeWithAgents
                    tree={folderTree}
                    agents={agents}
                    onSelectFolder={handleSelectFolder}
                    onAddAgent={handleAddAgent}
                    selectedFolderId={selectedFolder?.id}
                  />
                </div>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <div className="relative flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-gray-900 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
          <div className="relative flex h-16 shrink-0 items-center">
            <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Ava</span>
            <Badge variant="outline" className="ml-3 bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
              Sandbox
            </Badge>
          </div>
          <nav className="relative flex flex-1 flex-col">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500">PROJECT STRUCTURE</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {enabledAgentsCount}/{totalAgentsCount} active
                </span>
              </div>
              <FolderTreeWithAgents
                tree={folderTree}
                agents={agents}
                onSelectFolder={handleSelectFolder}
                onAddAgent={handleAddAgent}
                selectedFolderId={selectedFolder?.id}
              />
            </div>
            <div className="-mx-6 mt-auto border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                <span className="size-8 rounded-full bg-gray-50 flex items-center justify-center outline-1 -outline-offset-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10">
                  <span className="text-xs">DC</span>
                </span>
                <span aria-hidden="true">{workspaceName}</span>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:border-b dark:before:border-white/10 dark:before:bg-black/10">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="relative -m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-400"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="relative flex-1 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          Ava Sandbox
          </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          aria-label="Toggle settings"
          className="relative rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <Cog6ToothIcon className="size-6" />
        </button>
          </div>

      {/* Main content area */}
      <main className="lg:pl-80">
        <div className="xl:pr-96">
          <div className="h-screen overflow-y-auto">
            {/* Info banner */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200 px-4 py-3 sm:px-6 lg:px-8 dark:from-purple-950/30 dark:to-blue-950/30 dark:border-purple-900">
              <div className="flex items-start gap-3">
                <SparklesIcon className="size-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm">
                  <p className="text-purple-900 dark:text-purple-100 font-medium mb-1">
                    Welcome to Ava Agent Studio
                  </p>
                  <p className="text-purple-700 dark:text-purple-300">
                    Create AI agents to automate your workflow. Click any folder and hit the + button to add an agent.
                  </p>
                            </div>
                          </div>
                        </div>

            {/* Content */}
            {isCreatingAgent && selectedFolder ? (
              <div className="px-4 py-6 sm:px-6 lg:px-8">
                <AgentCreator
                  folder={selectedFolder}
                  onSave={handleSaveAgent}
                  onCancel={handleCancelCreate}
                />
                        </div>
            ) : (
              <div className="px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <SparklesIcon className="size-16 mx-auto mb-6 text-purple-500 opacity-80" />
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    Create Your First Agent
                  </h1>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                    Select a folder from the sidebar and click the + button to create an agent, or browse templates to get started.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400"
                    >
                      <Cog6ToothIcon className="size-5 mr-2" />
                      Browse Templates
                    </button>
                    {selectedFolder && (
                      <button
                        onClick={() => handleAddAgent(selectedFolder)}
                        className="inline-flex items-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
                      >
                        <PlusIcon className="size-5 mr-2" />
                        Create Custom Agent
                      </button>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-16 grid grid-cols-3 gap-8">
                    <div>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalAgentsCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Agents</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">{enabledAgentsCount}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {new Set(agents.map(a => a.folderPath)).size}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Folders</div>
                    </div>
                  </div>
            </div>
              </div>
            )}
              </div>
            </div>
        </main>

      {/* Right sidebar */}
      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 xl:block dark:border-white/10">
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
  );
}
