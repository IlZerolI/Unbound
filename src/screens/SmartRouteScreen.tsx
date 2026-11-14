import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore, useSmartRouteStore } from '@/stores';
import { t } from '@/i18n/bs';
import { Station, Route, Roadwork } from '@/types';
import { haversineDistance, formatDistance, formatDuration } from '@/utils/helpers';

function RouteCard({ route, type }: { route: Route; type: 'walking' | 'cycling' }) {
  const icon = type === 'walking' ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="2" /><circle cx="6" cy="18" r="2" /><path d="M1 18h3.06M7 18H6.06M17.94 18H21M10.94 18H13" /><path d="M18 18V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v11" /></svg>
  );

  return (
    <Link to={`/route/${route.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
        border: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-md)'
      }}>
        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>{route.name}</h4>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{route.description}</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-xs)', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
              {formatDistance(route.distance)} • {formatDuration(route.duration)}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)', background: 'var(--color-success-light)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
              {t('smartRoute.safeRoutes')} {route.safetyScore}%
            </span>
          </div>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: '4px' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}

function RoadworkCard({ work }: { work: Roadwork }) {
  const severityConfig = {
    low: { color: 'var(--color-success)', bg: 'var(--color-success-light)' },
    medium: { color: 'var(--color-warning)', bg: 'var(--color-warning-light)' },
    high: { color: 'var(--color-error)', bg: 'var(--color-error-light)' }
  };
  const config = severityConfig[work.severity];

  return (
    <div style={{
      background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
      border: '1px solid var(--color-border)', display: 'flex', gap: 'var(--spacing-md)'
    }}>
      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.color, flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 2v2M14 2v2M4 7h16M4 13h16M4 19h16" />
          <path d="M12 7v12" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{work.description}</p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          {new Date(work.startDate).toLocaleDateString('bs-BA')} - {work.endDate ? new Date(work.endDate).toLocaleDateString('bs-BA') : t('common.loading')}
        </p>
      </div>
      <span className="badge" style={{ background: config.bg, color: config.color }}>{work.severity}</span>
    </div>
  );
}

function NearbyStationCard({ station, distance }: { station: Station; distance: number | null }) {
  return (
    <div style={{
      background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
      border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)'
    }}>
      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-white)', flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{station.name}</h4>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{station.address}</p>
      </div>
      {distance !== null && (
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{formatDistance(distance)}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{formatDuration(distance / 80)} {t('smartRoute.walking')}</p>
        </div>
      )}
    </div>
  );
}

function SmartBenchCard() {
  const { selectedStationId, stations: allStations } = useAppStore();
  const station = allStations.find(s => s.id === selectedStationId);
  const [heating, setHeating] = useState(false);

  if (!station?.hasSmartBench) {
    return (
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5, margin: '0 auto var(--spacing-sm)' }} aria-hidden="true">
          <path d="M2 16V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
          <path d="M6 16v6M18 16v6" />
        </svg>
        <p style={{ color: 'var(--color-text-muted)' }}>Ova stanica nema pametnu klupu</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>
        {t('smartRoute.smartBench')}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', background: 'var(--color-light)', borderRadius: 'var(--radius-md)' }}>
        <div>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{t('smartRoute.heating')}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{heating ? 'Uključeno' : 'Isključeno'}</p>
        </div>
        <button
          className={`btn ${heating ? 'btn-danger' : 'btn-primary'}`}
          onClick={() => setHeating(!heating)}
          style={{ minHeight: 'var(--touch-target)', minWidth: '100px' }}
        >
          {heating ? t('smartRoute.heaterOff') : t('smartRoute.heaterOn')}
        </button>
      </div>
    </div>
  );
}

function BikeStationCard() {
  const { selectedStationId, stations: allStations } = useAppStore();
  const station = allStations.find(s => s.id === selectedStationId);
  const [occupied, setOccupied] = useState(0);

  if (!station?.hasBikeStation) {
    return (
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5, margin: '0 auto var(--spacing-sm)' }} aria-hidden="true">
          <circle cx="18" cy="18" r="2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M1 18h3.06M7 18H6.06M17.94 18H21M10.94 18H13" />
          <path d="M18 18V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v11" />
        </svg>
        <p style={{ color: 'var(--color-text-muted)' }}>Ova stanica nema bicikl stanicu</p>
      </div>
    );
  }

  const free = station.bikeCapacity - occupied;

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="18" cy="18" r="2" /><circle cx="6" cy="18" r="2" /><path d="M1 18h3.06M7 18H6.06M17.94 18H21M10.94 18H13" /><path d="M18 18V7a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v11" /></svg>
        {t('smartRoute.bikeStation')}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
        <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-success)' }}>{free}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t('smartRoute.freeSpots')}</p>
        </div>
        <div style={{ padding: 'var(--spacing-md)', background: 'var(--color-error-light)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-error)' }}>{occupied}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t('smartRoute.occupiedSpots')}</p>
        </div>
      </div>
      <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', gap: 'var(--spacing-sm)' }}>
        <button className="btn btn-secondary" onClick={() => setOccupied(Math.max(0, occupied - 1))} style={{ flex: 1 }}>-</button>
        <button className="btn btn-secondary" onClick={() => setOccupied(Math.min(station.bikeCapacity, occupied + 1))} style={{ flex: 1 }}>+</button>
      </div>
    </div>
  );
}

export function SmartRouteScreen() {
  const { selectedStationId, stations: allStations } = useAppStore();
  const { routes, roadworks, loadData } = useSmartRouteStore();
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [_, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyStations, setNearbyStations] = useState<Array<{ station: Station; distance: number }>>([]);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setLocationPermission(result.state);
        result.onchange = () => setLocationPermission(result.state);
      });
    } else {
      setLocationPermission('denied');
    }
  }, []);

  const handleLocate = () => {
    if (!('geolocation' in navigator)) {
      setLocationPermission('denied');
      return;
    }
    setCalculating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationPermission('granted');
        const withDistances = allStations.map(s => ({
          station: s,
          distance: haversineDistance(loc.lat, loc.lng, s.latitude, s.longitude)
        })).sort((a, b) => a.distance - b.distance);
        setNearbyStations(withDistances);
        setCalculating(false);
      },
      _err => {
        setLocationPermission('denied');
        setCalculating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const selectedStation = allStations.find(s => s.id === selectedStationId);
  const stationRoutes = routes.filter(r => r.type === 'walking' || r.type === 'cycling');

  return (
    <div className="smart-route-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('smartRoute.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{selectedStation?.name || t('common.loading')}</p>
      </header>

      <section aria-labelledby="nearby-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
          <h2 id="nearby-heading" className="section-title" style={{ marginBottom: 0 }}>{t('smartRoute.nearestStops')}</h2>
          {locationPermission !== 'granted' && (
            <button className="btn btn-primary" onClick={handleLocate} disabled={calculating} style={{ minHeight: 'var(--touch-target)' }}>
              {calculating ? t('smartRoute.calculating') : t('smartRoute.enableLocation')}
            </button>
          )}
        </div>

        {locationPermission === 'denied' && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)', padding: 'var(--spacing-sm)', background: 'var(--color-warning-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning)' }}>
            {t('smartRoute.locationDenied')}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {nearbyStations.length > 0 ? (
            nearbyStations.slice(0, 5).map(({ station, distance }) => (
              <NearbyStationCard key={station.id} station={station} distance={distance} />
            ))
          ) : (
            allStations.slice(0, 5).map(station => (
              <NearbyStationCard key={station.id} station={station} distance={null} />
            ))
          )}
        </div>
      </section>

      <section aria-labelledby="routes-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="routes-heading" className="section-title">{t('smartRoute.safeRoutes')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {stationRoutes.slice(0, 3).map(route => (
            <RouteCard key={route.id} route={route} type={route.type} />
          ))}
        </div>
      </section>

      <section aria-labelledby="roadworks-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="roadworks-heading" className="section-title">{t('smartRoute.roadworks')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          {roadworks.slice(0, 3).map(work => (
            <RoadworkCard key={work.id} work={work} />
          ))}
        </div>
      </section>

      <section aria-labelledby="crowd-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="crowd-heading" className="section-title">{t('smartRoute.crowds')}</h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
          Podaci o gužvama dostupni su u realnom vremenu na mape.
        </p>
      </section>

      <section aria-labelledby="bench-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="bench-heading" className="section-title" style={{ display: 'none' }}>{t('smartRoute.smartBench')}</h2>
        <SmartBenchCard />
      </section>

      <section aria-labelledby="bike-heading">
        <h2 id="bike-heading" className="section-title" style={{ display: 'none' }}>{t('smartRoute.bikeStation')}</h2>
        <BikeStationCard />
      </section>
    </div>
  );
}