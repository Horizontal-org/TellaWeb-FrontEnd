import { calcPercentage } from "packages/ui/utilities/calcPercentage";
import { secondsToTime } from "packages/ui/utilities/secondsToTime";
import { useRef, MouseEvent, useMemo } from "react";

type Props = {
  currentTime?: number;
  duration?: number;
  isDisabled?: boolean;
  onBarClick: (clickedTime: number) => void;
};

export const MediaProgressBar = ({
  currentTime,
  duration,
  isDisabled,
  onBarClick,
}: Props) => {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const percentage = `${calcPercentage(currentTime, duration) || 0}%`;

  const parsedCurrentTime = useMemo(
    () => secondsToTime(currentTime),
    [currentTime]
  );

  const parsedDuration = useMemo(() => secondsToTime(duration), [duration]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;

    const startXPosition = progressRef.current.getBoundingClientRect().left;
    const progressTotalWidth = progressRef.current.clientWidth;

    const durationInPixels = e.clientX - startXPosition;
    const secondsPerPixel = duration / progressTotalWidth;

    const clickedTime = Math.floor(secondsPerPixel * durationInPixels);

    onBarClick(clickedTime);
  };

  return (
    <div className="flex items-center">
      <div className="p-4 text-gray-500 text-sm">{parsedCurrentTime}</div>
      <div className="w-full relative">
        <div
          ref={progressRef}
          className="w-full bg-gray-200"
          style={{
            height: 4,
          }}
        ></div>

        <div
          className="bg-blue-300 absolute top-0"
          style={{
            height: 4,
            width: percentage,
          }}
        ></div>

        <div
          className="w-full cursor-pointer bg-transparent absolute top-0"
          style={{ height: 4 }}
          onClick={onClick}
        ></div>
      </div>
      <div className="p-4 text-gray-500 text-sm">{parsedDuration}</div>
    </div>
  );
};
