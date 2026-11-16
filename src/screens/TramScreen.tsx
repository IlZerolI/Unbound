import { useEffect, useState } from 'react';
import { useAppStore, useTramStore } from '@/stores';
import { t } from '@/i18n/bs';
import { formatRelativeTime } from '@/utils/helpers';
import { TramArrival, Station } from '@/types';
import { stations, getLineById } from '@/data/stations';
import { haversineDistance } from '@/utils/helpers';

const MAP_SIZE = 300;
const STATION_RADIUS = 10;

interface StationWithSvg extends Station {
  svgX: number;
  svgY: number;
}

function TramIcon({ color, rotation = 0 }: { color: string; rotation?: number }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(' + rotation + 'deg)' }} aria-hidden="true">
      <path d="M4 17h16" />
      <path d="M4 17l-1.5 -6h19l-1.5 6" />
      <circle cx="7" cy="17" r="1" />
      <circle cx="17" cy="17" r="1" />
    </svg>
  );
}

function StationMarker({ station, isSelected, onClick }: { station: StationWithSvg; isSelected: boolean; onClick: () => void }) {
  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      <circle
        cx={station.svgX}
        cy={station.svgY}
        r={isSelected ? STATION_RADIUS + 4 : STATION_RADIUS}
        fill={isSelected ? 'var(--color-primary)' : 'var(--color-white)'}
        stroke={isSelected ? 'var(--color-primary)' : 'var(--color-border)'}
        strokeWidth={isSelected ? 0 : 2}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
      />
      {isSelected && (
        <circle cx={station.svgX} cy={station.svgY} r={STATION_RADIUS - 2} fill="var(--color-white)" />
      )}
      <text
        x={station.svgX}
        y={station.svgY + 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={isSelected ? 'var(--color-white)' : 'var(--color-text)'}
        fontSize="10"
        fontWeight={isSelected ? '700' : '500'}
        pointerEvents="none"
      >
        {station.name.charAt(0)}
      </text>
    </g>
  );
}

function getMapBounds() {
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
  stations.forEach(s => {
    minLat = Math.min(minLat, s.latitude);
    maxLat = Math.max(maxLat, s.latitude);
    minLng = Math.min(minLng, s.longitude);
    maxLng = Math.max(maxLng, s.longitude);
  });
  const padding = 0.01;
  return { minLat: minLat - padding, maxLat: maxLat + padding, minLng: minLng - padding, maxLng: maxLng + padding };
}

