import { IReportFile } from "../../packages/ui/domain/ReportFile";
import { ReportFileType } from '../../packages/ui/domain/ReportFileType'

export const FilesMokedData: IReportFile[] = [
  {
    id: "1",
    bucket: "",
    fileName: "video.avi",
    type: ReportFileType.IMAGE,
    src: "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "1",
    bucket: "",
    fileName: "image.avi",
    type: ReportFileType.IMAGE,
    src: "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "1",
    bucket: "",
    fileName: "audio.avi",
    type: ReportFileType.AUDIO,
    src: "",
    size: Math.random() * 10000000,
  },
  {
    id: "1",
    bucket: "",
    src: "",
    fileName: "other.pdf",
    type: ReportFileType.OTHER,    
    size: Math.random() * 10000000,
  },
];
