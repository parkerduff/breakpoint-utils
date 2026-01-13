import viewport from './viewport';

const defaultBreakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoints = Record<string, number>;

let currentBreakpoints: Breakpoints = { ...defaultBreakpoints };
let sortedBreakpoints: [string, number][] = [];

const updateSortedBreakpoints = () => {
  sortedBreakpoints = Object.entries(currentBreakpoints).sort((a, b) => a[1] - b[1]);
};

updateSortedBreakpoints();

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

const getNextBreakpoint = (size: string): number => {
  const currentIndex = sortedBreakpoints.findIndex(([name]) => name === size);
  const next = sortedBreakpoints[currentIndex + 1];
  return next ? next[1] : Infinity;
};

export const up = (size: string) => {
  validateBreakpoint(size);
  return viewport.getWidth() >= currentBreakpoints[size];
};

export const down = (size: string) => {
  validateBreakpoint(size);
  return viewport.getWidth() < currentBreakpoints[size];
};

export const only = (size: string) => {
  validateBreakpoint(size);
  const width = viewport.getWidth();
  const min = currentBreakpoints[size];
  const max = getNextBreakpoint(size);
  return width >= min && width < max;
};

export const not = (size: string) => {
  validateBreakpoint(size);
  const width = viewport.getWidth();
  const min = currentBreakpoints[size];
  const max = getNextBreakpoint(size);
  return width < min || width >= max;
};

export const between = (minSize: string, maxSize: string) => {
  validateBreakpoint(minSize);
  validateBreakpoint(maxSize);
  const width = viewport.getWidth();
  const min = currentBreakpoints[minSize];
  const max = currentBreakpoints[maxSize];
  return width >= min && width < max;
};
