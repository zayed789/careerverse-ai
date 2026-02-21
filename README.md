🚀 CareerVerse AI – Placement Intelligence System

AI-Powered Career Development & Placement Readiness Platform

CareerVerse AI is a multi-agent, full-stack placement intelligence system that evaluates and tracks a student’s career readiness across DSA, Aptitude, Resume Optimization, Skill Gap Analysis, and Interview Performance — all unified under a single Career Readiness Index.

🌟 Overview

Students prepare for placements across multiple platforms (coding sites, aptitude books, mock interviews), but there is no unified system to measure consistency, readiness, or performance trends.

CareerVerse AI solves this by:

Evaluating performance using AI agents

Persisting metrics per user

Aggregating scores into a centralized dashboard

Providing a real-time Career Readiness Index (0–100)

🧠 Core Features
📊 Placement Intelligence Dashboard

Career Readiness Index (Gauge)

Risk Status Indicator

DSA Performance

Aptitude Performance

Resume ATS Score

Skill Gap Alignment Score

Interview Performance

Consistency Metrics

Trend Analytics

💻 DSA Practice Arena

Easy / Medium / Hard Problems

Built-in JavaScript Code Editor

AI-based evaluation

Rubric-based scoring (correctness, optimization, clarity)

Persistent progress tracking

🧮 Aptitude Challenge

20-question assessment

Automated scoring

Section-based evaluation

📄 Resume Optimization

AI-powered ATS scoring

Keyword match percentage

Resume improvement insights

🎯 Skill Gap Analyzer

Role-based alignment scoring

Missing critical skills detection

AI-generated recommendations

🎙️ Mock Interview System

Multi-stage interview evaluation

AI scoring

Structured feedback

🏗️ System Architecture
High-Level Design

User (Frontend – React / Lovable)
↓
n8n AI Orchestration (Webhooks + Agents)
↓
Supabase (Auth + PostgreSQL Database)
↓
Dashboard Aggregation

⚙️ Tech Stack
Frontend

React (Vite)

Tailwind CSS

Lovable AI Builder

Framer Motion (animations)

Lucide Icons

Backend / Orchestration

n8n (AI Agent Workflows)

Webhook-based evaluation

Database

Supabase (PostgreSQL)

Supabase Auth (Email + Password)

AI Layer

LLM-based evaluation agents

Rubric-driven DSA scoring

Structured JSON outputs

🗄️ Database Schema
user_metrics
Column	Type
user_id	uuid (Primary Key)
dsa_score	integer
aptitude_score	integer
ats_score	integer
skill_gap_score	integer
interview_score	integer
consistency_score	integer
readiness_score	integer
solved_problems	json
updated_at	timestamp

Each user has a dedicated row storing their placement metrics.

📈 Career Readiness Formula

readiness =
(0.30 × DSA Score) +
(0.20 × Aptitude Score) +
(0.15 × ATS Score) +
(0.10 × Skill Gap Score) +
(0.15 × Interview Score) +
(0.10 × Consistency Score)

Clamped between 0–100.

🔐 Authentication & Data Isolation

Supabase Auth (Email + Password)

Row-Level Security (RLS) enabled

Data filtered by user_id = auth.uid()

Each user sees only their own metrics

🎨 UI Features

Dark Mode (default)

Full Light Mode support

Smooth theme transitions

Premium SaaS design

Responsive layout

Gradient typography

Dashboard analytics visuals

🚀 Getting Started (Local Setup)
1️⃣ Clone the Repository
git clone https://github.com/yourusername/careerverse-ai.git
cd careerverse-ai
2️⃣ Install Dependencies
npm install
3️⃣ Setup Environment Variables

Create a .env file:

VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
4️⃣ Run Development Server
npm run dev
🔄 n8n Webhooks

The platform uses webhook-based AI evaluation:

/webhook/dsa

/webhook/aptitude

/webhook/resume-analysis

/webhook/skill-gap

/webhook/interview

Ensure workflows are activated in production mode for live usage.
