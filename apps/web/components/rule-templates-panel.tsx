'use client';

import { RuleTemplate } from '@ava/common-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface RuleTemplatesPanelProps {
  templates: RuleTemplate[];
  onSelectTemplate: (template: RuleTemplate) => void;
}

export function RuleTemplatesPanel({ templates, onSelectTemplate }: RuleTemplatesPanelProps) {
  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, RuleTemplate[]>);

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="font-semibold text-lg mb-1">Rule Templates</h2>
        <p className="text-sm text-slate-600">
          Quick-start templates for common compliance rules
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            <h3 className="font-medium text-sm text-slate-700 mb-3">{category}</h3>
            <div className="space-y-2">
              {categoryTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="text-xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-sm font-medium">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        {template.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  {template.exampleUsage && (
                    <CardContent className="pt-0">
                      <div className="text-xs text-slate-600 mb-3">
                        <span className="font-medium">Example:</span> {template.exampleUsage}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onSelectTemplate(template)}
                      >
                        Add Rule
                      </Button>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