function TramMarker({ arrival, lineColor, progress, index, bounds }: { arrival: TramArrival; lineColor: string; progress: number; index: number; bounds: ReturnType<typeof getMapBounds> }) {
  const station = stations.find(s => s.id === arrival.stationId);
  if (!station) return null;

  const startLat = arrival.latitude;
  const startLng = arrival.longitude;
  const endLat = station.latitude;
  const endLng = station.longitude;

  const currentLat = startLat + (endLat - startLat) * progress;
  const currentLng = startLng + (endLng - startLng) * progress;

  const svgX = ((currentLng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * MAP_SIZE;
  const svgY = MAP_SIZE - ((currentLat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * MAP_SIZE;

  const angle = Math.atan2(endLng - startLng, endLat - startLat) * 180 / Math.PI;

  return (
    <g key={arrival.id + '-' + index} transform={'translate(' + svgX + ', ' + svgY + ')'} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))">
      <TramIcon color={lineColor} rotation={-angle + 90} />
    </g>
  );
}

function StationConnections() {
  const bounds = getMapBounds();
  return (
    <g stroke="var(--color-border)" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5}>
      {stations.slice(0, -1).map((s, i) => {
        const next = stations[i + 1];
        const x1 = ((s.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * MAP_SIZE;
        const y1 = MAP_SIZE - ((s.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * MAP_SIZE;
        const x2 = ((next.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * MAP_SIZE;
        const y2 = MAP_SIZE - ((next.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * MAP_SIZE;
        return <line key={s.id} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </g>
  );
}

function MapView({ arrivals, selectedStationId, onStationClick }: { arrivals: TramArrival[]; selectedStationId: string | null; onStationClick: (id: string) => void }) {
  const bounds = getMapBounds();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressMap(prev => {
        const next = { ...prev };
        arrivals.forEach((arrival, i) => {
          const key = arrival.id + '-' + i;
          const current = next[key] || 0;
          const station = stations.find(s => s.id === arrival.stationId);
          if (!station) return;
          const distance = haversineDistance(arrival.latitude, arrival.longitude, station.latitude, station.longitude);
          const speed = 0.0005 + distance * 0.0001;
          next[key] = Math.min(1, current + speed);
        });
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [arrivals]);

  const stationsWithSvg: StationWithSvg[] = stations.map(station => ({
    ...station,
    svgX: ((station.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * MAP_SIZE,
    svgY: MAP_SIZE - ((station.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * MAP_SIZE
  }));

  return (
    <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto', position: 'relative', aspectRatio: '1 / 1' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={'0 0 ' + MAP_SIZE + ' ' + MAP_SIZE}
        preserveAspectRatio="xMidYMid meet"
        style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', width: '100%', height: '100%' }}
        role="img"
        aria-label={t('tram.map')}
      >
        <StationConnections />
        {stationsWithSvg.map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            isSelected={station.id === selectedStationId}
            onClick={() => onStationClick(station.id)}
          />
        ))}
        {arrivals.map((arrival, i) => {
          const line = getLineById(arrival.lineId);
          const lineColor = line?.color || 'var(--color-primary)';
          const progress = progressMap[arrival.id + '-' + i] || 0;
          return <TramMarker key={arrival.id + '-' + i} arrival={arrival} lineColor={lineColor} progress={progress} index={i} bounds={bounds} />;
        })}
      </svg>
      <div style={{ position: 'absolute', bottom: 'var(--spacing-sm)', left: 'var(--spacing-sm)', right: 'var(--spacing-sm)', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
        {stations.map(s => (
          <span key={s.id} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: s.id === selectedStationId ? 'var(--color-primary)' : 'var(--color-border)',
            transition: 'background 0.2s ease'
          }} />
        ))}
      </div>
    </div>
  );
}

function OccupancyBadge({ occupancy }: { occupancy: 'empty' | 'half' | 'full' }) {
const configs = {
    empty: { label: t('tram.occupancy.empty'), desc: t('tram.occupancy.emptyDesc'), color: 'var(--color-success)', bg: 'var(--color-success-light)', icon: '\u{1F7E2}' },
    half: { label: t('tram.occupancy.half'), desc: t('tram.occupancy.halfDesc'), color: 'var(--color-warning)', bg: 'var(--color-warning-light)', icon: '\u{1F7E1}' },
    full: { label: t('tram.occupancy.full'), desc: t('tram.occupancy.fullDesc'), color: 'var(--color-error)', bg: 'var(--color-error-light)', icon: '\u{1F534}' }
  };
  const cfg = configs[occupancy];
  return (
    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: cfg.color, background: cfg.bg, padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '4px' }} title={cfg.desc}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function EcoCalculator() {
  const [distance, setDistance] = useState(5);
  const [tripsPerWeek, setTripsPerWeek] = useState(10);
  const [results, setResults] = useState<{ weekly: number; monthly: number; yearly: number; trees: number } | null>(null);

  const calculate = () => {
    const carEmissionPerKm = 120;
    const tramEmissionPerKm = 5;
    const savingsPerKm = carEmissionPerKm - tramEmissionPerKm;
    const weeklyKm = distance * 2 * tripsPerWeek;
    const weekly = weeklyKm * savingsPerKm;
    const monthly = weekly * 4.33;
    const yearly = weekly * 52;
    const trees = yearly / 22000;
    setResults({ weekly, monthly, yearly, trees });
  };

  useEffect(() => {
    calculate();
  }, [distance, tripsPerWeek]);

  if (!results) return null;

  return (
    <section style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-xl)', borderTop: '1px solid var(--color-border)' }}>
      <h2 className="section-title">{t('energy.calculator.title')}</h2>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>
        {t('energy.calculator.subtitle')}
      </p>

      <div className="card" style={{ padding: 'var(--spacing-md)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
          <div>
            <label className="label">{t('energy.calculator.distanceLabel')}</label>
            <input
              type="number"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="input"
              style={{ maxWidth: '120px' }}
            />
          </div>
          <div>
            <label className="label">{t('energy.calculator.tripsPerWeek')}</label>
            <input
              type="number"
              min="1"
              max="30"
              value={tripsPerWeek}
              onChange={(e) => setTripsPerWeek(Number(e.target.value))}
              className="input"
              style={{ maxWidth: '120px' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'var(--color-light)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t('energy.calculator.weekly')}</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)' }}>{(results.weekly / 1000).toFixed(1)} kg CO₂</p>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'var(--color-light)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t('energy.calculator.monthly')}</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)' }}>{(results.monthly / 1000).toFixed(1)} kg CO₂</p>
          </div>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'var(--color-light)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{t('energy.calculator.yearly')}</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-success)' }}>{(results.yearly / 1000).toFixed(1)} kg CO₂</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--color-success-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontWeight: 600 }}>
              {t('energy.calculator.treesEquivalent')}: <strong>{results.trees.toFixed(1)}</strong> {t('energy.calculator.tip')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrivalsList({ arrivals, selectedStationId }: { arrivals: TramArrival[]; selectedStationId: string | null }) {
  const stationArrivals = arrivals.filter(a => a.stationId === selectedStationId);

  if (stationArrivals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true">
          <path d="M4 17h16" />
          <path d="M4 17l-1.5 -6h19l-1.5 6" />
          <circle cx="7" cy="17" r="1" />
          <circle cx="17" cy="17" r="1" />
        </svg>
        <p>{t('tram.noArrivals')}</p>
      </div>
    );
  }

  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {stationArrivals.map((arrival, index) => {
        const line = getLineById(arrival.lineId);
        const lineColor = line?.color || 'var(--color-primary)';
        const isDelayed = arrival.delay > 0;

        return (
          <li key={arrival.id + '-' + index} style={{
            display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: lineColor, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-text)' }}>
                  Linija {arrival.lineId.replace('line-', '')}
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{arrival.destination}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginTop: '2px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                  {formatRelativeTime(arrival.estimatedTime)}
                </span>
                <OccupancyBadge occupancy={arrival.occupancy} />
                {isDelayed && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-error)', background: 'var(--color-error-light)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                    {t('tram.delayed')} {arrival.delay} min
                  </span>
                )}
                {!isDelayed && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)', background: 'var(--color-success-light)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                    {t('tram.onTime')}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '80px' }}>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: isDelayed ? 'var(--color-error)' : 'var(--color-primary)' }}>
                {isDelayed ? '+' + arrival.delay + "'" : formatRelativeTime(arrival.estimatedTime)}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {arrival.vehicleId}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function TramScreen() {
  const { selectedStationId, setSelectedStation, stations: allStations } = useAppStore();
  const { arrivals, subscribeToStation } = useTramStore();
  const selectedStation = allStations.find(s => s.id === selectedStationId || allStations[0].id);
  const [showNotificationInfo, setShowNotificationInfo] = useState(false);

  useEffect(() => {
    const unsub = subscribeToStation(selectedStationId || allStations[0].id);
    return () => unsub();
  }, [selectedStationId]);

  const handleNotify = async () => {
    if (!('Notification' in window)) {
      setShowNotificationInfo(true);
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(t('app.name'), {
        body: t('tram.line') + ' ' + selectedStationId,
        icon: '/Unbound/icons/icon-192x192.svg',
        badge: '/Unbound/icons/icon-72x72.svg',
        tag: 'tram-arrival'
      });
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(t('app.name'), {
          body: t('tram.notifyEnabled'),
          icon: '/Unbound/icons/icon-192x192.svg'
        });
      }
    } else {
      setShowNotificationInfo(true);
    }
  };

  return (
    <div className="tram-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('tram.title')}</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {selectedStation ? selectedStation.name + ' \u2022 ' + t('tram.arrivals') : t('tram.loading')}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleNotify}
          aria-label={t('tram.notifyMe')}
          style={{ minHeight: 'var(--touch-target)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {t('tram.notifyMe')}
        </button>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <MapView arrivals={arrivals} selectedStationId={selectedStationId || allStations[0].id} onStationClick={setSelectedStation} />
      </div>

      <h2 className="section-title">{t('tram.arrivals')}</h2>
      <ArrivalsList arrivals={arrivals} selectedStationId={selectedStationId || allStations[0].id} />

      <EcoCalculator />

      {showNotificationInfo && (
        <div style={{
          position: 'fixed', bottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))',
          left: 'var(--spacing-md)', right: 'var(--spacing-md)', maxWidth: '480px', margin: '0 auto',
          background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)', padding: 'var(--spacing-md)', zIndex: 200
        }} role="alert">
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
            {t('tram.notifyInfo')}
          </p>
          <button className="btn btn-primary" onClick={() => setShowNotificationInfo(false)} style={{ width: '100%' }}>
            {t('common.ok')}
          </button>
        </div>
      )}
    </div>
  );
}