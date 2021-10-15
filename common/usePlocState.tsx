import { Ploc } from "packages/bloc";
import { useEffect, useState } from "react";

export function usePlocState<S>(ploc: Ploc<S>) {
  const [state, setState] = useState<S | undefined>(ploc.state);

  useEffect(() => {
    const stateSubscription = (newState: S) => {
      setState(newState);
    };

    ploc.subscribe(stateSubscription);

    return () => {
      ploc.unsubscribe(stateSubscription);
    };
  }, [ploc]);

  return state;
}
