'use client';

import { RuleViolation } from '@ava/common-types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface CompliancePanelProps {
  violations: RuleViolation[];
  onViolationClick?: (violation: RuleViolation) => void;
}

export function CompliancePanel({ violations, onViolationClick }: CompliancePanelProps) {
  const errorCount = violations.filter(v => v.severity === 'error').length;
  const warningCount = violations.filter(v => v.severity === 'warning').length;
  const infoCount = violations.filter(v => v.severity === 'info').length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg mb-3 ">Compliance Issues</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-black">{errorCount}</Badge>
            <span className="text-sm text-slate-600 dark:text-slate-400">Errors</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="text-black">{warningCount}</Badge>
            <span className="text-sm text-slate-600 dark:text-slate-400">Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="info" className="text-black">{infoCount}</Badge>
            <span className="text-sm text-slate-600 dark:text-slate-400">Info</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {violations.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-4xl mb-2">✅</div>
            <p className="font-medium">All clear!</p>
            <p className="text-sm">No compliance issues detected</p>
          </div>
        ) : (
          violations.map((violation) => (
            <Card
              key={violation.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViolationClick?.(violation)}
            >
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start gap-2">
                  {violation.severity === 'error' && <ExclamationCircleIcon className="size-5 text-red-500 mt-0.5 flex-shrink-0" />}
                  {violation.severity === 'warning' && <ExclamationTriangleIcon className="size-5 text-orange-500 mt-0.5 flex-shrink-0" />}
                  {violation.severity === 'info' && <InformationCircleIcon className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium">
                      {violation.message}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 truncate">
                      {violation.context.filePath}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      violation.severity === 'error' ? 'destructive' :
                      violation.severity === 'warning' ? 'warning' : 'info'
                    }
                    className="text-xs text-black flex-shrink-0"
                  >
                    {violation.severity}
                  </Badge>
                </div>
              </CardHeader>
              {violation.context.suggestedFix && (
                <CardContent className="pt-0">
                  <div className="bg-slate-50 rounded p-2 text-xs">
                    <span className="font-medium text-slate-700">💡 Suggestion:</span>
                    <p className="text-slate-600 mt-1">{violation.context.suggestedFix}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

