'use client';

/**
 * Workflow Visualizer Component
 * Visualizes GitHub Actions workflows as interactive diagrams
 */

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { ParsedWorkflow } from '@ava/workflow-parser';

interface WorkflowVisualizerProps {
  workflow: ParsedWorkflow;
  width?: number;
  height?: number;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'trigger' | 'job' | 'step';
}

interface Link {
  source: string;
  target: string;
}

export function WorkflowVisualizer({ workflow, width = 800, height = 600 }: WorkflowVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !workflow) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Build graph data
    const nodes: Node[] = [];
    const links: Link[] = [];

    // Add trigger node
    const triggerNode: Node = {
      id: 'trigger',
      label: workflow.triggers?.map(t => t.type).join(', ') || 'manual',
      type: 'trigger',
    };
    nodes.push(triggerNode);

    // Add job nodes
    (workflow.jobs || []).forEach((job) => {
      const jobId = job.id;
    const jobNode: Node = {
      id: `job-${jobId}`,
      label: job.name || jobId,
      type: 'job',
    };
    nodes.push(jobNode);
    links.push({ source: 'trigger', target: `job-${jobId}` });

    // Add step nodes
    (job.steps || []).forEach((step, index) => {
      const stepNode: Node = {
        id: `job-${jobId}-step-${index}`,
        label: step.name || step.uses || step.run?.substring(0, 30) || `Step ${index + 1}`,
        type: 'step',
      };
      nodes.push(stepNode);

      if (index === 0) {
        links.push({ source: `job-${jobId}`, target: stepNode.id });
      } else {
        links.push({ source: `job-${jobId}-step-${index - 1}`, target: stepNode.id });
      }
    });
  });

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: d3.SimulationNodeDatum) => (d as Node).id || '')
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Create links
    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#6b7280')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', 'url(#arrowhead)');

    // Add arrow marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#6b7280');

    // Create node groups
    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(
        d3.drag<SVGGElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as never
      );

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        if (d.type === 'trigger') return '#8b5cf6';
        if (d.type === 'job') return '#3b82f6';
        return '#10b981';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add labels
    node
      .append('text')
      .text((d) => d.label)
      .attr('x', 0)
      .attr('y', 35)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#374151')
      .each(function (d) {
        const text = d3.select(this);
        const words = d.label.split(/\s+/);
        text.text(null);

        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = parseFloat(text.attr('y'));

        words.forEach((word) => {
          line.push(word);
          const testLine = line.join(' ');
          if (testLine.length > 20 && line.length > 1) {
            line.pop();
            text
              .append('tspan')
              .attr('x', 0)
              .attr('y', y)
              .attr('dy', `${lineNumber * lineHeight}em`)
              .text(line.join(' '));
            line = [word];
            lineNumber++;
          }
        });

        if (line.length > 0) {
          text
            .append('tspan')
            .attr('x', 0)
            .attr('y', y)
            .attr('dy', `${lineNumber * lineHeight}em`)
            .text(line.join(' '));
        }
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: unknown) => (d as { source: { x?: number } }).source.x || 0)
        .attr('y1', (d: unknown) => (d as { source: { y?: number } }).source.y || 0)
        .attr('x2', (d: unknown) => (d as { target: { x?: number } }).target.x || 0)
        .attr('y2', (d: unknown) => (d as { target: { y?: number } }).target.y || 0);

      node.attr('transform', (d: unknown) => {
        const node = d as Node;
        return `translate(${node.x || 0},${node.y || 0})`;
      });
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [workflow, width, height]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/10 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {workflow.name || 'Workflow Visualization'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Interactive diagram showing workflow structure
        </p>
      </div>
      <svg
        ref={svgRef}
        className="border border-gray-200 dark:border-white/10 rounded"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

