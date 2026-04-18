import { useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Task, ExtractedTask, TaskStatus, TaskFilters } from "../types";

const STORAGE_KEY = "ai-task-agent-tasks";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    status: "All",
    priority: "All",
    search: "",
  });

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  const addTask = useCallback(
    (extracted: ExtractedTask): Task => {
      const now = new Date().toISOString();
      const task: Task = {
        id: uuidv4(),
        title: extracted.title,
        description: extracted.description,
        priority: extracted.priority,
        status: "Pending",
        frequency: extracted.frequency,
        dueDate: extracted.dueDate,
        assignee: extracted.assignee || "Me",
        tags: extracted.tags || [],
        createdAt: now,
        updatedAt: now,
      };
      persist([task, ...tasks]);
      return task;
    },
    [tasks, persist]
  );

  const addMultipleTasks = useCallback(
    (extractedTasks: ExtractedTask[]): Task[] => {
      const now = new Date().toISOString();
      const newTasks: Task[] = extractedTasks.map((et) => ({
        id: uuidv4(),
        title: et.title,
        description: et.description,
        priority: et.priority,
        status: "Pending" as TaskStatus,
        frequency: et.frequency,
        dueDate: et.dueDate,
        assignee: et.assignee || "Me",
        tags: et.tags || [],
        createdAt: now,
        updatedAt: now,
      }));
      persist([...newTasks, ...tasks]);
      return newTasks;
    },
    [tasks, persist]
  );

  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      const updated = tasks.map((t) =>
        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
      );
      persist(updated);
    },
    [tasks, persist]
  );

  const deleteTask = useCallback(
    (id: string) => {
      persist(tasks.filter((t) => t.id !== id));
    },
    [tasks, persist]
  );

  const clearCompleted = useCallback(() => {
    persist(tasks.filter((t) => t.status !== "Completed"));
  }, [tasks, persist]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.status !== "All" && t.status !== filters.status) return false;
      if (filters.priority !== "All" && t.priority !== filters.priority)
        return false;
      if (
        filters.search &&
        !t.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [tasks, filters]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const highPriority = tasks.filter(
      (t) => t.priority === "High" && t.status !== "Completed"
    ).length;
    return { total, pending, inProgress, completed, highPriority };
  }, [tasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    stats,
    filters,
    setFilters,
    addTask,
    addMultipleTasks,
    updateTaskStatus,
    deleteTask,
    clearCompleted,
  };
}
