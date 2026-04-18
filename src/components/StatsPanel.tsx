import {
  CheckCircle2,
  Clock,
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { getTaskSuggestions } from "../services/gemini";
import type { Task } from "../types";

interface StatsPanelProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    highPriority: number;
  };
  allTasks: Task[];
}

export function StatsPanel({ stats, allTasks }: StatsPanelProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const completionRate =
    stats.total > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0;

  const handleGetSuggestions = async () => {
    if (allTasks.length === 0) return;
    setLoadingSuggestions(true);
    const summary = allTasks
      .filter((t) => t.status !== "Completed")
      .map(
        (t) =>
          `- [${t.priority}] ${t.title} (due: ${t.dueDate}, status: ${t.status})`
      )
      .join("\n");
    const result = await getTaskSuggestions(summary);
    setSuggestions(result);
    setLoadingSuggestions(false);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-600" />
        Task Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Pending"
          value={stats.pending}
          color="text-gray-600"
          bg="bg-gray-100"
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="In Progress"
          value={stats.inProgress}
          color="text-blue-600"
          bg="bg-blue-100"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Completed"
          value={stats.completed}
          color="text-green-600"
          bg="bg-green-100"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="High Priority"
          value={stats.highPriority}
          color="text-red-600"
          bg="bg-red-100"
        />
      </div>

      {/* Completion Progress */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Completion Rate
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {completionRate}%
          </span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {stats.completed} of {stats.total} tasks completed
        </p>
      </div>

      {/* AI Suggestions */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-indigo-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            AI Productivity Tips
          </h3>
          <button
            onClick={handleGetSuggestions}
            disabled={loadingSuggestions || allTasks.length === 0}
            className={cn(
              "text-xs px-3 py-1.5 rounded-lg font-medium transition-colors",
              allTasks.length > 0
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {loadingSuggestions ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              "Get Tips"
            )}
          </button>
        </div>

        {suggestions ? (
          <div className="prose prose-sm max-w-none text-gray-700 text-xs [&>ul]:pl-4 [&>ul>li]:mb-1">
            <ReactMarkdown>{suggestions}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-xs text-indigo-600/60">
            {allTasks.length === 0
              ? "Add some tasks first, then get AI-powered productivity tips."
              : 'Click "Get Tips" for AI-powered suggestions based on your current tasks.'}
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
      <div className={cn("p-2 rounded-lg", bg, color)}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  );
}
