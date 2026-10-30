import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import DifficultyPage from './pages/DifficultyPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';
import './styles/auth.css';
import './styles/game.css';
import './styles/leaderboard.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/difficulty" element={<ProtectedRoute><DifficultyPage /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
