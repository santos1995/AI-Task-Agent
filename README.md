# AI Task Agent

An AI-powered task management agent that extracts, organizes, and tracks tasks using natural language. Built with React, TypeScript, Tailwind CSS, and Google Gemini AI.

## Features

- **Natural Language Task Extraction**: Describe your tasks in plain English and the AI will extract structured tasks with title, priority, due date, and more.
- **Smart Prioritization**: AI automatically assigns priority levels (High/Medium/Low) based on context and urgency cues.
- **Task Management**: Full CRUD operations with status tracking (Pending, In Progress, Completed).
- **Filtering & Search**: Filter tasks by status, priority, or search by keyword.
- **AI Productivity Tips**: Get AI-powered suggestions and time management advice based on your current task list.
- **Persistent Storage**: Tasks are saved in localStorage so they survive page refreshes.
- **Modern UI**: Clean, responsive interface built with Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18+
- A Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Examples

Try typing these in the chat:

- "I need to finish the quarterly report by Friday and schedule a team review for next Monday"
- "High priority: Fix the production bug in the auth module before end of day"
- "Set up weekly standup meetings every Monday, review sprint backlog on Wednesdays"
- "Buy groceries, clean the house, and prepare for the dinner party on Saturday"

The AI will extract tasks with appropriate priorities, due dates, and descriptions.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **AI**: Google Gemini 2.0 Flash
- **Build Tool**: Vite 6
- **Server**: Express.js
- **Icons**: Lucide React

## Project Structure

```
src/
  components/
    ChatPanel.tsx      - Chat interface for AI interaction
    Header.tsx         - Navigation header with tabs
    StatsPanel.tsx     - Task statistics and AI tips
    TaskItem.tsx       - Individual task card
    TaskList.tsx       - Task list with filters
  hooks/
    useTaskManager.ts  - Task state management hook
  lib/
    utils.ts           - Utility functions (cn helper)
  services/
    gemini.ts          - Gemini AI integration
  types.ts             - TypeScript type definitions
  App.tsx              - Main application component
  main.tsx             - Entry point
  index.css            - Global styles
```

## Deploy to Vercel (Go Live)

The easiest way to make this agent live:

1. **Merge the PR** on GitHub (or push `main` directly)
2. Go to [vercel.com/new](https://vercel.com/new) and import the `santos1995/AI-Task-Agent` repository
3. In the Vercel project settings, add your environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: your Gemini API key
4. Click **Deploy** -- Vercel will build and host it automatically
5. Your agent will be live at `https://ai-task-agent-<your-id>.vercel.app`

Every push to `main` will trigger an automatic redeployment.

### Alternative: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel          # follow prompts, set GEMINI_API_KEY when asked
vercel --prod   # deploy to production
```

## License

MIT
