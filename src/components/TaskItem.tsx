import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  ChevronRight,
  Calendar,
  Tag,
  User,
} from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { cn } from "../lib/utils";
import type { Task, TaskStatus } from "../types";

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  High: "border-l-red-500 bg-red-50",
  Medium: "border-l-amber-500 bg-amber-50",
  Low: "border-l-green-500 bg-green-50",
};

const statusIcons = {
  Pending: <Clock className="w-4 h-4 text-gray-400" />,
  "In Progress": <AlertCircle className="w-4 h-4 text-blue-500" />,
  Completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
};

const nextStatus: Record<TaskStatus, TaskStatus> = {
  Pending: "In Progress",
  "In Progress": "Completed",
  Completed: "Pending",
};

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  const dueDate = new Date(task.dueDate);
  const overdue = isPast(dueDate) && task.status !== "Completed";
  const dueToday = isToday(dueDate);

  return (
    <div
      className={cn(
        "border-l-4 rounded-lg p-4 shadow-sm transition-all hover:shadow-md",
        priorityColors[task.priority],
        task.status === "Completed" && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onStatusChange(task.id, nextStatus[task.status])}
              className="shrink-0 hover:scale-110 transition-transform"
              title={`Click to mark as ${nextStatus[task.status]}`}
            >
              {statusIcons[task.status]}
            </button>
            <h3
              className={cn(
                "font-semibold text-gray-800 truncate",
                task.status === "Completed" && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h3>
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium shrink-0",
                task.priority === "High" &&
                  "bg-red-100 text-red-700",
                task.priority === "Medium" &&
                  "bg-amber-100 text-amber-700",
                task.priority === "Low" &&
                  "bg-green-100 text-green-700"
              )}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 ml-6 mb-2 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 ml-6 text-xs text-gray-500">
            <span
              className={cn(
                "flex items-center gap-1",
                overdue && "text-red-600 font-semibold",
                dueToday && !overdue && "text-amber-600 font-semibold"
              )}
            >
              <Calendar className="w-3 h-3" />
              {overdue
                ? "Overdue"
                : dueToday
                  ? "Due today"
                  : format(dueDate, "MMM d, yyyy")}
            </span>

            {task.assignee && (
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.assignee}
              </span>
            )}

            {task.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {task.tags.slice(0, 3).join(", ")}
              </span>
            )}

            <span className="flex items-center gap-1 text-gray-400">
              <ChevronRight className="w-3 h-3" />
              {task.frequency}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
