import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { NotificationProvider } from './context/NotificationContext.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ToastContainer } from './components/ToastContainer.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { ReportPage } from './pages/ReportPage.js';
import { CitizenDashboard } from './pages/CitizenDashboard.js';
import { CollectorDashboard } from './pages/CollectorDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { HotspotsPage } from './pages/HotspotsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { RewardsPage } from './pages/RewardsPage.js';
import { ImpactPage } from './pages/ImpactPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { LegalPage } from './pages/LegalPage.js';

function MainApp() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Sync with window.location.hash for direct links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setCurrentPage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string) => {
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'report':
        return <ReportPage navigate={navigate} />;
      case 'dashboard':
        return <CitizenDashboard navigate={navigate} />;
      case 'collector':
        return <CollectorDashboard navigate={navigate} />;
      case 'admin':
        return <AdminDashboard navigate={navigate} />;
      case 'hotspots':
        return <HotspotsPage navigate={navigate} />;
      case 'leaderboard':
        return <LeaderboardPage navigate={navigate} />;
      case 'rewards':
        return <RewardsPage navigate={navigate} />;
      case 'impact':
        return <ImpactPage navigate={navigate} />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} />;
      case 'register':
        return <RegisterPage navigate={navigate} />;
      case 'privacy':
        return <LegalPage initialTab="privacy" navigate={navigate} />;
      case 'terms':
        return <LegalPage initialTab="terms" navigate={navigate} />;
      case 'legal':
        return <LegalPage initialTab="privacy" navigate={navigate} />;
      case 'home':
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentPage={currentPage} navigate={navigate} />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer navigate={navigate} />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
}
