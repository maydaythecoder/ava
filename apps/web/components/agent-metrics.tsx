'use client';

/**
 * Agent Metrics Component
 * Displays agent execution metrics using Recharts
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AgentMetricsProps {
  agentName: string;
}

// Mock data - replace with actual API calls
const mockData = [
  { date: '2025-10-01', executions: 12, successes: 11, failures: 1 },
  { date: '2025-10-02', executions: 15, successes: 14, failures: 1 },
  { date: '2025-10-03', executions: 18, successes: 17, failures: 1 },
  { date: '2025-10-04', executions: 14, successes: 12, failures: 2 },
  { date: '2025-10-05', executions: 20, successes: 19, failures: 1 },
  { date: '2025-10-06', executions: 16, successes: 15, failures: 1 },
  { date: '2025-10-07', executions: 22, successes: 21, failures: 1 },
];

export function AgentMetrics({ agentName }: AgentMetricsProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-white/10 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {agentName} - Execution Metrics
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Last 7 days of execution history
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'currentColor' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(17, 24, 39)',
              border: '1px solid rgb(55, 65, 81)',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'rgb(243, 244, 246)' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="executions"
            stackId="1"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
            name="Total Executions"
          />
          <Area
            type="monotone"
            dataKey="successes"
            stackId="2"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
            name="Successes"
          />
          <Area
            type="monotone"
            dataKey="failures"
            stackId="3"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.6}
            name="Failures"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">117</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Executions</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">109</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Successes</div>
        </div>
        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">8</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Failures</div>
        </div>
      </div>
    </div>
  );
}

