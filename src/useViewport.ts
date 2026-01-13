import { useEffect, useState } from 'react';
import viewport from './viewport';

const useViewport = () => {
  const [width, setWidth] = useState(viewport.getWidth());

  useEffect(() => {
    const handler = () => setWidth(viewport.getWidth());
    const removeHandler = viewport.onResize(handler);

    return () => {
      removeHandler();
    };
  }, []);

  return width;
};

export default useViewport;
