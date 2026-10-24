import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../database/calcstrike.sqlite');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      boss_defeated INTEGER DEFAULT 0,
      correct_answers INTEGER DEFAULT 0,
      incorrect_answers INTEGER DEFAULT 0,
      total_answers INTEGER DEFAULT 0,
      player_health INTEGER DEFAULT 100,
      boss_health INTEGER DEFAULT 100,
      boss_level INTEGER DEFAULT 1,
      boss_score INTEGER DEFAULT 0,
      current_answer TEXT,
      current_question TEXT,
      completed INTEGER DEFAULT 0,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS boss_defeats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      boss_level INTEGER NOT NULL,
      defeated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      best_score INTEGER DEFAULT 0,
      total_score INTEGER DEFAULT 0,
      total_bosses_defeated INTEGER DEFAULT 0,
      total_correct_answers INTEGER DEFAULT 0,
      total_answers INTEGER DEFAULT 0,
      total_games INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Safe migrations for existing databases
  const sessionCols = db.pragma('table_info(game_sessions)').map(c => c.name);
  if (!sessionCols.includes('player_health')) db.exec('ALTER TABLE game_sessions ADD COLUMN player_health INTEGER DEFAULT 100');
  if (!sessionCols.includes('boss_health')) db.exec('ALTER TABLE game_sessions ADD COLUMN boss_health INTEGER DEFAULT 100');
  if (!sessionCols.includes('boss_level')) db.exec('ALTER TABLE game_sessions ADD COLUMN boss_level INTEGER DEFAULT 1');
  if (!sessionCols.includes('boss_score')) db.exec('ALTER TABLE game_sessions ADD COLUMN boss_score INTEGER DEFAULT 0');
  if (!sessionCols.includes('incorrect_answers')) db.exec('ALTER TABLE game_sessions ADD COLUMN incorrect_answers INTEGER DEFAULT 0');
  if (!sessionCols.includes('current_answer')) db.exec('ALTER TABLE game_sessions ADD COLUMN current_answer TEXT');
  if (!sessionCols.includes('current_question')) db.exec('ALTER TABLE game_sessions ADD COLUMN current_question TEXT');

  const statsCols = db.pragma('table_info(user_stats)').map(c => c.name);
  if (!statsCols.includes('best_score')) db.exec('ALTER TABLE user_stats ADD COLUMN best_score INTEGER DEFAULT 0');
  if (!statsCols.includes('total_games')) db.exec('ALTER TABLE user_stats ADD COLUMN total_games INTEGER DEFAULT 0');

  console.log('Database initialized and migrated');
}

export default db;
