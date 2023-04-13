import { useEffect, useRef } from 'react';

const useNotMountEffect = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const isMount = useRef(false);
  useEffect(() => {
    if (isMount.current) {
      return effect();
    }
    isMount.current = true;
  }, deps);
};

export default useNotMountEffect;
