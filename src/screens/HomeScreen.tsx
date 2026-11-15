import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore, useTramStore, useEnergyStore } from '@/stores';
import { stations } from '@/data/stations';
import { t } from '@/i18n/bs';
import { formatRelativeTime } from '@/utils/helpers';

const tileLinks = [
  { path: '/safe-stop', title: t('home.tiles.safety.title'), description: t('home.tiles.safety.description'), icon: SafetyIcon },
  { path: '/energy', title: t('home.tiles.energy.title'), description: t('home.tiles.energy.description'), icon: EnergyIcon },
  { path: '/smart-route', title: t('home.tiles.smartRoute.title'), description: t('home.tiles.smartRoute.description'), icon: RouteIcon },
  { path: '/report', title: t('home.tiles.report.title'), description: t('home.tiles.report.description'), icon: ReportIcon },
  { path: '/student-voice', title: t('home.tiles.studentVoice.title'), description: t('home.tiles.studentVoice.description'), icon: VoiceIcon },
  { path: '/challenge', title: t('home.tiles.challenge.title'), description: t('home.tiles.challenge.description'), icon: ChallengeIcon }
];

function SafetyIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>;
}
function EnergyIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;
}
function RouteIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
}
function ReportIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12.01" y2="18" /><line x1="12" y1="12" x2="12.01" y2="12" /><line x1="12" y1="6" x2="12.01" y2="6" /></svg>;
}
function VoiceIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function ChallengeIcon() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>;
}

