export type Priority = "High" | "Medium" | "Low";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type Frequency = "Once" | "Daily" | "Weekly" | "Monthly";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  frequency: Frequency;
  dueDate: string;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  extractedTasks?: ExtractedTask[];
}

export interface ExtractedTask {
  title: string;
  description: string;
  priority: Priority;
  frequency: Frequency;
  dueDate: string;
  assignee: string;
  tags: string[];
}

export interface TaskFilters {
  status: TaskStatus | "All";
  priority: Priority | "All";
  search: string;
}
