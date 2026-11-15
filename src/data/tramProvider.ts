import { TramProvider, TramArrival } from '@/types';
import { tramLines, stations } from './stations';

const DELAY_PROBABILITY = 0.3;
const MAX_DELAY_MINUTES = 10;
const OCCUPANCY_OPTIONS: ('empty' | 'half' | 'full')[] = ['empty', 'half', 'full'];

function getStationPositionOnLine(line: typeof tramLines[0], stationId: string): { index: number; prevStation: typeof stations[0] | null; nextStation: typeof stations[0] | null; progressOnSegment: number } {
  const stationOrder = line.stationOrder || [];
  const index = stationOrder.indexOf(stationId);
  if (index === -1) return { index: -1, prevStation: null, nextStation: null, progressOnSegment: 0 };

  const prevStationId = index > 0 ? stationOrder[index - 1] : null;
  const nextStationId = index < stationOrder.length - 1 ? stationOrder[index + 1] : null;

  const prevStation = prevStationId ? stations.find(s => s.id === prevStationId) || null : null;
  const nextStation = nextStationId ? stations.find(s => s.id === nextStationId) || null : null;

  return { index, prevStation, nextStation, progressOnSegment: 0 };
}

function calculateTramPosition(line: typeof tramLines[0], stationId: string, progress: number): { lat: number; lng: number } {
  const station = stations.find(s => s.id === stationId);
  if (!station) return { lat: 0, lng: 0 };

  const { prevStation, nextStation } = getStationPositionOnLine(line, stationId);

  // If at end of line or no adjacent stations, stay at station
  if (!prevStation && !nextStation) {
    return { lat: station.latitude, lng: station.longitude };
  }

  // Determine direction: if progress < 0.5, coming from prev; if > 0.5, going to next
  // Actually, progress 0 = just left previous station, progress 1 = arriving at this station
  const fromStation = progress < 0.5 ? prevStation : station;
  const toStation = progress < 0.5 ? station : nextStation;

  if (!fromStation || !toStation) {
    return { lat: station.latitude, lng: station.longitude };
  }

  // Normalize progress for this segment
  const segmentProgress = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2;

  const lat = fromStation.latitude + (toStation.latitude - fromStation.latitude) * segmentProgress;
  const lng = fromStation.longitude + (toStation.longitude - fromStation.longitude) * segmentProgress;

  return { lat, lng };
}

