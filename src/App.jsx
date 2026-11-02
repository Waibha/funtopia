import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LeaderboardPage from './pages/public/LeaderboardPage';
import SchedulePage from './pages/public/SchedulePage';
import RulesPage from './pages/public/RulesPage';

// Guess Who Module Pages (Person 2 Scope)
import GuessWhoHubPage from './pages/guess-who/GuessWhoHubPage';
import GuessWhoLobbyPage from './pages/guess-who/GuessWhoLobbyPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminParticipantsPage from './pages/admin/AdminParticipantsPage';
import AdminGuessWhoPage from './pages/admin/AdminGuessWhoPage';
import AdminScoresPage from './pages/admin/AdminScoresPage';

// 404
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dedicated Clean Public Projector Interface (No Website Navbar/Footer) */}
        <Route path="/guess-who" element={<GuessWhoHubPage />} />

        {/* Public & Player Portal (Wrapped in MainLayout with Navbar & Cosmic BG) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/rules" element={<RulesPage />} />

          {/* Staging / Fallback Lobby Route */}
          <Route path="/guess-who/lobby" element={<GuessWhoLobbyPage />} />

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Portal (Wrapped in Mission Control AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="participants" element={<AdminParticipantsPage />} />
          <Route path="guess-who" element={<AdminGuessWhoPage />} />
          <Route path="scores" element={<AdminScoresPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
