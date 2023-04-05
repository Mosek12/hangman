import { useEffect, useRef } from "react";

const useNotMountEffect = (effect, deps) => {
  const isMount = useRef(false);
  useEffect(() => {
    if (isMount.current) {
      return effect();
    }
    isMount.current = true;
  }, deps);
};

export default useNotMountEffect;
