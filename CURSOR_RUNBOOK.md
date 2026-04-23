# FlowState Commander Bolt — Cursor Runbook

> Keep this file open while building. Follow phases in order. Complete each phase before starting the next.

## How to use this runbook
1. Open Cursor IDE in your project folder
2. Open the Chat panel (Cmd+L)
3. For each phase: paste the "Say this to Cursor" prompt, wait for Cursor to finish, then run the verification steps
4. Only move to the next phase when verification passes

## Project Overview
FlowState Commander Bolt is a productivity app designed to help users manage their time and tasks effectively through visual timelines, compassionate habit tracking, and gentle nudges. It aims to provide a calming and structured environment for users to enhance their focus and productivity.

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- Postgres
- Realtime updates
- PWA capabilities

---

## Phase 0: Project Setup
**What this phase does:** Scaffold the project structure and install dependencies.

**Say this to Cursor:**
```
Read my .codespring/ folder to understand the project. Then scaffold the bolt project structure with all dependencies installed and a working dev server.
```

**How to verify it worked:**
- [ ] Dev server starts without errors (npm run dev / yarn dev)
- [ ] You can open localhost:3000 in a browser
- [ ] No TypeScript errors in the terminal

**If something breaks, say this to Cursor:**
```
The setup failed with this error: [paste error here]. Fix it without changing the project structure.
```

---

## Phase 1: Visual Time Blocks (Past–Future Fader)
**What this phase does:** Create a vertical timeline that displays draggable task blocks with fading effects for past and current tasks.

**Say this to Cursor:**
```
Implement a vertical timeline from 6:00 AM to 10:00 PM that displays draggable task blocks. The past blocks should fade, and the current block should pulse. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] The timeline displays correctly from 6:00 AM to 10:00 PM.
- [ ] Past blocks fade visually, and the current block pulses.
- [ ] Users can drag and resize task blocks.

**If something breaks, say this to Cursor:**
```
The Visual Time Blocks feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 2: Time Confetti Estimator
**What this phase does:** Allow users to estimate task durations in 15-minute increments, visually represented on task cards.

**Say this to Cursor:**
```
Create a Time Confetti Estimator that allows users to estimate task durations in 15-minute increments (1-4 units). The task card length should reflect this estimate. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Users can select 1 to 4 confetti units for task duration.
- [ ] Task card lengths adjust according to the selected confetti count.
- [ ] The estimation process is intuitive and quick.

**If something breaks, say this to Cursor:**
```
The Time Confetti Estimator feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 3: Auto Buffers Between Tasks
**What this phase does:** Automatically insert 15-minute buffers between scheduled tasks to reduce context-switching.

**Say this to Cursor:**
```
Implement automatic 15-minute buffer blocks between scheduled tasks. These should be visible and adjustable by the user. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Buffers appear automatically between adjacent scheduled tasks.
- [ ] Users can override or remove individual buffers.
- [ ] Buffers adjust in real-time during task creation or editing.

**If something breaks, say this to Cursor:**
```
The Auto Buffers feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 4: Focus Now Mode
**What this phase does:** Create a full-screen focus mode that allows users to concentrate on a single task with options to mark completion or report distraction.

**Say this to Cursor:**
```
Develop a Focus Now Mode that provides a full-screen interface for focusing on a single task. Include options for marking the task as Done or reporting a distraction, which should trigger a 5-minute recovery buffer. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Users can enter Focus Now Mode and see a live progress bar.
- [ ] Users can mark tasks as Done or report distractions.
- [ ] A 5-minute buffer is added when a distraction is reported.

**If something breaks, say this to Cursor:**
```
The Focus Now Mode feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 5: Keystone Habits with Compassionate Streaks
**What this phase does:** Allow users to designate up to three keystone habits and log their completion with a non-binary scale.

**Say this to Cursor:**
```
Implement Keystone Habits functionality that allows users to select up to three habits and log their completion using states: Done, Partial, Adapted, and Forgive. Ensure compassionate streak logic is applied. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Users can select and log up to three keystone habits.
- [ ] The logging interface supports non-binary completion states.
- [ ] Streaks are preserved according to the compassionate logic.

**If something breaks, say this to Cursor:**
```
The Keystone Habits feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 6: Today-Only (Zero-Inbox) View
**What this phase does:** Create a focused home view that displays only today's tasks, minimizing overwhelm.

**Say this to Cursor:**
```
Develop a Today-Only view that surfaces only tasks actionable today, while future tasks are tucked away in a secondary section. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] The home view displays only today's tasks.
- [ ] Future tasks are accessible but visually de-emphasized.
- [ ] Users can easily triage tasks for today.

**If something breaks, say this to Cursor:**
```
The Today-Only View feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 7: Gentle Notifications
**What this phase does:** Implement opt-in notifications that gently nudge users to focus on tasks or habits.

**Say this to Cursor:**
```
Create Gentle Notifications that provide opt-in nudges for tasks and habits, allowing users to snooze or reschedule. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Users receive gentle nudges for scheduled tasks.
- [ ] Notifications offer options to Snooze or Reschedule.
- [ ] Notifications respect user preferences and quiet hours.

**If something breaks, say this to Cursor:**
```
The Gentle Notifications feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 8: Body Double On-Demand
**What this phase does:** Create a feature for on-demand focus sessions with a calming avatar and ambient sound.

**Say this to Cursor:**
```
Implement Body Double On-Demand that allows users to start 25-minute focus sessions with a calming avatar and optional ambient sound. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] Users can start a 25-minute focus session.
- [ ] The calming avatar is displayed during the session.
- [ ] Users can choose ambient sound options.

**If something breaks, say this to Cursor:**
```
The Body Double feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Phase 9: Progress Dashboard
**What this phase does:** Create a dashboard that displays weekly completion percentage, focus time, and momentum streak.

**Say this to Cursor:**
```
Develop a Progress Dashboard that shows users their weekly completion percentage, focus time, and momentum streak. Use Next.js and Tailwind for the frontend.
```

**How to verify it worked:**
- [ ] The dashboard displays accurate weekly completion percentage.
- [ ] Focus time and momentum streak are shown correctly.
- [ ] Users can easily interpret their progress metrics.

**If something breaks, say this to Cursor:**
```
The Progress Dashboard feature failed with this error: [paste error here]. Fix it without changing other features.
```

---

## Final Phase: Testing & Polish
**Say this to Cursor:**
```
Review the entire codebase. Fix any TypeScript errors, broken imports, or missing connections between features. Make sure all features from the .codespring/PRDs/ folder are implemented.
```

**How to verify the full app works:**
- [ ] All features are functional and integrated correctly.
- [ ] No TypeScript errors are present.
- [ ] The app runs smoothly without performance issues.
- [ ] Users can navigate through all features without errors.
- [ ] The visual design is consistent and user-friendly.
