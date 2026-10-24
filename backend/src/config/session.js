import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQLiteStoreSession = SQLiteStore(session);

const sessionStore = new SQLiteStoreSession({
  db: 'sessions.sqlite',
  dir: path.join(__dirname, '../../database/'),
  table: 'sessions'
});

export const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'calcstrike-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

export default session;
