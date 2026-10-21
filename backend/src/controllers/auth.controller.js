import authService from '../services/auth.service.js';

export class AuthController {
  async signup(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await authService.register(username, email, password);
      req.session.userId = user.id;
      req.session.username = user.username;
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res, next) {
    try {
      const { username, password, rememberMe } = req.body;
      const user = await authService.login(username, password);
      req.session.userId = user.id;
      req.session.username = user.username;

      // If user checked "Remember me", extend session cookie duration
      if (rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      }

      res.json({ user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  }

  async me(req, res, next) {
    try {
      if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      const user = authService.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();
