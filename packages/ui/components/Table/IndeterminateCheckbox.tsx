import { useEffect, forwardRef, useRef, Ref } from "react";
import { useCombinedRefs } from "../../utilities/useCombinedRefs";

interface Props {
  indeterminate?: boolean;
  name?: string;
}

export const IndeterminateCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ indeterminate, ...rest }, ref: Ref<HTMLInputElement>) => {
    const defaultRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, defaultRef);

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false;
      }
    }, [combinedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" style={{width: 40, height: 40}} ref={combinedRef} {...rest} />
      </>
    );
  }
);