function generateArrivalsForStation(stationId: string): TramArrival[] {
  const station = stations.find(s => s.id === stationId);
  if (!station) return [];

  const now = Date.now();
  const arrivals: TramArrival[] = [];

  tramLines.forEach((line, lineIndex) => {
    const stationOrder = line.stationOrder || [];
    if (!stationOrder.includes(stationId)) return; // Line doesn't stop here

    const numArrivals = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numArrivals; i++) {
      const baseMinutes = 3 + i * 12 + lineIndex * 4 + Math.floor(Math.random() * 3);
      const scheduledTime = now + baseMinutes * 60000;
      const hasDelay = Math.random() < DELAY_PROBABILITY;
      const delay = hasDelay ? Math.floor(Math.random() * MAX_DELAY_MINUTES) + 1 : 0;
      const estimatedTime = scheduledTime + delay * 60000;

      const progress = Math.min(1, Math.max(0, (now - (scheduledTime - 15 * 60000)) / (15 * 60000)));
      const { lat, lng } = calculateTramPosition(line, stationId, progress);

      arrivals.push({
        id: `${line.id}-${stationId}-${i}-${Date.now()}`,
        lineId: line.id,
        stationId,
        destination: line.destinations[Math.floor(Math.random() * line.destinations.length)],
        scheduledTime,
        estimatedTime,
        delay,
        latitude: lat,
        longitude: lng,
        vehicleId: `TR-${line.number}-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        occupancy: OCCUPANCY_OPTIONS[Math.floor(Math.random() * OCCUPANCY_OPTIONS.length)]
      });
    }
  });

  return arrivals.sort((a, b) => a.estimatedTime - b.estimatedTime);
}

export class MockTramProvider implements TramProvider {
  private subscribers: Map<string, Set<(arrivals: TramArrival[]) => void>> = new Map();
  private intervals: Map<string, number> = new Map();
  private currentArrivals: Map<string, TramArrival[]> = new Map();

  async getArrivals(stationId: string): Promise<TramArrival[]> {
    let arrivals = this.currentArrivals.get(stationId);
    if (!arrivals) {
      arrivals = generateArrivalsForStation(stationId);
      this.currentArrivals.set(stationId, arrivals);
    }
    return [...arrivals];
  }

  subscribe(stationId: string, callback: (arrivals: TramArrival[]) => void): () => void {
    if (!this.subscribers.has(stationId)) {
      this.subscribers.set(stationId, new Set());
      this.startSimulation(stationId);
    }
    this.subscribers.get(stationId)!.add(callback);

    const current = this.currentArrivals.get(stationId) || generateArrivalsForStation(stationId);
    this.currentArrivals.set(stationId, current);
    callback([...current]);

    return () => {
      const subs = this.subscribers.get(stationId);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.stopSimulation(stationId);
          this.subscribers.delete(stationId);
        }
      }
    };
  }

  private startSimulation(stationId: string): void {
    if (this.intervals.has(stationId)) return;

    const interval = window.setInterval(() => {
      this.updateArrivals(stationId);
    }, 3000);

    this.intervals.set(stationId, interval);
  }

  private stopSimulation(stationId: string): void {
    const interval = this.intervals.get(stationId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(stationId);
    }
  }

  private updateArrivals(stationId: string): void {
    let arrivals = this.currentArrivals.get(stationId);
    if (!arrivals) {
      arrivals = generateArrivalsForStation(stationId);
    }

    const now = Date.now();
    arrivals = arrivals.map(arrival => {
      const timeSinceScheduled = now - arrival.scheduledTime;
      let newDelay = arrival.delay;

      if (Math.random() < 0.1) {
        const change = Math.floor(Math.random() * 3) - 1;
        newDelay = Math.max(0, Math.min(MAX_DELAY_MINUTES, newDelay + change));
      }

      if (timeSinceScheduled > 5 * 60000 && arrival.estimatedTime < now) {
        return null;
      }

      const progress = Math.min(1, Math.max(0, (now - (arrival.scheduledTime - 15 * 60000)) / (15 * 60000)));
      const line = tramLines.find(l => l.id === arrival.lineId);
      let lat = arrival.latitude;
      let lng = arrival.longitude;
      if (line) {
        const pos = calculateTramPosition(line, stationId, progress);
        lat = pos.lat;
        lng = pos.lng;
      }

      return {
        ...arrival,
        delay: newDelay,
        estimatedTime: arrival.scheduledTime + newDelay * 60000,
        latitude: lat,
        longitude: lng
      };
    }).filter((a): a is TramArrival => a !== null);

    while (arrivals.length < 4) {
      const line = tramLines[Math.floor(Math.random() * tramLines.length)];
      const stationOrder = line.stationOrder || [];
      if (!stationOrder.includes(stationId)) continue;

      const baseMinutes = 15 + Math.floor(Math.random() * 10);
      const scheduledTime = now + baseMinutes * 60000;
      const hasDelay = Math.random() < DELAY_PROBABILITY;
      const delay = hasDelay ? Math.floor(Math.random() * MAX_DELAY_MINUTES) + 1 : 0;

      const progress = 0;
      const { lat, lng } = calculateTramPosition(line, stationId, progress);

      arrivals.push({
        id: `${line.id}-${stationId}-new-${Date.now()}`,
        lineId: line.id,
        stationId,
        destination: line.destinations[Math.floor(Math.random() * line.destinations.length)],
        scheduledTime,
        estimatedTime: scheduledTime + delay * 60000,
        delay,
        latitude: lat,
        longitude: lng,
        vehicleId: `TR-${line.number}-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
        occupancy: OCCUPANCY_OPTIONS[Math.floor(Math.random() * OCCUPANCY_OPTIONS.length)]
      });
    }

    arrivals.sort((a, b) => a.estimatedTime - b.estimatedTime);
    this.currentArrivals.set(stationId, arrivals);

    const subs = this.subscribers.get(stationId);
    if (subs) {
      subs.forEach(cb => cb([...arrivals]));
    }
  }
}

export class GtfsRealtimeProvider implements TramProvider {
  private readonly _feedUrl: string;

  constructor(feedUrl: string) {
    this._feedUrl = feedUrl;
    void this._feedUrl;
  }

  async getArrivals(_stationId: string): Promise<TramArrival[]> {
    console.warn('GtfsRealtimeProvider not implemented - using mock data');
    return [];
  }

  subscribe(_stationId: string, _callback: (arrivals: TramArrival[]) => void): () => void {
    console.warn('GtfsRealtimeProvider subscribe not implemented');
    return () => {};
  }
}