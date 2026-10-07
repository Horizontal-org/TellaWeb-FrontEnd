
// TODO: Fix the types in this react-table hack

import { useRef, useEffect, MutableRefObject } from "react";

export const useCombinedRefs = (...refs): MutableRefObject<any> => {
  const targetRef = useRef();

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};
