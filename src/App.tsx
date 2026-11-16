import { HashRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore, initializeApp } from '@/stores';
import { t } from '@/i18n/bs';
import { Layout } from '@/components/Layout';
import { HomeScreen } from '@/screens/HomeScreen';
import { TramScreen } from '@/screens/TramScreen';
import { EnergyScreen } from '@/screens/EnergyScreen';
import { SafeStopScreen } from '@/screens/SafeStopScreen';
import { ReportScreen } from '@/screens/ReportScreen';
import { SmartRouteScreen } from '@/screens/SmartRouteScreen';
import { StudentVoiceScreen } from '@/screens/StudentVoiceScreen';
import { ChallengeScreen } from '@/screens/ChallengeScreen';
import { QRScreen } from '@/screens/QRScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { StationSelectorScreen } from '@/screens/StationSelectorScreen';
import { MoreScreen } from '@/screens/MoreScreen';
import { TeamScreen } from '@/screens/TeamScreen';

function AppContent() {
  const { hasHydrated, selectedStationId, userPreferences } = useAppStore();

  const theme = userPreferences.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : userPreferences.theme;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stationParam = params.get('station');
    if (stationParam && !selectedStationId) {
      const station = useAppStore.getState().getStationById(stationParam);
      if (station) {
        useAppStore.getState().setSelectedStation(stationParam);
        setTimeout(() => {
          alert(t('stationLink.connected').replace('X', station.name));
        }, 500);
      } else {
        alert(t('stationLink.invalid'));
      }
    }
    initializeApp();
  }, [selectedStationId]);

  if (!hasHydrated) {
    return (
      <div className="app-loading" role="status" aria-label={t('common.loading')}>
        <div className="spinner" />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/tram" element={<TramScreen />} />
          <Route path="/energy" element={<EnergyScreen />} />
          <Route path="/safe-stop" element={<SafeStopScreen />} />
          <Route path="/report" element={<ReportScreen />} />
          <Route path="/smart-route" element={<SmartRouteScreen />} />
          <Route path="/student-voice" element={<StudentVoiceScreen />} />
          <Route path="/challenge" element={<ChallengeScreen />} />
          <Route path="/qr" element={<QRScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/select-station" element={<StationSelectorScreen />} />
          <Route path="/more" element={<MoreScreen />} />
          <Route path="/team" element={<TeamScreen />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export function App() {
  return <AppContent />;
}