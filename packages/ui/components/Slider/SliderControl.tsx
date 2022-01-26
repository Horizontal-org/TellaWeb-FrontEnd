import { FunctionComponent } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

type Props = {
  goPrev: () => void;
  goNext: () => void;
  current: number;
  total: number;
};

export const SliderControl: FunctionComponent<Props> = ({
  goPrev,
  goNext,
  current,
  total,
}) => {
  return total > 0 ? (
    <div className="flex h-full flex-1 items-center justify-between">
      <MdNavigateBefore
        className="cursor-pointer opacity-70 text-gray-400"
        onClick={goPrev}
      />
      <p className="text-sm font-sans font-light text-gray-400">
        {current} / {total}
      </p>
      <MdNavigateNext
        className="cursor-pointer opacity-70 text-gray-400"
        onClick={goNext}
      />
    </div>
  ) : null;
};
