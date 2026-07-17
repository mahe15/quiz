-- =============================================
-- QuizBattle Seed Questions
-- 30 General Knowledge Questions
-- =============================================

USE quizbattle;

INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES

-- Science
('What is the chemical symbol for gold?', 'Go', 'Au', 'Ag', 'Gd', 'B'),
('Which planet is known as the Red Planet?', 'Venus', 'Jupiter', 'Mars', 'Saturn', 'C'),
('What is the hardest natural substance on Earth?', 'Platinum', 'Iron', 'Diamond', 'Titanium', 'C'),
('How many bones are in the adult human body?', '186', '206', '226', '256', 'B'),
('What gas do plants absorb from the atmosphere?', 'Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen', 'C'),

-- Geography
('What is the largest ocean on Earth?', 'Atlantic', 'Indian', 'Arctic', 'Pacific', 'D'),
('Which country has the most natural lakes?', 'USA', 'Canada', 'Russia', 'Brazil', 'B'),
('What is the smallest country in the world?', 'Monaco', 'Vatican City', 'San Marino', 'Liechtenstein', 'B'),
('Which desert is the largest in the world?', 'Sahara', 'Arabian', 'Gobi', 'Antarctic', 'D'),
('What is the longest river in the world?', 'Amazon', 'Nile', 'Mississippi', 'Yangtze', 'B'),

-- History
('In which year did World War II end?', '1943', '1944', '1945', '1946', 'C'),
('Who was the first person to walk on the Moon?', 'Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn', 'B'),
('Which ancient civilization built the pyramids of Giza?', 'Roman', 'Greek', 'Egyptian', 'Mesopotamian', 'C'),
('The Berlin Wall fell in which year?', '1987', '1988', '1989', '1990', 'C'),
('Who painted the Mona Lisa?', 'Michelangelo', 'Raphael', 'Donatello', 'Leonardo da Vinci', 'D'),

-- Technology
('Who founded Microsoft?', 'Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Jeff Bezos', 'B'),
('What does CPU stand for?', 'Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'B'),
('In what year was the first iPhone released?', '2005', '2006', '2007', '2008', 'C'),
('What programming language is known as the language of the web?', 'Python', 'Java', 'C++', 'JavaScript', 'D'),
('What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language', 'A'),

-- Entertainment
('Which movie won the first-ever Academy Award for Best Picture?', 'Sunrise', 'Wings', 'The Jazz Singer', 'Ben-Hur', 'B'),
('How many Harry Potter books are there?', '5', '6', '7', '8', 'C'),
('What is the highest-grossing film of all time (unadjusted)?', 'Avengers: Endgame', 'Avatar', 'Titanic', 'Star Wars', 'B'),
('Which band released the album "Abbey Road"?', 'The Rolling Stones', 'The Beatles', 'Led Zeppelin', 'Pink Floyd', 'B'),
('In the game of chess, which piece can only move diagonally?', 'Rook', 'Knight', 'Bishop', 'Queen', 'C'),

-- Sports
('How many players are on a standard soccer team on the field?', '9', '10', '11', '12', 'C'),
('Which country has won the most FIFA World Cups?', 'Germany', 'Argentina', 'Italy', 'Brazil', 'D'),
('In which sport is the term "love" used to mean zero?', 'Badminton', 'Cricket', 'Tennis', 'Table Tennis', 'C'),
('What is the diameter of a basketball hoop in inches?', '16', '18', '20', '22', 'B'),
('Which Olympic Games were the first to be televised?', '1928', '1936', '1948', '1952', 'B');
