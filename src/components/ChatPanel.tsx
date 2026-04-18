import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";
import { extractTasksFromMessage } from "../services/gemini";
import type { Message, ExtractedTask } from "../types";
import { v4 as uuidv4 } from "uuid";

interface ChatPanelProps {
  onTasksExtracted: (tasks: ExtractedTask[]) => void;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: `Hi! I'm your **AI Task Agent**. I can help you manage tasks using natural language.

Try saying things like:
- "I need to finish the report by Friday and review the budget next Monday"
- "Set up a weekly team standup meeting every Monday at 9am"
- "High priority: Fix the login bug before end of day"

I'll extract the tasks, organize them by priority, and help you stay on track. What would you like to work on?`,
  sender: "ai",
  timestamp: new Date().toISOString(),
};

export function ChatPanel({ onTasksExtracted }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { tasks, reply } = await extractTasksFromMessage(text);

      const aiMessage: Message = {
        id: uuidv4(),
        text: reply,
        sender: "ai",
        timestamp: new Date().toISOString(),
        extractedTasks: tasks.length > 0 ? tasks : undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (tasks.length > 0) {
        onTasksExtracted(tasks);
      }
    } catch {
      const errorMessage: Message = {
        id: uuidv4(),
        text: "Sorry, something went wrong. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-3",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === "ai" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-800 rounded-bl-md"
              )}
            >
              <div className="prose prose-sm max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>p:last-child]:mb-0">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>

              {msg.extractedTasks && msg.extractedTasks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200/50 space-y-2">
                  <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    {msg.extractedTasks.length} task
                    {msg.extractedTasks.length > 1 ? "s" : ""} added
                  </p>
                  {msg.extractedTasks.map((task, i) => (
                    <div
                      key={i}
                      className="bg-white/60 rounded-lg px-3 py-2 text-xs"
                    >
                      <span className="font-medium">{task.title}</span>
                      <span
                        className={cn(
                          "ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium",
                          task.priority === "High" &&
                            "bg-red-100 text-red-600",
                          task.priority === "Medium" &&
                            "bg-amber-100 text-amber-600",
                          task.priority === "Low" &&
                            "bg-green-100 text-green-600"
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your tasks or ask a question..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-32"
            style={{
              height: "auto",
              minHeight: "40px",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 128) + "px";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "shrink-0 p-2.5 rounded-xl transition-all",
              input.trim() && !isLoading
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">
          AI Task Agent uses Gemini to extract and organize tasks from natural
          language
        </p>
      </div>
    </div>
  );
}
