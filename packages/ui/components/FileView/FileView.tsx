import { IReportFile } from "../../domain/ReportFile";
import { ReportFileType } from "../../domain/ReportFileType";
import { ImageView } from "../ImageView/ImageView";
import { AudioView } from "../AudioView/AudioView";
import { VideoView } from "../VideoView/VideoView";

type Props = {
  file: IReportFile;
};

export const FileView = ({ file }: Props) => {
  const viewType = ((type: keyof typeof ReportFileType) => {
    switch (type) {
      case ReportFileType.IMAGE:
        return <ImageView file={file} />;
      case ReportFileType.AUDIO:
        return <AudioView file={file} />;
      case ReportFileType.VIDEO:
        return <VideoView file={file} />;
      default:
        return null;
    }
  })(file.type);

  return <div className="w-full h-full">{viewType}</div>;
};
