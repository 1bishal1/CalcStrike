# CalcStrike — Math Battle Game

> “Solve the equation. Defeat the boss. Claim the throne.”

A modern, responsive, gaming-inspired full-stack web application where players solve mathematical puzzles, duel bosses in real-time battles, climb difficulty levels, and compete on the Hall of Warriors leaderboard.

---

## 🎨 Established Color Palette

- **Dark forest green**: `#15370D`
- **Sage green**: `#728E6D`
- **Golden yellow**: `#E5CD82`
- **Pale cream**: `#FFF2B4`
- **Deep background**: `#0B120A`
- **Card background**: `#172317`

---

## 🏛️ Architecture & Technology Stack

The application strictly adheres to a **Three-Tier Architecture**:

1. **Presentation Layer (Frontend)**:
   - React 19, Vite, React Router 6, pure responsive CSS design system.
   - Fully responsive across desktop and mobile screens.
   - Clean, subtle gradient/solid backgrounds with no distracting fantasy scenery.

2. **Application / Business Layer (Backend)**:
   - Node.js & Express.
   - Dedicated controllers, business logic services, validators, and authentication middleware.
   - Controllers never query the database directly; business logic resides strictly in services.
   - Question evaluation runs on the server; solutions are **never exposed to the browser** before submission.

3. **Data Access Layer (Database & Repositories)**:
   - SQLite via `better-sqlite3` in WAL mode.
   - Session store via `connect-sqlite3` and `express-session`.
   - Dedicated repositories for `UserRepository`, `GameRepository`, and `LeaderboardRepository`.
   - Parameterized SQL queries preventing injection.
   - Password hashing with `bcryptjs` (passwords never stored or returned as plain text).

---

## 🍌 Banana API & Difficulty Strategy

- **Live Banana API**: `https://marcconrad.com/uob/banana/api.php`
- **API Documentation & Strategy**:
  The Marc Conrad Banana API serves dynamic visual puzzle images with single-digit solutions (0–9) without native difficulty parameters. CalcStrike implements a genuine, documented difficulty tier strategy:
  - **Easy**: 40-second timer, 10 points per hit, 25 boss damage, 20 damage penalty to player.
  - **Medium**: 30-second timer, 15 points per hit, 25 boss damage, 25 damage penalty to player.
  - **Difficult**: 20-second timer, 20 points per hit, 25 boss damage, 30 damage penalty to player.
- **Resilient Fallback**: If the external Banana API is offline or experiences network timeouts, the service automatically falls back to procedural curriculum questions (Addition/Subtraction for Easy; Fractions/Percentages/Linear Algebra for Medium; Quadratic equations/Exponents/Roots for Difficult) so gameplay is never blocked.

---

## ⚔️ Game Rules & Mechanics

- **Player HP**: Starts at 100 HP.
- **Boss HP**: Starts at 100 HP.
- **Timer**: 40s (Easy), 30s (Medium), 20s (Difficult).
- **Correct Answer**: Reduces boss HP by 25 and adds score (+10, +15, or +20 pts).
- **Incorrect Answer / Timeout**: Reduces player HP by 20 (Easy/Medium) or 30 (Difficult), and grants the boss 1 point.
- **Boss Defeat**: Boss is defeated when HP reaches 0. Player receives +50 bonus points, recovers **+30 HP** (capped at 100 max HP), and a new boss spawns with 100 HP.
- **Game Over**: Run ends when player HP reaches 0.
- **Quit Game**: Player can pause and end run anytime via confirmation dialog ("Cancel" / "Yes, Quit"). Results are saved to SQLite.
- **Best Score Protection**: A player's recorded best score updates only when the new score exceeds their existing best score.

---

## 🚀 Running the Application

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Start the Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

### 3. Start the Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### 4. Run Automated Tests
```bash
npm test
```

---

## 📋 Available Pages & Routes

- `/` — Intro landing screen with CalcStrike branding and tagline
- `/login` — Login screen with remember me and warrior credentials
- `/signup` — Registration screen with validation
- `/home` — Dashboard with stats (Best Score, Bosses Defeated, Total Games) and navigation sidebar
- `/difficulty` — Difficulty selection (Easy, Medium, Difficult)
- `/game` — Real-time Boss Battle arena (top HUD with avatars, HP bars, circular timer, question card, input box, stop/quit confirmation dialog)
- `/results` — Post-game summary for Victory, Concluded Runs, or Game Over
- `/leaderboard` — Hall of Warriors ranking table with All, Easy, Medium, and Difficult filters and current player highlight

