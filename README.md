# ⚡ QuizBattle

Real-time 1v1 multiplayer quiz game built with React, Node.js, Socket.IO, and MySQL.

## Features

- **1v1 Real-time Battles** — Challenge other players head-to-head
- **Instant Matchmaking** — Socket.IO powered queue system
- **Speed Scoring** — Faster answers earn bonus points (100 base + remaining_sec × 5)
- **10 Questions per Match** — 10 seconds per question, auto-advance on timeout
- **Beautiful UI** — Dark gradient theme, glassmorphism, Framer Motion animations
- **Confetti for Winners** 🎉

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Backend | Node.js + Express |
| Realtime | Socket.IO |
| Database | MySQL 8 |
| Containerization | Docker + Docker Compose |

## Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

Open [http://localhost:5000](http://localhost:5000) — that's it!

### Option 2: Local Development

**Prerequisites:** Node.js 18+, MySQL 8

#### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/questions.sql
```

#### 2. Backend

```bash
cd backend
cp .env.example .env   # Edit with your MySQL credentials
npm install
npm run dev             # Starts on :5000
```

#### 3. Frontend

```bash
cd frontend
npm install
npm run dev             # Starts on :5173 with proxy to :5000
```

Open [http://localhost:5173](http://localhost:5173) in **two tabs** and click **Play Now** in both!

## Project Structure

```
QuizBattle/
├── frontend/          # React + Vite
│   └── src/
│       ├── components/  # Navbar, Hero, GameCard, QuestionCard, Timer, etc.
│       ├── pages/       # Home, Matchmaking, Game, Result
│       ├── hooks/       # useSocket, useTimer
│       └── services/    # socket.js, api.js
├── backend/           # Node.js + Express + Socket.IO
│   ├── config/          # db.js (MySQL pool)
│   ├── controllers/     # quizController, gameController
│   ├── routes/          # quizRoutes
│   ├── socket/          # socketHandler (matchmaking + game loop)
│   ├── utils/           # calculateScore, shuffleQuestions
│   └── server.js
├── database/          # SQL schema + seed data
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Game Flow

1. **Home** → Click "Play Now"
2. **Matchmaking** → Wait for opponent (socket queue)
3. **Countdown** → 3... 2... 1... GO!
4. **Game** → 10 questions, 10s each, live score updates
5. **Result** → Winner banner, stats, confetti 🎉
6. **Play Again** or **Home**

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/questions` | Fetch 10 random questions |
| GET | `/api/online` | Online player count |
| GET | `/api/match/:id` | Match results |
| GET | `/api/health` | Health check |

## Socket Events

| Direction | Event | Description |
|-----------|-------|-------------|
| Client → | `joinQueue` | Enter matchmaking |
| Client → | `leaveQueue` | Cancel matchmaking |
| Client → | `submitAnswer` | Submit answer + time |
| → Client | `matchFound` | Paired with opponent |
| → Client | `countdown` | 3, 2, 1, GO |
| → Client | `nextQuestion` | New question data |
| → Client | `answerResult` | Correct/wrong feedback |
| → Client | `scoreUpdate` | Both players' scores |
| → Client | `gameOver` | Final results |

## Scoring

| Action | Points |
|--------|--------|
| Correct answer | 100 |
| Speed bonus | Remaining seconds × 5 |
| Example: 4s answer | 100 + (6 × 5) = **130** |
| Wrong / Skipped | 0 |
