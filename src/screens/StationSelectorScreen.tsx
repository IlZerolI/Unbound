import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';
import { stations } from '@/data/stations';
import { Link } from 'react-router-dom';

export function StationSelectorScreen() {
  const { selectedStationId, setSelectedStation } = useAppStore();

  return (
    <div className="station-selector-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('stationLink.selectStation')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Odaberite svoju stanicu za personalizovan sadržaj</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {stations.map(station => (
          <Link
            key={station.id}
            to="/"
            onClick={() => { setSelectedStation(station.id); window.location.hash = '#/'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
              padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)',
              border: `2px solid ${selectedStationId === station.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
              boxShadow: selectedStationId === station.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
              textDecoration: 'none', color: 'inherit', transition: 'all 0.2s ease'
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
          </Link>
        ))}
      </div>

      {selectedStationId && (
        <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontWeight: 500 }}>
            {t('stationLink.connected').replace('X', stations.find(s => s.id === selectedStationId)?.name || '')}
          </p>
        </div>
      )}
    </div>
  );
}