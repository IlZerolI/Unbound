import { ReactNode, useMemo, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';
import { stations } from '@/data/stations';

const navItems = [
  { path: '/', label: t('nav.home'), icon: HomeIcon },
  { path: '/tram', label: t('nav.tram'), icon: TramIcon },
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

function TramIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 17h16" />
      <path d="M4 17l-1.5 -6h19l-1.5 6" />
      <circle cx="7" cy="17" r="1" />
      <circle cx="17" cy="17" r="1" />
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
  const location = useLocation();
  const selectedStation = useMemo(() => allStations.find(s => s.id === selectedStationId), [allStations, selectedStationId]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    setShowMobileMenu(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowMobileMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowMobileMenu(false);
  }, [location]);

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
          onClick={() => setShowMobileMenu(true)}
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
            const isActive = location.pathname.startsWith(item.path) || (item.path === '/' && location.pathname === '/');
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

      {showMobileMenu && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 200,
            display: 'flex', alignItems: 'flex-end',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setShowMobileMenu(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div
            style={{
              background: 'var(--color-white)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
              width: '100%', maxHeight: '85vh', overflow: 'auto',
              boxShadow: 'var(--shadow-xl)', animation: 'slideUp 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-white)', zIndex: 1 }}>
              <h2 id="mobile-menu-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{t('nav.menu')}</h2>
              <button className="btn btn-ghost" onClick={() => setShowMobileMenu(false)} aria-label={t('common.close')} style={{ minWidth: '44px', minHeight: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav style={{ padding: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path) || (item.path === '/' && location.pathname === '/');
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setShowMobileMenu(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)', background: isActive ? 'var(--color-primary-light)' : 'var(--color-white)',
                      borderRadius: 'var(--radius-lg)', border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      textDecoration: 'none', color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                      transition: 'all 0.2s ease'
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: isActive ? 'var(--color-primary)' : 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'var(--color-white)' : 'var(--color-primary)', flexShrink: 0 }}>
                      <item.icon active={isActive} />
                    </div>
                    <span style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{item.label}</span>
                    {isActive && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 'auto' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--spacing-md)' }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--spacing-md)' }}>{t('stationLink.selectStation')}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {stations.map(station => (
                  <button
                    key={station.id}
                    onClick={() => handleStationSelect(station.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
                      border: `2px solid ${selectedStationId === station.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      boxShadow: selectedStationId === station.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease',
                      width: '100%', textAlign: 'left', cursor: 'pointer'
                    }}
                    aria-current={selectedStationId === station.id ? 'page' : undefined}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: selectedStationId === station.id ? 'var(--color-primary)' : 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedStationId === station.id ? 'var(--color-white)' : 'var(--color-primary)', flexShrink: 0 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>{station.name}</h4>
                      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{station.address}</p>
                    </div>
                    {selectedStationId === station.id && (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}