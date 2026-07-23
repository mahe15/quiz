const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'quizbattle_default_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Generate JWT token for a user
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address.' });
    }

    // Check if user already exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username.trim(), email.trim().toLowerCase()]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or Email is already taken.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    const user = {
      id: result.insertId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
    };

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user,
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
    }

    const identifier = emailOrUsername.trim();

    // Find user by email or username
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [identifier, identifier.toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const dbUser = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
    };

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
}

/**
 * GET /api/auth/me
 */
async function getMe(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('getMe error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

/**
 * GET /api/auth/profile
 */
async function getProfile(req, res) {
  try {
    const username = req.user.username;

    // User details
    const [users] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Match statistics
    const [matches] = await pool.query(
      'SELECT * FROM matches WHERE player1 = ? OR player2 = ? ORDER BY created_at DESC',
      [username, username]
    );

    let totalMatches = matches.length;
    let wins = 0;
    let totalScore = 0;

    const formattedHistory = matches.map((m) => {
      const isPlayer1 = m.player1 === username;
      const myScore = isPlayer1 ? m.player1_score : m.player2_score;
      const opponentName = isPlayer1 ? m.player2 : m.player1;
      const opponentScore = isPlayer1 ? m.player2_score : m.player1_score;

      totalScore += myScore;

      let result = 'TIE';
      if (m.winner === username) {
        result = 'WIN';
        wins += 1;
      } else if (m.winner && m.winner !== username && m.winner !== 'TIE') {
        result = 'LOSS';
      }

      return {
        id: m.id,
        roomId: m.room_id,
        opponent: opponentName,
        myScore,
        opponentScore,
        result,
        createdAt: m.created_at,
      };
    });

    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    res.json({
      success: true,
      user: users[0],
      stats: {
        totalMatches,
        wins,
        losses: totalMatches - wins,
        winRate: `${winRate}%`,
        totalScore,
      },
      history: formattedHistory,
    });
  } catch (error) {
    console.error('getProfile error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
}

module.exports = {
  register,
  login,
  getMe,
  getProfile,
};
