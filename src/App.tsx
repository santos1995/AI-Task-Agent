import { useState } from "react";
import { Header } from "./components/Header";
import { ChatPanel } from "./components/ChatPanel";
import { TaskList } from "./components/TaskList";
import { StatsPanel } from "./components/StatsPanel";
import { useTaskManager } from "./hooks/useTaskManager";
import type { ExtractedTask } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "tasks" | "stats">(
    "chat"
  );

  const {
    tasks,
    allTasks,
    stats,
    filters,
    setFilters,
    addMultipleTasks,
    updateTaskStatus,
    deleteTask,
    clearCompleted,
  } = useTaskManager();

  const handleTasksExtracted = (extracted: ExtractedTask[]) => {
    addMultipleTasks(extracted);
    // Auto-switch to tasks tab when tasks are created
    if (extracted.length > 0) {
      setTimeout(() => setActiveTab("tasks"), 500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      <main className="flex-1 overflow-hidden max-w-5xl w-full mx-auto">
        <div className="h-full bg-white shadow-sm border-x border-gray-200">
          {activeTab === "chat" && (
            <ChatPanel onTasksExtracted={handleTasksExtracted} />
          )}
          {activeTab === "tasks" && (
            <TaskList
              tasks={tasks}
              filters={filters}
              onFiltersChange={setFilters}
              onStatusChange={updateTaskStatus}
              onDelete={deleteTask}
              onClearCompleted={clearCompleted}
              completedCount={stats.completed}
            />
          )}
          {activeTab === "stats" && (
            <StatsPanel stats={stats} allTasks={allTasks} />
          )}
        </div>
      </main>
    </div>
  );
}
