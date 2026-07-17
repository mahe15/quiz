-- =============================================
-- QuizBattle Database Schema
-- =============================================

CREATE DATABASE IF NOT EXISTS quizbattle;
USE quizbattle;

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id VARCHAR(100) NOT NULL UNIQUE,
    player1 VARCHAR(100) NOT NULL,
    player2 VARCHAR(100) NOT NULL,
    player1_score INT DEFAULT 0,
    player2_score INT DEFAULT 0,
    winner VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    match_id INT NOT NULL,
    player VARCHAR(100) NOT NULL,
    question_id INT NOT NULL,
    selected_option ENUM('A', 'B', 'C', 'D') DEFAULT NULL,
    correct BOOLEAN DEFAULT FALSE,
    time_taken FLOAT DEFAULT 10.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for performance
CREATE INDEX idx_matches_room ON matches(room_id);
CREATE INDEX idx_answers_match ON answers(match_id);
CREATE INDEX idx_answers_player ON answers(player);
