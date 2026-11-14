import { vi } from 'vitest';

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost/',
    search: '',
    hash: '',
    pathname: '/',
  },
  writable: true,
});

Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

Object.defineProperty(navigator, 'share', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

HTMLCanvasElement.prototype.getContext = vi.fn();
HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,');