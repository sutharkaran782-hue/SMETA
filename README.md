# Multimodal AI Emergency Triage Prioritization System

This is a React + Supabase prototype for patient intake and emergency triage prioritization using simple rule-based severity detection.

## Tech stack

- React with Vite
- JavaScript
- Supabase Database + Storage

## Folder structure

```text
.
|-- .env.example
|-- index.html
|-- package.json
|-- README.md
|-- supabase
|   `-- schema.sql
|-- src
|   |-- App.jsx
|   |-- index.css
|   |-- main.jsx
|   |-- components
|   |   |-- EmptyState.jsx
|   |   |-- Layout.jsx
|   |   |-- PatientForm.jsx
|   |   |-- PriorityBadge.jsx
|   |   `-- QueueList.jsx
|   |-- pages
|   |   |-- DoctorDashboardPage.jsx
|   |   `-- PatientInputPage.jsx
|   |-- services
|   |   `-- supabase.js
|   `-- utils
|       `-- severity.js
|-- vite.config.js
```

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and add your Supabase credentials:

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

3. Add your values in `.env`:

   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In Supabase, run the SQL from `supabase/schema.sql`.

5. The SQL script also creates the `patient-images` public bucket and basic prototype policies.

6. Start the app:

   ```bash
   npm run dev
   ```

If you skip Supabase setup, the prototype now falls back to browser-local storage so
the intake form and queue can still be tested locally.

## Features

- Patient symptom submission
- Optional image upload
- Rule-based severity detection
- Auto-generated emergency summary
- Supabase-backed queue storage
- Doctor dashboard sorted by severity
