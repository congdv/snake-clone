import {useEffect, useRef } from 'react';

export const useKeyboard = (callback = () => null, codes=[], options={keydown: true, keyUp: false}) => {
  const cb = useRef(callback);

  useEffect(() => {
    cb.current = callback;
  }, [callback])

  useEffect(() => {
    const downHandler = (event) => {
      if(codes.includes(event.code)) {
        cb.current(event);
      }
    }
    const upHandler = (event) => {
      if(codes.includes(event)) {
        cb.current(event);
      }
    }

    if(options.keydown) window.addEventListener('keydown', downHandler);
    if(options.keyUp) window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    }
  }, [cb, codes, options.keyUp, options.keydown])
}

export default useKeyboard;