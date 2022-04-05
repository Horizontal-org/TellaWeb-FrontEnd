import StreamVisual from "./StreamVisual";
import StreamDefault from "./StreamDefault";

type Props = {
  currentPercentage: string | number;
};

export const AudioVisualization = ({ currentPercentage }: Props) => {
  return (
    <div className="h-60 w-full flex justify-center items-center bg-gray-200 my-5">
      <div
        className="relative"
        style={{
          height: 80,
          width: 468,
        }}
      >
        <div className="absolute top-0">
          <StreamDefault />
        </div>
        <div
          className="absolute top-0"
          style={{
            marginLeft: "-1px",
            marginTop: "-1px",
          }}
        >
          <StreamVisual width={`${currentPercentage}%`} />
        </div>
      </div>
    </div>
  );
};
