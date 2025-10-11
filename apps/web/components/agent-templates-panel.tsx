'use client';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AgentTemplate } from '@/lib/agent-demo-data';

interface AgentTemplatesPanelProps {
  templates: AgentTemplate[];
  onSelectTemplate: (template: AgentTemplate) => void;
  onClose: () => void;
}

export function AgentTemplatesPanel({
  templates,
  onSelectTemplate,
  onClose
}: AgentTemplatesPanelProps) {
  // Group templates by category
  const categories = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, AgentTemplate[]>);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'watcher': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'notifier': return 'text-green-500 bg-green-50 border-green-200';
      case 'runner': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'pipeline': return 'text-orange-500 bg-orange-50 border-orange-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-background flex items-center justify-between">
        <h2 className="font-semibold text-lg">Agent Templates</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(categories).map(([category, categoryTemplates]) => (
          <div key={category}>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-3">
              {categoryTemplates.map(template => (
                <Card
                  key={template.id}
                  className="hover:shadow-md active:shadow-lg transition-shadow cursor-pointer active:scale-[0.98]"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getTypeColor(template.type)}`}>
                        {template.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.defaultTrigger.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-3 gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                    >
                      <PlusIcon className="size-4" />
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


