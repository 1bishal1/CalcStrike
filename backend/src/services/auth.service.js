import bcrypt from 'bcryptjs';
import userRepository from '../repositories/user.repository.js';

export class AuthService {
  async register(username, email, password) {
    // Check if username exists
    if (userRepository.checkUsernameExists(username)) {
      throw new Error('Username already exists');
    }

    // Check if email exists
    if (userRepository.checkEmailExists(email)) {
      throw new Error('Email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = userRepository.create(username, email, passwordHash);

    return {
      id: userId,
      username,
      email
    };
  }

  async login(username, password) {
    const user = userRepository.findByUsername(username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }

  getUserById(id) {
    const user = userRepository.findById(id);
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }
}

export default new AuthService();
