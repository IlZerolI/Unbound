import { ReactNode, useMemo } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';

const navItems = [
  { path: '/', label: t('nav.home'), icon: HomeIcon },
  { path: '/bus', label: t('nav.bus'), icon: BusIcon },
  { path: '/energy', label: t('nav.energy'), icon: EnergyIcon },
  { path: '/more', label: t('nav.more'), icon: MoreIcon }
] as const;

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function BusIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8H4V8a2 2 0 0 1 2-2h2V6Z" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
      <line x1="4" y1="14" x2="20" y2="14" />
    </svg>
  );
}

function EnergyIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

function MoreIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { selectedStationId, setSelectedStation, stations: allStations } = useAppStore();
  const selectedStation = useMemo(() => allStations.find(s => s.id === selectedStationId), [allStations, selectedStationId]);

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
  };

  return (
    <div className="app-layout" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <header className="app-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        paddingTop: 'calc(var(--safe-area-top) + var(--spacing-sm))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flex: 1 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div>
            <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>
              {t('app.name')}
            </h1>
            {selectedStation && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {selectedStation.name}
              </p>
            )}
          </div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={() => handleStationSelect('')}
          aria-label={t('accessibility.openMenu')}
          style={{ minWidth: '44px', minHeight: '44px', padding: 'var(--spacing-xs)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      <main className="app-main" style={{ flex: 1, overflow: 'auto', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom))' }}>
        {children || <Outlet />}
      </main>

      <nav className="app-nav" role="navigation" aria-label={t('accessibility.openMenu')} style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'var(--color-white)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'var(--safe-area-bottom)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '480px', margin: '0 auto' }}>
          {navItems.map((item) => {
            const isActive = window.location.hash.startsWith(`#${item.path}`) || (item.path === '/' && window.location.hash === '#/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: active }) => `nav-item ${active ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  minWidth: 'var(--touch-target)',
                  minHeight: 'var(--touch-target)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  borderRadius: 'var(--radius-sm)'
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon active={isActive} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}