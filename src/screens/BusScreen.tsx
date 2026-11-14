import { useEffect, useState } from 'react';
import { useAppStore, useBusStore } from '@/stores';
import { t } from '@/i18n/bs';
import { formatRelativeTime } from '@/utils/helpers';
import { BusArrival, Station } from '@/types';
import { stations, getLineById } from '@/data/stations';
import { haversineDistance } from '@/utils/helpers';

const MAP_SIZE = 300;
const STATION_RADIUS = 8;

interface StationWithSvg extends Station {
  svgX: number;
  svgY: number;
}

function BusIcon({ color, rotation = 0 }: { color: string; rotation?: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
      <path d="M8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8H4V8a2 2 0 0 1 2-2h2V6Z" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
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

function BusMarker({ arrival, lineColor, progress, index }: { arrival: BusArrival; lineColor: string; progress: number; index: number }) {
  const station = stations.find(s => s.id === arrival.stationId);
  if (!station) return null;

  const startLat = arrival.latitude;
  const startLng = arrival.longitude;
  const endLat = station.latitude;
  const endLng = station.longitude;

  // Used for potential future position interpolation
  void (startLat + (endLat - startLat) * progress);
  void (startLng + (endLng - startLng) * progress);

  const angle = Math.atan2(endLng - startLng, endLat - startLat) * 180 / Math.PI;

  return (
    <g key={`${arrival.id}-${index}`} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))">
      <BusIcon color={lineColor} rotation={-angle + 90} />
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

function MapView({ arrivals, selectedStationId, onStationClick }: { arrivals: BusArrival[]; selectedStationId: string | null; onStationClick: (id: string) => void }) {
  const bounds = getMapBounds();
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressMap(prev => {
        const next = { ...prev };
        arrivals.forEach((arrival, i) => {
          const key = `${arrival.id}-${i}`;
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
    <div style={{ width: '100%', maxWidth: `${MAP_SIZE}px`, margin: '0 auto', position: 'relative' }}>
      <svg
        width={MAP_SIZE}
        height={MAP_SIZE}
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        style={{ background: 'var(--color-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}
        role="img"
        aria-label={t('bus.map')}
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
          const progress = progressMap[`${arrival.id}-${i}`] || 0;
          return <BusMarker key={`${arrival.id}-${i}`} arrival={arrival} lineColor={lineColor} progress={progress} index={i} />;
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

function ArrivalsList({ arrivals, selectedStationId }: { arrivals: BusArrival[]; selectedStationId: string | null }) {
  const stationArrivals = arrivals.filter(a => a.stationId === selectedStationId);

  if (stationArrivals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true">
          <path d="M8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8H4V8a2 2 0 0 1 2-2h2V6Z" />
          <circle cx="8" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
        </svg>
        <p>{t('bus.noArrivals')}</p>
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
          <li key={`${arrival.id}-${index}`} style={{
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginTop: '2px' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>
                  {formatRelativeTime(arrival.estimatedTime)}
                </span>
                {isDelayed && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-error)', background: 'var(--color-error-light)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                    {t('bus.delayed')} {arrival.delay} min
                  </span>
                )}
                {!isDelayed && (
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)', background: 'var(--color-success-light)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                    {t('bus.onTime')}
                  </span>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: '80px' }}>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: isDelayed ? 'var(--color-error)' : 'var(--color-primary)' }}>
                {isDelayed ? `+${arrival.delay}'` : formatRelativeTime(arrival.estimatedTime)}
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

export function BusScreen() {
  const { selectedStationId, setSelectedStation, stations: allStations } = useAppStore();
  const { arrivals, subscribeToStation } = useBusStore();
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
        body: `${t('bus.line')} ${selectedStationId}`,
        icon: '/student-stop/icons/icon-192x192.svg',
        badge: '/student-stop/icons/icon-72x72.svg',
        tag: 'bus-arrival'
      });
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(t('app.name'), {
          body: `${t('bus.notifyEnabled')}`,
          icon: '/student-stop/icons/icon-192x192.svg'
        });
      }
    } else {
      setShowNotificationInfo(true);
    }
  };

  return (
    <div className="bus-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('bus.title')}</h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            {selectedStation ? `${selectedStation.name} • ${t('bus.arrivals')}` : t('bus.loading')}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleNotify}
          aria-label={t('bus.notifyMe')}
          style={{ minHeight: 'var(--touch-target)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {t('bus.notifyMe')}
        </button>
      </div>

      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <MapView arrivals={arrivals} selectedStationId={selectedStationId || allStations[0].id} onStationClick={setSelectedStation} />
      </div>

      <h2 className="section-title">{t('bus.arrivals')}</h2>
      <ArrivalsList arrivals={arrivals} selectedStationId={selectedStationId || allStations[0].id} />

      {showNotificationInfo && (
        <div style={{
          position: 'fixed', bottom: `calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))`,
          left: 'var(--spacing-md)', right: 'var(--spacing-md)', maxWidth: '480px', margin: '0 auto',
          background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)', padding: 'var(--spacing-md)', zIndex: 200
        }} role="alert">
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
            {t('bus.notifyInfo')}
          </p>
          <button className="btn btn-primary" onClick={() => setShowNotificationInfo(false)} style={{ width: '100%' }}>
            {t('common.ok')}
          </button>
        </div>
      )}
    </div>
  );
}