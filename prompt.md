Recommended Stack
Component	Technology
Frontend	React + Vite
Styling	Tailwind CSS
Animation	Framer Motion
Backend	Node.js + Express
Realtime	Socket.IO
Database	MySQL
Database Driver	mysql2
HTTP Client	Axios
Deployment	AWS EC2 (Ubuntu)
Web Server	Nginx
Process Manager	PM2


No Redis.
No Prisma.
No Authentication.
No JWT.

This keeps deployment much easier.

Project Structure
QuizBattle/

│
├── frontend/
│
├── backend/
│
└── database/
Frontend
frontend/

src/

components/

Navbar
Hero
GameCard
QuestionCard
OptionButton
Timer
ProgressBar
PlayerCard
ScoreBoard
Loading
ResultCard
Footer

pages/

Home
Matchmaking
Game
Result

hooks/

useSocket.js
useTimer.js

services/

api.js
socket.js

App.jsx
main.jsx
Backend
backend/

controllers/

gameController.js
quizController.js

routes/

quizRoutes.js

socket/

socketHandler.js

config/

db.js

utils/

calculateScore.js
shuffleQuestions.js

server.js
Database
database/

schema.sql

questions.sql
MySQL Tables
questions
id

question

option_a

option_b

option_c

option_d

correct_answer
matches
id

room_id

winner

created_at
answers
id

match_id

player

question_id

selected_option

correct

time_taken
Game Flow
Home

↓

Play Now

↓

Searching...

↓

Opponent Found

↓

3

2

1

GO

↓

Question 1

↓

Question 2

↓

...

↓

Question 10

↓

Result

↓

Play Again
Matchmaking

Player clicks

Play Now

↓

Socket connects

↓

Player joins queue

↓

Server waits

↓

Second player joins

↓

Create Room

↓

Start Game

Gameplay

Each question

10 Seconds

Maximum

10 Questions

100 Seconds

When timer reaches

0

Automatically move next question.

Score Calculation

Correct Answer

100 Points

Speed Bonus

Remaining Time × 5

Example

Answered in

4 sec

Remaining

6 sec

Score

100 + 30 = 130

Wrong

0

Skipped

0

Winner

Highest score.

Home Page UI

A modern landing page with:

Dark blue/purple gradient background
Large "Quiz Battle" title
Animated "Play Now" button
Online player count
"How to Play" section
Feature cards (1v1, Real-time, Fast-paced)
Responsive layout
Matchmaking UI
Circular searching animation
"Finding an opponent..."
Elapsed wait time
Cancel button
Smooth loading effects
Game UI

Top bar:

Your score
Opponent score
Question number (e.g. 3/10)

Center:

Large question card
Four large answer buttons

Bottom:

Circular countdown timer
Progress bar

Visual feedback:

Correct answer: green glow
Wrong answer: red shake
Button hover animations
Result Screen

Display:

Winner/Loser banner
Final scores
Correct answers
Wrong answers
Accuracy percentage
Average response time
"Play Again" button
"Home" button
Confetti animation if winner
API Routes
GET    /api/questions

GET    /api/online

GET    /api/match/:id
Socket Events

Client emits:

joinQueue
submitAnswer

Server emits:

matchFound
startGame
nextQuestion
scoreUpdate
gameOver
AWS Deployment (Simple)

Deploy everything on one Ubuntu EC2 instance:

Internet
     │
     ▼
Nginx (Port 80)
     │
 ┌───┴─────────┐
 │             │
 ▼             ▼
React      Node.js + Socket.IO
(static)      (PM2)
               │
               ▼
            MySQL

This is simple to understand and deploy:

Nginx serves the React build.
Nginx proxies /api and Socket.IO traffic to your Node.js server.
PM2 keeps the backend running.
MySQL runs on the same EC2 instance.
Folder Structure
QuizBattle/

frontend/

backend/

database/

README.md

"write a docker file also"
