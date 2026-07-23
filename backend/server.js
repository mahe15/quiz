const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const quizRoutes = require('./routes/quizRoutes');
const authRoutes = require('./routes/authRoutes');
const pool = require('./config/db');
const { socketHandler, waitingQueue } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST'],
  },
});

// Auto-initialize users table if missing
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } catch (err) {
    console.error('Database table check error:', err.message);
  }
}
initDB();

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'],
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', quizRoutes);

// Online player count endpoint
app.get('/api/online', (req, res) => {
  const count = io.engine.clientsCount || 0;
  res.json({ online: count, inQueue: waitingQueue.length });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Serve static frontend in production
const frontendBuild = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuild, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ message: 'Frontend not built yet. Run: cd frontend && npm run build' });
    }
  });
});

// Socket.IO
socketHandler(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║       🎮  QuizBattle Server  🎮       ║
  ║                                      ║
  ║   API:    http://localhost:${PORT}      ║
  ║   Socket: ws://localhost:${PORT}       ║
  ╚══════════════════════════════════════╝
  `);
});
