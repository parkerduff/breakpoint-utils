import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  buildUpQuery,
  buildDownQuery,
  buildOnlyQuery,
  buildNotQuery,
  buildBetweenQuery,
  type BreakpointValue,
} from './breakpoints';

const useMediaQuery = (query: string): boolean => {
  const mql = useMemo(
    () => typeof window !== 'undefined' ? window.matchMedia(query) : null,
    [query]
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!mql) return () => {};
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [mql]
  );

  const getSnapshot = useCallback(() => {
    return mql?.matches ?? false;
  }, [mql]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export const useUp = (size: BreakpointValue): boolean => useMediaQuery(buildUpQuery(size));
export const useDown = (size: BreakpointValue): boolean => useMediaQuery(buildDownQuery(size));
export const useOnly = (size: string): boolean => useMediaQuery(buildOnlyQuery(size));
export const useNot = (size: string): boolean => useMediaQuery(buildNotQuery(size));
export const useBetween = (minSize: BreakpointValue, maxSize: BreakpointValue): boolean => useMediaQuery(buildBetweenQuery(minSize, maxSize));
