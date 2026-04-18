import { Bot, ListTodo, MessageSquare, BarChart3 } from "lucide-react";
import { cn } from "../lib/utils";

interface HeaderProps {
  activeTab: "chat" | "tasks" | "stats";
  onTabChange: (tab: "chat" | "tasks" | "stats") => void;
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    highPriority: number;
  };
}

export function Header({ activeTab, onTabChange, stats }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Task Agent</h1>
              <p className="text-xs text-white/70">
                Powered by Gemini AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1">
            <TabButton
              active={activeTab === "chat"}
              onClick={() => onTabChange("chat")}
              icon={<MessageSquare className="w-4 h-4" />}
              label="Chat"
            />
            <TabButton
              active={activeTab === "tasks"}
              onClick={() => onTabChange("tasks")}
              icon={<ListTodo className="w-4 h-4" />}
              label="Tasks"
              badge={stats.pending > 0 ? stats.pending : undefined}
            />
            <TabButton
              active={activeTab === "stats"}
              onClick={() => onTabChange("stats")}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Stats"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
        active
          ? "bg-white text-indigo-700 shadow-sm"
          : "text-white/80 hover:text-white hover:bg-white/10"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge !== undefined && (
        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </button>
  );
}
