'use client';

import { useState, useEffect, useMemo } from 'react';
import { FileTreeNode, RuleViolation, Rule } from '@ava/common-types';
import { RulesEngine } from '@ava/rules-engine';
import { RuleTemplates } from '@ava/rules-engine';
import { FileTree } from '@/components/file-tree';
import { CompliancePanel } from '@/components/compliance-panel';
import { RuleTemplatesPanel } from '@/components/rule-templates-panel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createDemoFileTree, createDemoRules, createDemoWorkspace } from '@/lib/demo-data';
import { Play, Settings, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SandboxPage() {
  const [workspace] = useState(createDemoWorkspace);
  const [fileTree] = useState<FileTreeNode>(createDemoFileTree);
  const [rules, setRules] = useState<Rule[]>(createDemoRules);
  const [selectedFile, setSelectedFile] = useState<FileTreeNode | null>(null);
  const [violations, setViolations] = useState<RuleViolation[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Extract all files from tree (flatten)
  const extractAllFiles = (node: FileTreeNode): FileTreeNode[] => {
    const files: FileTreeNode[] = [];
    
    if (node.type === 'file') {
      files.push(node);
    }
    
    if (node.children) {
      for (const child of node.children) {
        files.push(...extractAllFiles(child));
      }
    }
    
    return files;
  };

  // Run compliance check
  const runComplianceCheck = async () => {
    setIsChecking(true);
    const engine = new RulesEngine();
    
    // Get all files from tree
    const files = extractAllFiles(fileTree);
    
    // Check files
    const result = await engine.checkFiles(files, rules);
    setViolations(result.violations);
    
    setIsChecking(false);
  };

  // Calculate violations per file
  const violationsByFile = useMemo(() => {
    const map: Record<string, number> = {};
    violations.forEach(v => {
      map[v.fileNodeId] = (map[v.fileNodeId] || 0) + 1;
    });
    return map;
  }, [violations]);

  // Auto-run check when rules or files change
  useEffect(() => {
    void runComplianceCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, fileTree]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Ava
          </Link>
          <Badge variant="outline" className="bg-purple-50 text-black border-purple-200">
            Sandbox Mode
          </Badge>
          <span className="text-sm text-slate-600">{workspace.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Settings size={16} className="mr-2" />
            Rule Templates
          </Button>
          <ThemeToggle />
          <Button
            size="sm"
            onClick={runComplianceCheck}
            disabled={isChecking}
          >
            <Play size={16} className="mr-2" />
            {isChecking ? 'Checking...' : 'Run Check'}
          </Button>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-900 px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <p className="text-blue-900 dark:text-blue-100 font-medium mb-1">
              Welcome to Ava Sandbox!
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              This is a safe environment to explore compliance rules. Try clicking files to see violations,
              or add new rules from templates. Nothing here affects real data.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <aside className="w-64 border-r bg-muted overflow-y-auto">
          <div className="p-3 border-b bg-background">
            <h2 className="font-semibold text-sm">Files</h2>
          </div>
          <div className="p-2">
            <FileTree
              tree={fileTree}
              onSelectFile={setSelectedFile}
              selectedFileId={selectedFile?.id}
              violations={violationsByFile}
            />
          </div>
        </aside>

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto">
          {selectedFile ? (
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={20} className="text-slate-600" />
                  <h1 className="text-xl font-semibold">{selectedFile.name}</h1>
                  {violationsByFile[selectedFile.id] && (
                    <Badge variant="warning" className="text-black">
                      {violationsByFile[selectedFile.id]} issue{violationsByFile[selectedFile.id] > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">{selectedFile.path}</p>
              </div>

              {/* File Violations */}
              {violations.filter(v => v.fileNodeId === selectedFile.id).length > 0 && (
                <Card className="mb-4 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-black flex items-center gap-2">
                      <AlertCircle size={18} className="text-orange-600" />
                      Compliance Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-slate-600">
                    {violations
                      .filter(v => v.fileNodeId === selectedFile.id)
                      .map(violation => (
                        <div key={violation.id} className="bg-white rounded-lg p-3 border">
                          <div className="flex items-start gap-2">
                            <Badge
                              variant={
                                violation.severity === 'error' ? 'destructive' :
                                violation.severity === 'warning' ? 'warning' : 'info'
                              }
                              className="text-black"
                            >
                              {violation.severity}
                            </Badge>
                            <div className="flex-1">
                              <p className="font-medium text-sm mb-1">{violation.message}</p>
                              {violation.context.suggestedFix && (
                                <p className="text-xs text-slate-600">
                                  💡 {violation.context.suggestedFix}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* File Content */}
              {selectedFile.type === 'file' && selectedFile.content && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">File Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                      {selectedFile.content}
                    </pre>
                  </CardContent>
                </Card>
              )}

              {/* File Metadata */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Metadata</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-slate-600">Type:</div>
                    <div className="font-medium">{selectedFile.type}</div>
                    
                    {selectedFile.metadata.extension && (
                      <>
                        <div className="text-slate-600">Extension:</div>
                        <div className="font-medium">.{selectedFile.metadata.extension}</div>
                      </>
                    )}
                    
                    {selectedFile.metadata.size && (
                      <>
                        <div className="text-slate-600">Size:</div>
                        <div className="font-medium">
                          {(selectedFile.metadata.size / 1024).toFixed(2)} KB
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p className="font-medium">Select a file to view details</p>
                <p className="text-sm">Click on any file in the sidebar</p>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Compliance or Templates */}
        <aside className="w-80 border-l bg-background overflow-hidden flex flex-col">
          {showTemplates ? (
            <RuleTemplatesPanel
              templates={RuleTemplates}
              onSelectTemplate={(template) => {
                // Add rule from template
                const newRule: Rule = {
                  id: `rule-${Date.now()}`,
                  workspaceId: workspace.id,
                  name: template.name,
                  description: template.description,
                  type: template.type,
                  severity: 'warning',
                  enabled: true,
                  config: template.config,
                  scope: { applyToAll: true },
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  createdBy: 'demo-user',
                };
                setRules([...rules, newRule]);
                setShowTemplates(false);
              }}
            />
          ) : (
            <CompliancePanel
              violations={violations}
              onViolationClick={(violation) => {
                // Find and select the file with this violation
                const files = extractAllFiles(fileTree);
                const file = files.find(f => f.id === violation.fileNodeId);
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
          )}
        </aside>
      </div>

      {/* Active Rules Footer */}
      <footer className="border-t bg-muted px-4 py-2">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground font-medium">Active Rules:</span>
          {rules.filter(r => r.enabled).map(rule => (
            <Badge key={rule.id} variant="outline" className="text-xs text-black">
              {rule.name}
            </Badge>
          ))}
        </div>
      </footer>
    </div>
  );
}

