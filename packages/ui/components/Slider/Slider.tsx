import { FunctionComponent, useState } from "react";
import { SliderControl } from "./SliderControl";

type Props = {
  items: React.ReactNode[];
};

export const Slider: FunctionComponent<React.PropsWithChildren<Props>> = ({ items }) => {
  const [current, setCurrent] = useState(1);

  const goNext = () => {
    if (current === items.length) {
      setCurrent(1);
      return;
    }
    setCurrent(current + 1);
  };

  const goPrev = () => {
    if (current === 1) {
      setCurrent(items.length);
      return;
    }
    setCurrent(current - 1);
  };

  return items.length > 0 ? (
    <div className="flex-row">
      <div className="rounded-sm">{items[current - 1]}</div>
      <div className="flex justify-center my-5 px-10">
        <SliderControl
          goPrev={goPrev}
          goNext={goNext}
          current={current}
          total={items.length}
        />
      </div>
    </div>
  ) : null;
};
