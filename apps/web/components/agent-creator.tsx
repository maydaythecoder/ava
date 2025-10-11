'use client';

import { useState } from 'react';
import { XMarkIcon, PlusIcon, LinkIcon, ServerIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { Agent, FolderNode } from '@/store/agent-store';

interface AgentCreatorProps {
  folder: FolderNode;
  onSave: (agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function AgentCreator({ folder, onSave, onCancel }: AgentCreatorProps) {
  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [links, setLinks] = useState<string[]>([]);
  const [mcpServers, setMcpServers] = useState<string[]>([]);
  const [triggerType, setTriggerType] = useState<Agent['triggerType']>('on_commit');
  const [scopeType, setScopeType] = useState<'all' | 'paths' | 'types'>('all');
  const [includePaths, setIncludePaths] = useState<string[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  
  // Temporary input states
  const [newLink, setNewLink] = useState('');
  const [newMcpServer, setNewMcpServer] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newFileType, setNewFileType] = useState('');

  const handleAddLink = () => {
    if (newLink.trim()) {
      setLinks([...links, newLink.trim()]);
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleAddMcpServer = () => {
    if (newMcpServer.trim()) {
      setMcpServers([...mcpServers, newMcpServer.trim()]);
      setNewMcpServer('');
    }
  };

  const handleRemoveMcpServer = (index: number) => {
    setMcpServers(mcpServers.filter((_, i) => i !== index));
  };

  const handleAddPath = () => {
    if (newPath.trim()) {
      setIncludePaths([...includePaths, newPath.trim()]);
      setNewPath('');
    }
  };

  const handleRemovePath = (index: number) => {
    setIncludePaths(includePaths.filter((_, i) => i !== index));
  };

  const handleAddFileType = () => {
    if (newFileType.trim()) {
      setFileTypes([...fileTypes, newFileType.trim()]);
      setNewFileType('');
    }
  };

  const handleRemoveFileType = (index: number) => {
    setFileTypes(fileTypes.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !prompt.trim()) {
      alert('Agent name and prompt are required');
      return;
    }

    const scope: Agent['scope'] = scopeType === 'all'
      ? { applyToAll: true }
      : scopeType === 'paths'
      ? { includePaths }
      : { fileTypes };

    const agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> = {
      workspaceId: 'demo-workspace-1', // TODO: Get from context
      folderPath: folder.path,
      name: name.trim(),
      fileName: `${name.trim().toLowerCase().replace(/\s+/g, '-')}.ava`,
      prompt: prompt.trim(),
      context: context.trim(),
      contextLinks: links,
      contextMcpServers: mcpServers,
      triggerType,
      triggerConfig: {},
      scope,
      enabled: true,
      createdBy: 'current-user', // TODO: Get from auth
      lastRunAt: undefined
    };

    onSave(agent);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="text-purple-500 size-6" />
            Create New Agent
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            In: <span className="font-mono text-xs">{folder.path}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <XMarkIcon className="size-6" />
        </button>
      </div>

      {/* Agent Name */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Agent Name</CardTitle>
          <CardDescription>Give your agent a descriptive name</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g., Code Reviewer, Security Scanner"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-base"
          />
        </CardContent>
      </Card>

      {/* Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Prompt</CardTitle>
          <CardDescription>Define what the agent should do</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="E.g., Review code changes for security vulnerabilities and best practices..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full min-h-[100px] sm:min-h-[120px] p-3 text-sm border rounded-md bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardContent>
      </Card>

      {/* Context */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Context</CardTitle>
          <CardDescription>Additional context to help the agent understand its role</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="E.g., This API handles sensitive user data. All endpoints must be secured..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full min-h-[80px] sm:min-h-[80px] p-3 text-sm border rounded-md bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardContent>
      </Card>

      {/* Context Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon className="size-4" />
            Context Links
          </CardTitle>
          <CardDescription>Add reference links for the agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="https://docs.example.com/guidelines"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
            />
                <button
                  type="button"
                  onClick={handleAddLink}
                  aria-label="Add link"
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
                >
                  <PlusIcon className="size-4" />
                </button>
          </div>
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <LinkIcon className="size-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    aria-label="Remove link"
                    className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MCP Servers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ServerIcon className="size-4" />
            MCP Servers
          </CardTitle>
          <CardDescription>Connect to Model Context Protocol servers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., security-scanner, code-quality"
              value={newMcpServer}
              onChange={(e) => setNewMcpServer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMcpServer()}
            />
            <button
              type="button"
              onClick={handleAddMcpServer}
              aria-label="Add MCP server"
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
          {mcpServers.length > 0 && (
            <div className="space-y-2">
              {mcpServers.map((server, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <ServerIcon className="size-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{server}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMcpServer(index)}
                    aria-label="Remove MCP server"
                    className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trigger Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">When to Run</CardTitle>
          <CardDescription>Choose when this agent should be triggered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(['on_commit', 'hourly', 'daily', 'on_change', 'manual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTriggerType(type)}
                className={`
                  px-4 py-3 text-sm font-medium rounded-md border-2 transition-all w-full min-h-[44px]
                  ${triggerType === type
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                  }
                `}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scope Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scope</CardTitle>
          <CardDescription>Define where this agent operates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {(['all', 'paths', 'types'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setScopeType(type)}
                className={
                  scopeType === type
                    ? 'inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 dark:bg-purple-500 dark:hover:bg-purple-400 flex-1 min-h-[44px]'
                    : 'inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20 flex-1 min-h-[44px]'
                }
              >
                {type === 'all' ? 'All Files' : type === 'paths' ? 'Specific Paths' : 'File Types'}
              </button>
            ))}
          </div>

          {scopeType === 'paths' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., src/api/, backend/"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPath()}
                />
                <button
                  type="button"
                  onClick={handleAddPath}
                  aria-label="Add path"
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
              {includePaths.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {includePaths.map((path, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {path}
                      <button title="Remove path" type="button" onClick={() => handleRemovePath(index)}>
                        <XMarkIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {scopeType === 'types' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., ts, tsx, js"
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFileType()}
                />
                <button
                  type="button"
                  onClick={handleAddFileType}
                  aria-label="Add file type"
                  className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
                >
                  <PlusIcon className="size-4" />
                </button>
              </div>
              {fileTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fileTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      .{type}
                      <button title="Remove file type" type="button" onClick={() => handleRemoveFileType(index)}>
                        <XMarkIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-white/10">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 dark:bg-purple-500 dark:hover:bg-purple-400"
        >
          <CheckIcon className="size-5 mr-2" />
          Save Agent
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}


