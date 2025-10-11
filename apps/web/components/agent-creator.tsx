'use client';

import { useState } from 'react';
import { X, Plus, Link as LinkIcon, Server, Save, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
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
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-purple-500" size={24} />
            Create New Agent
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            In: <span className="font-mono text-xs">{folder.path}</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={18} />
        </Button>
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
            className="w-full min-h-[120px] p-3 text-sm border rounded-md bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
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
            className="w-full min-h-[80px] p-3 text-sm border rounded-md bg-background resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </CardContent>
      </Card>

      {/* Context Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LinkIcon size={16} />
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
            <Button onClick={handleAddLink} size="sm" variant="secondary">
              <Plus size={16} />
            </Button>
          </div>
          {links.length > 0 && (
            <div className="space-y-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <LinkIcon size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{link}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLink(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X size={14} />
                  </Button>
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
            <Server size={16} />
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
            <Button onClick={handleAddMcpServer} size="sm" variant="secondary">
              <Plus size={16} />
            </Button>
          </div>
          {mcpServers.length > 0 && (
            <div className="space-y-2">
              {mcpServers.map((server, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <Server size={14} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{server}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMcpServer(index)}
                    className="h-6 w-6 p-0"
                  >
                    <X size={14} />
                  </Button>
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
          <div className="grid grid-cols-2 gap-2">
            {(['on_commit', 'hourly', 'daily', 'on_change', 'manual'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTriggerType(type)}
                className={`
                  px-4 py-3 text-sm font-medium rounded-md border-2 transition-all
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
          <div className="flex gap-2">
            {(['all', 'paths', 'types'] as const).map((type) => (
              <Button
                key={type}
                variant={scopeType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setScopeType(type)}
              >
                {type === 'all' ? 'All Files' : type === 'paths' ? 'Specific Paths' : 'File Types'}
              </Button>
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
                <Button onClick={handleAddPath} size="sm" variant="secondary">
                  <Plus size={16} />
                </Button>
              </div>
              {includePaths.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {includePaths.map((path, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      {path}
                      <button title="Remove path" onClick={() => handleRemovePath(index)}>
                        <X size={12} />
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
                <Button onClick={handleAddFileType} size="sm" variant="secondary">
                  <Plus size={16} />
                </Button>
              </div>
              {fileTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {fileTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="gap-2">
                      .{type}
                      <button title="Remove file type" onClick={() => handleRemoveFileType(index)}>
                        <X size={12} />
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
      <div className="flex gap-3 pb-6">
        <Button onClick={handleSave} className="flex-1" size="lg">
          <Save size={18} className="mr-2" />
          Save Agent
        </Button>
        <Button onClick={onCancel} variant="outline" size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
}


