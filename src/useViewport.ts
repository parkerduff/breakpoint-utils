import { useSyncExternalStore } from 'react';
import viewport from './viewport';

const subscribe = (callback: () => void) => viewport.onResize(callback);
const getSnapshot = () => viewport.getWidth();
const getServerSnapshot = () => 0;

const useViewport = () => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useViewport;
