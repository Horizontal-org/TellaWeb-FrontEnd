import { FunctionComponent } from "react";
import cn from "classnames";
import { IReportFile } from "../../domain/ReportFile";

type Props = {
  file: IReportFile;
  onClick?: () => void;
  full?: boolean;
  box?: boolean;
  selected?: boolean;
  children?: React.ReactNode;
};

export const VideoThumbnail: FunctionComponent<React.PropsWithChildren<Props>> = ({
  file,
  onClick,
  full,
  box,
  selected,
}) => {
  return (
    <div
        onClick={onClick}
        className={cn("bg-gray-25 rounded-md", {
          "cursor-pointer": onClick !== null,
          "w-full h-full": full,
          "w-24 h-24": !full && !box,
          "aspect-w-4 aspect-h-4 w-full": box,
        })}
        aria-hidden="true" // TODO: a11y
      >
        <div
          className={cn(
            "flex content-center flex-wrap rounded-md  hover:bg-black",
            {
              "hover:bg-opacity-5 ": file.thumbnail === undefined,
              "hover:bg-opacity-10": file.thumbnail !== undefined,
              "border-gray-100 hover:border-gray-500 border": !selected,
              "border-blue-400 hover:border-blue-500 border-2": !!(selected),
              "w-24 h-24": !full && !box,
              "aspect-w-4 aspect-h-4 w-full": box,
              "h-full w-full": full,
            }
          )}
        >
          <div className="w-full h-full flex">
            { file.src && (<video
              key={file.src}
              crossOrigin="use-credentials"
              className={"w-full"}
              >
              <source src={file.src} key={file.src} type='video/mp4' />
              Your browser does not support the <code>video</code> element.
            </video>)}
          </div>
        </div>
      </div>
  )
};

VideoThumbnail.defaultProps = {
  onClick: () => {},
  full: false,
  box: false,
};
