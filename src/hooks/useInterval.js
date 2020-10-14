import { useEffect, useRef } from 'react';

const useInterval = (callback = () => null, delay) => {
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => cb.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [cb, delay])
}

export default useInterval;