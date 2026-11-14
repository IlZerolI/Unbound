import { EnergySimulator, EnergyData } from '@/types';

const BASE_SOLAR = 800;
const BASE_KINETIC = 50;
const BASE_CONSUMPTION = 400;
const BATTERY_CAPACITY = 100;

export class EnergySimulatorImpl implements EnergySimulator {
  private subscribers: Set<(data: EnergyData) => void> = new Set();
  private interval: number | null = null;
  private currentData: EnergyData;
  private timeOfDay: number;

  constructor() {
    this.timeOfDay = new Date().getHours() + new Date().getMinutes() / 60;
    this.currentData = this.generateData(this.timeOfDay);
    this.start();
  }

  private generateData(hour: number): EnergyData {
    const solarFactor = Math.max(0, Math.sin((hour - 6) / 12 * Math.PI));
    const solar = BASE_SOLAR * solarFactor + (Math.random() - 0.5) * 100;

    const kineticFactor = 0.3 + 0.7 * Math.sin(hour / 24 * 2 * Math.PI);
    const kinetic = BASE_KINETIC * kineticFactor + (Math.random() - 0.5) * 20;

    const consumptionFactor = 0.5 + 0.5 * Math.sin((hour - 6) / 12 * Math.PI);
    const consumption = BASE_CONSUMPTION * consumptionFactor + (Math.random() - 0.5) * 50;

    const netPower = solar + kinetic - consumption;
    let batteryLevel = this.currentData?.batteryLevel ?? 75;
    batteryLevel = Math.max(0, Math.min(BATTERY_CAPACITY, batteryLevel + netPower / 1000));

    let batteryStatus: EnergyData['batteryStatus'] = 'stable';
    if (netPower > 50) batteryStatus = 'charging';
    else if (netPower < -50) batteryStatus = 'discharging';

    return {
      timestamp: Date.now(),
      solar: Math.max(0, Math.round(solar)),
      kinetic: Math.max(0, Math.round(kinetic)),
      consumption: Math.max(0, Math.round(consumption)),
      batteryLevel: Math.round(batteryLevel * 10) / 10,
      batteryStatus
    };
  }

  getCurrentData(): EnergyData {
    return { ...this.currentData };
  }

  subscribe(callback: (data: EnergyData) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getCurrentData());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach(cb => cb(this.getCurrentData()));
  }

  private update(): void {
    this.timeOfDay = new Date().getHours() + new Date().getMinutes() / 60 + new Date().getSeconds() / 3600;
    this.currentData = this.generateData(this.timeOfDay);
    this.notify();
  }

  private start(): void {
    if (this.interval) return;
    this.interval = window.setInterval(() => this.update(), 3000);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const energySimulator = new EnergySimulatorImpl();

export function generateHourlyData(): Array<{ hour: number; solar: number; kinetic: number; consumption: number; battery: number }> {
  const data = [];
  const now = new Date();
  const currentHour = now.getHours();

  for (let i = 0; i < 24; i++) {
    const hour = (currentHour - 11 + i + 24) % 24;
    const solarFactor = Math.max(0, Math.sin((hour - 6) / 12 * Math.PI));
    const solar = BASE_SOLAR * solarFactor;
    const kineticFactor = 0.3 + 0.7 * Math.sin(hour / 24 * 2 * Math.PI);
    const kinetic = BASE_KINETIC * kineticFactor;
    const consumptionFactor = 0.5 + 0.5 * Math.sin((hour - 6) / 12 * Math.PI);
    const consumption = BASE_CONSUMPTION * consumptionFactor;
    let battery = 75;
    for (let h = 0; h <= hour; h++) {
      const sf = Math.max(0, Math.sin((h - 6) / 12 * Math.PI));
      const s = BASE_SOLAR * sf;
      const kf = 0.3 + 0.7 * Math.sin(h / 24 * 2 * Math.PI);
      const k = BASE_KINETIC * kf;
      const cf = 0.5 + 0.5 * Math.sin((h - 6) / 12 * Math.PI);
      const c = BASE_CONSUMPTION * cf;
      battery += (s + k - c) / 1000;
    }
    battery = Math.max(0, Math.min(100, battery));

    data.push({
      hour,
      solar: Math.round(solar),
      kinetic: Math.round(kinetic),
      consumption: Math.round(consumption),
      battery: Math.round(battery * 10) / 10
    });
  }
  return data;
}