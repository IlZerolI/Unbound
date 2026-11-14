import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseStationFromUrl } from '@/utils/helpers';
import { getStationById, stations } from '@/data/stations';

describe('Station URL parsing', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, search: '' },
      writable: true
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
  });

  it('should parse valid station ID from URL', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?station=gimnazija' },
      writable: true
    });
    expect(parseStationFromUrl()).toBe('gimnazija');
  });

  it('should return null for invalid station ID', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?station=invalid' },
      writable: true
    });
    expect(parseStationFromUrl()).toBe('invalid');
  });

  it('should return null when no station param', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '' },
      writable: true
    });
    expect(parseStationFromUrl()).toBeNull();
  });

  it('should handle multiple params', () => {
    Object.defineProperty(window, 'location', {
      value: { search: '?foo=bar&station=medicinska-skola&baz=qux' },
      writable: true
    });
    expect(parseStationFromUrl()).toBe('medicinska-skola');
  });

  it('getStationById should return station for valid ID', () => {
    const station = getStationById('gimnazija');
    expect(station).toBeDefined();
    expect(station?.name).toBe('Gimnazija');
  });

  it('getStationById should return undefined for invalid ID', () => {
    const station = getStationById('invalid');
    expect(station).toBeUndefined();
  });

  it('should have all required station fields', () => {
    stations.forEach(station => {
      expect(station).toHaveProperty('id');
      expect(station).toHaveProperty('name');
      expect(station).toHaveProperty('latitude');
      expect(station).toHaveProperty('longitude');
      expect(station).toHaveProperty('address');
      expect(station).toHaveProperty('hasSmartBench');
      expect(station).toHaveProperty('hasBikeStation');
      expect(station).toHaveProperty('bikeCapacity');
    });
  });
});