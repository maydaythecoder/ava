'use client';

import { Agent } from '@/store/agent-store';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  PlayIcon, 
  PauseIcon, 
  PencilIcon, 
  TrashIcon, 
  LinkIcon, 
  ServerIcon, 
  CalendarIcon,
  FolderOpenIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface AgentCardProps {
  agent: Agent;
  onEdit?: (agent: Agent) => void;
  onDelete?: (agent: Agent) => void;
  onToggle?: (agent: Agent) => void;
  onRun?: (agent: Agent) => void;
}

export function AgentCard({ agent, onEdit, onDelete, onToggle, onRun }: AgentCardProps) {
  const getAgentTypeColor = (type?: string) => {
    switch (type) {
      case 'watcher': return 'text-blue-500';
      case 'notifier': return 'text-green-500';
      case 'runner': return 'text-purple-500';
      case 'pipeline': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getAgentTypeIcon = (type?: string) => {
    switch (type) {
      case 'watcher': return '👁️';
      case 'notifier': return '📢';
      case 'runner': return '▶️';
      case 'pipeline': return '🔄';
      default: return '⚡';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{getAgentTypeIcon(agent.type)}</span>
              {agent.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant={agent.enabled ? 'default' : 'secondary'} className="text-xs">
                {agent.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {agent.triggerType.replace('_', ' ')}
              </Badge>
              {agent.type && (
                <Badge variant="outline" className={`text-xs ${getAgentTypeColor(agent.type)}`}>
                  {agent.type}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            {onRun && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRun(agent)}
                title="Run now"
                className="h-10 w-10 sm:h-8 sm:w-8 p-0"
              >
                <PlayIcon className="size-5 sm:size-4" />
              </Button>
            )}
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggle(agent)}
                title={agent.enabled ? 'Disable' : 'Enable'}
                className="h-10 w-10 sm:h-8 sm:w-8 p-0"
              >
                {agent.enabled ? <PauseIcon className="size-5 sm:size-4" /> : <PlayIcon className="size-5 sm:size-4" />}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(agent)}
                title="Edit"
                className="h-10 w-10 sm:h-8 sm:w-8 p-0"
              >
                <PencilIcon className="size-5 sm:size-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(agent)}
                title="Delete"
                className="h-10 w-10 sm:h-8 sm:w-8 p-0 text-destructive hover:text-destructive"
              >
                <TrashIcon className="size-5 sm:size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-start gap-2 text-sm">
          <FolderOpenIcon className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-xs text-muted-foreground mb-1">Location</div>
            <code className="text-xs bg-muted px-2 py-1 rounded block truncate max-w-full" title={`${agent.folderPath}/${agent.fileName}`}>{agent.folderPath}/{agent.fileName}</code>
          </div>
        </div>

        {/* Prompt */}
        <div className="space-y-1">
          <div className="font-medium text-xs text-muted-foreground flex items-center gap-1">
            <SparklesIcon className="size-3.5" />
            Prompt
          </div>
          <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
            {agent.prompt}
          </div>
        </div>

        {/* Context */}
        {agent.context && (
          <div className="space-y-1">
            <div className="font-medium text-xs text-muted-foreground">Context</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
              {agent.context}
            </div>
          </div>
        )}

        {/* Context Links */}
        {agent.contextLinks && agent.contextLinks.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-xs text-muted-foreground flex items-center gap-1">
              <LinkIcon className="size-3.5" />
              Context Links ({agent.contextLinks.length})
            </div>
            <div className="space-y-1">
              {agent.contextLinks.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-500 hover:underline truncate"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* MCP Servers */}
        {agent.contextMcpServers && agent.contextMcpServers.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium text-xs text-muted-foreground flex items-center gap-1">
              <ServerIcon className="size-3.5" />
              MCP Servers ({agent.contextMcpServers.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {agent.contextMcpServers.map((server, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {server}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Scope */}
        <div className="space-y-2">
          <div className="font-medium text-xs text-muted-foreground">Scope</div>
          {agent.scope.applyToAll ? (
            <Badge variant="outline" className="text-xs">All files</Badge>
          ) : (
            <div className="space-y-1">
              {agent.scope.includePaths && agent.scope.includePaths.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {agent.scope.includePaths.map((path, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {path}
                    </Badge>
                  ))}
                </div>
              )}
              {agent.scope.fileTypes && agent.scope.fileTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {agent.scope.fileTypes.map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      .{type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Last Run */}
        {agent.lastRunAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
            <CalendarIcon className="size-3" />
            Last run: {new Date(agent.lastRunAt).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


