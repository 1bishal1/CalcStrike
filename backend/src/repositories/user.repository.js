import db from '../config/database.js';

export class UserRepository {
  create(username, email, passwordHash) {
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email, passwordHash);
    return result.lastInsertRowid;
  }

  findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
  }

  findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  checkUsernameExists(username) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE username = ?');
    const result = stmt.get(username);
    return result.count > 0;
  }

  checkEmailExists(email) {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?');
    const result = stmt.get(email);
    return result.count > 0;
  }
}

export default new UserRepository();