function StationCard({ station, onChange }: { station: typeof stations[0] | null; onChange: (stationId?: string) => void }) {
  const nextTram = useTramStore(state => state.arrivals[0]);
  const energy = useEnergyStore(state => state.currentData);

  if (!station) {
    return (
      <Link to="/select-station" className="station-card-empty" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--spacing-xl)', textAlign: 'center', background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)', border: '2px dashed var(--color-border)',
        minHeight: '160px', color: 'var(--color-text-muted)', textDecoration: 'none'
      }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p style={{ fontSize: 'var(--text-base)', fontWeight: 500, marginBottom: 'var(--spacing-xs)' }}>{t('home.myStation')}</p>
        <p style={{ fontSize: 'var(--text-sm)' }}>{t('home.changeStation')}</p>
      </Link>
    );
  }

  return (
    <div className="station-card" style={{
      background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: 'var(--spacing-md)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-md)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>{station.name}</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{station.address}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => onChange()} aria-label={t('home.changeStation')} style={{ minWidth: '44px', minHeight: '44px', padding: 'var(--spacing-xs)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-sm)', padding: '0 var(--spacing-md) var(--spacing-md)' }}>
        <div style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{t('home.nextTram')}</p>
            {nextTram ? (
              <>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>Linija {nextTram.lineId.replace('line-', '')}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>{nextTram.destination}</p>
              </>
            ) : (
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-muted)' }}>{t('tram.noArrivals')}</p>
            )}
          </div>
          {nextTram && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'var(--spacing-xs)', borderTop: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: nextTram.delay > 0 ? 'var(--color-error)' : 'var(--color-success)' }}>
                {nextTram.delay > 0 ? t('home.delayed').replace('X', String(nextTram.delay)) : t('home.now')}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{formatRelativeTime(nextTram.estimatedTime)}</span>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-sm)', minHeight: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{t('energy.battery')}</p>
            {energy ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  <div style={{ width: '60px', height: '10px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ width: `${energy.batteryLevel}%`, height: '100%', background: energy.batteryLevel > 50 ? 'var(--color-success)' : energy.batteryLevel > 20 ? 'var(--color-warning)' : 'var(--color-error)', borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
                  </div>
                  <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)' }}>{energy.batteryLevel}%</span>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px', textTransform: 'capitalize' }}>{energy.batteryStatus === 'charging' ? t('energy.charging') : energy.batteryStatus === 'discharging' ? t('energy.discharging') : t('energy.stable')}</p>
              </>
            ) : (
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text-muted)' }}>{t('common.loading')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeScreen() {
  const selectedStationId = useAppStore(state => state.selectedStationId);
  const setSelectedStation = useAppStore(state => state.setSelectedStation);
  const getStationById = useAppStore(state => state.getStationById);
  const allStations = useAppStore(state => state.stations);
  const selectedStation = selectedStationId ? getStationById(selectedStationId) ?? null : null;
  const navigate = useNavigate();
  const [showStationMenu, setShowStationMenu] = useState(false);

  useEffect(() => {
    const unsubTram = useTramStore.getState().subscribeToStation(selectedStationId || allStations[0].id);
    const unsubEnergy = useEnergyStore.getState().subscribe();
    return () => {
      unsubTram();
      unsubEnergy();
    };
  }, [selectedStationId]);

  const handleStationSelect = (stationId: string) => {
    setSelectedStation(stationId);
    navigate(`/?station=${stationId}`);
    setShowStationMenu(false);
  };

  return (
    <div className="home-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-title" style={{ margin: 0 }}>{t('home.myStation')}</h2>
        <button
          className="btn btn-ghost"
          onClick={() => setShowStationMenu(true)}
          aria-label={t('home.changeStation')}
          style={{ minWidth: '44px', minHeight: '44px', padding: 'var(--spacing-xs)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </header>

      <section style={{ marginBottom: 'var(--spacing-lg)' }}>
        <StationCard station={selectedStation} onChange={(stationId) => handleStationSelect(stationId || '')} />
      </section>

      <section style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>{t('home.quickActions')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--spacing-md)' }}>
          {tileLinks.map((tile) => (
            <Link key={tile.path} to={tile.path} className="tile-card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)',
              textDecoration: 'none', color: 'inherit', minHeight: '120px', justifyContent: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }} onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }} onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <tile.icon />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>{tile.title}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{tile.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>{t('home.announcements')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
                <path d="M12 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>Radovi na pruzi linije 3</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>U periodu 15.-30.11. moguća kašnjenja do 10 min na stajalištima Zmaja od Bosne i Maršal Tito.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="qr-heading">
        <h2 id="qr-heading" className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>{t('qr.title')}</h2>
        <Link to="/qr" className="tile-card" style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
          padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)',
          textDecoration: 'none', color: 'inherit'
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>{t('qr.title')}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('qr.scanText')}</p>
          </div>
        </Link>
      </section>

      {showStationMenu && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end', padding: 'var(--spacing-md)',
          animation: 'fadeIn 0.2s ease'
        }} onClick={() => setShowStationMenu(false)} role="dialog" aria-modal="true" aria-labelledby="station-menu-title">
          <div style={{
            background: 'var(--color-white)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
            width: '100%', maxHeight: '80vh', overflow: 'auto',
            boxShadow: 'var(--shadow-xl)', animation: 'slideUp 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, background: 'var(--color-white)', zIndex: 1 }}>
              <h2 id="station-menu-title" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>{t('stationLink.selectStation')}</h2>
              <button className="btn btn-ghost" onClick={() => setShowStationMenu(false)} aria-label={t('common.close')} style={{ minWidth: '44px', minHeight: '44px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={{ padding: 'var(--spacing-md)' }}>
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
                    width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 'var(--spacing-sm)'
                  }}
                  aria-current={selectedStationId === station.id ? 'page' : undefined}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: selectedStationId === station.id ? 'var(--color-primary)' : 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedStationId === station.id ? 'var(--color-white)' : 'var(--color-primary)', flexShrink: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>{station.name}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{station.address}</p>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
                      {station.hasSmartBench && (
                        <span className="badge badge-info" style={{ fontSize: 'var(--text-xs)' }}>🔥 Pametna klupa</span>
                      )}
                      {station.hasBikeStation && (
                        <span className="badge badge-info" style={{ fontSize: 'var(--text-xs)' }}>🚲 Bicikl stajalište ({station.bikeCapacity})</span>
                      )}
                    </div>
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
      )}
    </div>
  );
}