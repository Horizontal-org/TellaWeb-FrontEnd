import { CSSProperties, FunctionComponent } from "react";
import cn from "classnames";
import { MdHeadset } from "@react-icons/all-files/md/MdHeadset";
import { MdVideocam } from "@react-icons/all-files/md/MdVideocam";
import { MdInsertDriveFile } from "@react-icons/all-files/md/MdInsertDriveFile";
import { ReportFileType } from "../../domain/ReportFileType";
import { IReportFile } from "../../domain/ReportFile";

type Props = {
  file: IReportFile;
  onClick?: () => void;
  full?: boolean;
  box?: boolean;
};

export const Thumbnail: FunctionComponent<Props> = ({
  file,
  onClick,
  full,
  box,
}) => {
  const icon = ((type: keyof typeof ReportFileType) => {
    switch (type) {
      case ReportFileType.AUDIO:
        return (
          <div className="m-auto">
            <MdHeadset size={25} color="#8B8E8F" />
          </div>
        );
      case ReportFileType.VIDEO:
        return (
          <div className="m-auto bg-black opacity-70 p-2 rounded-sm">
            <MdVideocam size={25} color="#ffffff" />
          </div>
        );
      case ReportFileType.OTHER:
        return (
          <div className="m-auto">
            <MdInsertDriveFile size={25} color="#8B8E8F" />
          </div>
        );
      default:
        return null;
    }
  })(file.type);

  const getBackgroundImage = (thumbnail?: string): CSSProperties => {
    return thumbnail
      ? {
          backgroundImage: `url(${thumbnail})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }
      : {};
  };

  return (
    <div
      onClick={onClick}
      className={cn("bg-gray-25 rounded-md", {
        "cursor-pointer": onClick !== null,
        "w-full h-full": full,
        "w-24 h-24": !full && !box,
        "aspect-w-4 aspect-h-4 w-full": box,
      })}
      style={getBackgroundImage(file.thumbnail)}
      aria-hidden="true" // TODO: a11y
    >
      <div
        className={cn(
          "flex content-center flex-wrap border rounded-md border-gray-100 hover:border-gray-500 hover:bg-black",
          {
            "hover:bg-opacity-5 ": file.thumbnail === undefined,
            "hover:bg-opacity-10": file.thumbnail !== undefined,
            "w-24 h-24": !full && !box,
            "aspect-w-4 aspect-h-4 w-full": box,
            "h-full w-full": full,
          }
        )}
      >
        <div className="w-full h-full flex">{icon}</div>
      </div>
    </div>
  );
};

Thumbnail.defaultProps = {
  onClick: () => {},
  full: false,
  box: false,
};
