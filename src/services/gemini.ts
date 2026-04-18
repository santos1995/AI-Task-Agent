import { GoogleGenAI, Type } from "@google/genai";
import type { ExtractedTask } from "../types";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing from environment variables. Set it in .env.local"
  );
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const TODAY = () => new Date().toISOString().split("T")[0];
const DEFAULT_DUE = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
};

/**
 * Extract tasks from a natural-language message using Gemini AI.
 */
export async function extractTasksFromMessage(
  message: string
): Promise<{ tasks: ExtractedTask[]; reply: string }> {
  if (!apiKey) {
    return {
      tasks: [],
      reply:
        "I cannot process your request because the Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.",
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
      config: {
        systemInstruction: `You are an AI Task Agent -- a smart assistant that helps users manage their tasks.

Your capabilities:
1. EXTRACT tasks from natural language messages, meeting notes, to-do lists, or any text input.
2. ORGANIZE tasks by priority, due date, and category.
3. ANSWER questions about task management, productivity tips, and time management.
4. SUGGEST improvements to how tasks are described or organized.

TASK EXTRACTION RULES:
- When the user describes work to be done, extract it as one or more tasks.
- Each task needs: title (concise, action-oriented), description, priority (High/Medium/Low), frequency (Once/Daily/Weekly/Monthly), dueDate (YYYY-MM-DD), assignee (default "Me"), tags (relevant categories).
- If no due date is mentioned, default to ${DEFAULT_DUE()}.
- If no priority is mentioned, infer from context or default to "Medium".
- If the message is a question or conversation (not task-related), set tasks to an empty array.

RESPONSE FORMAT:
Return a JSON object with two fields:
- "tasks": array of extracted tasks (empty if none found)
- "reply": a helpful, conversational response to the user. If tasks were extracted, summarize what you found. If it is a question, answer it helpfully.

Current date: ${TODAY()}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: {
                    type: Type.STRING,
                    enum: ["High", "Medium", "Low"],
                  },
                  frequency: {
                    type: Type.STRING,
                    enum: ["Once", "Daily", "Weekly", "Monthly"],
                  },
                  dueDate: { type: Type.STRING },
                  assignee: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["title", "description", "priority", "dueDate"],
              },
            },
            reply: { type: Type.STRING },
          },
          required: ["tasks", "reply"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      return { tasks: [], reply: "I received an empty response. Please try again." };
    }

    const result = JSON.parse(text);
    const tasks: ExtractedTask[] = (result.tasks || []).map(
      (t: Partial<ExtractedTask>) => ({
        title: t.title || "Untitled Task",
        description: t.description || "",
        priority: t.priority || "Medium",
        frequency: t.frequency || "Once",
        dueDate: t.dueDate || DEFAULT_DUE(),
        assignee: t.assignee || "Me",
        tags: t.tags || [],
      })
    );

    return { tasks, reply: result.reply || "Tasks extracted successfully." };
  } catch (error: unknown) {
    console.error("Error extracting tasks:", error);
    const msg =
      error instanceof Error ? error.message : "An unknown error occurred";
    return {
      tasks: [],
      reply: `Sorry, I encountered an error processing your message: ${msg}`,
    };
  }
}

/**
 * Get an AI-powered summary/suggestion for a list of tasks.
 */
export async function getTaskSuggestions(
  taskSummary: string
): Promise<string> {
  if (!apiKey) return "API key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Here are my current tasks:\n\n${taskSummary}\n\nPlease analyze these tasks and give me:\n1. A brief prioritization suggestion\n2. Any tasks that might be related or could be combined\n3. Time management tips specific to this workload`,
      config: {
        systemInstruction:
          "You are a productivity coach. Give concise, actionable advice. Use bullet points. Keep it under 200 words.",
      },
    });

    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return "Could not generate suggestions at this time.";
  }
}
