const defaultBreakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoints = Record<string, number>;
export type BreakpointValue = string | number;

let currentBreakpoints: Breakpoints = { ...defaultBreakpoints };
let sortedBreakpoints: [string, number][] = [];

const updateSortedBreakpoints = () => {
  sortedBreakpoints = Object.entries(currentBreakpoints).sort((a, b) => a[1] - b[1]);
};

updateSortedBreakpoints();

/**
 * Set custom breakpoints. Call this at app startup before any components mount.
 * Calling after mount will not update active hook subscriptions until the next re-render.
 */
export const configure = <T extends Breakpoints>(customBreakpoints: T) => {
  currentBreakpoints = customBreakpoints;
  updateSortedBreakpoints();
};

export const getBreakpoints = () => currentBreakpoints;

const validateBreakpoint = (size: string): void => {
  if (!(size in currentBreakpoints)) {
    throw new Error(`Invalid breakpoint: "${size}". Available breakpoints: ${Object.keys(currentBreakpoints).join(', ')}`);
  }
};

const resolveSize = (size: BreakpointValue): number => {
  if (typeof size === 'number') return size;
  validateBreakpoint(size);
  return currentBreakpoints[size];
};

const getNextBreakpoint = (size: string): number => {
  const currentIndex = sortedBreakpoints.findIndex(([name]) => name === size);
  const next = sortedBreakpoints[currentIndex + 1];
  return next ? next[1] : Infinity;
};

/**
 * @internal Query builders - used by hook layer, not part of public API
 */
const buildUpQuery = (size: BreakpointValue): string => {
  return `(min-width: ${resolveSize(size)}px)`;
};

const buildDownQuery = (size: BreakpointValue): string => {
  return `(max-width: ${resolveSize(size) - 0.02}px)`;
};

const buildOnlyQuery = (size: string): string => {
  validateBreakpoint(size);
  const min = currentBreakpoints[size];
  const max = getNextBreakpoint(size);
  return max === Infinity
    ? `(min-width: ${min}px)`
    : `(min-width: ${min}px) and (max-width: ${max - 0.02}px)`;
};

const buildNotQuery = (size: string): string => {
  validateBreakpoint(size);
  const min = currentBreakpoints[size];
  const max = getNextBreakpoint(size);
  return max === Infinity
    ? `(max-width: ${min - 0.02}px)`
    : `(max-width: ${min - 0.02}px), (min-width: ${max}px)`;
};

const buildBetweenQuery = (minSize: BreakpointValue, maxSize: BreakpointValue): string => {
  const min = resolveSize(minSize);
  const max = resolveSize(maxSize);
  if (min >= max) {
    throw new Error(`minSize "${minSize}" (${min}px) must be smaller than maxSize "${maxSize}" (${max}px)`);
  }
  return `(min-width: ${min}px) and (max-width: ${max - 0.02}px)`;
};

// Imperative API (use in handlers, utils, non-React code)
const matchMedia = (query: string): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(query).matches;
};

export const up = (size: BreakpointValue): boolean => matchMedia(buildUpQuery(size));
export const down = (size: BreakpointValue): boolean => matchMedia(buildDownQuery(size));
export const only = (size: string): boolean => matchMedia(buildOnlyQuery(size));
export const not = (size: string): boolean => matchMedia(buildNotQuery(size));
export const between = (minSize: BreakpointValue, maxSize: BreakpointValue): boolean => matchMedia(buildBetweenQuery(minSize, maxSize));

// Export query builders for hook layer
export { buildUpQuery, buildDownQuery, buildOnlyQuery, buildNotQuery, buildBetweenQuery };
