import { Search, Filter, Trash2, ListTodo } from "lucide-react";
import { cn } from "../lib/utils";
import { TaskItem } from "./TaskItem";
import type { Task, TaskStatus, Priority, TaskFilters } from "../types";

interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onClearCompleted: () => void;
  completedCount: number;
}

export function TaskList({
  tasks,
  filters,
  onFiltersChange,
  onStatusChange,
  onDelete,
  onClearCompleted,
  completedCount,
}: TaskListProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />

          {(["All", "Pending", "In Progress", "Completed"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  onFiltersChange({
                    ...filters,
                    status: status as TaskStatus | "All",
                  })
                }
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                  filters.status === status
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {status}
              </button>
            )
          )}

          <span className="text-gray-300">|</span>

          {(["All", "High", "Medium", "Low"] as const).map((priority) => (
            <button
              key={priority}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  priority: priority as Priority | "All",
                })
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                filters.priority === priority
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {priority}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear {completedCount} completed
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <ListTodo className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">No tasks yet</p>
            <p className="text-xs mt-1">
              Chat with the AI to create tasks from natural language
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
