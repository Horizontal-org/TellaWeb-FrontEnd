import { IReportFile } from "../../packages/ui/domain/ReportFile";
import { ReportFileType } from '../../packages/ui/domain/ReportFileType'

export const FilesMokedData: IReportFile[] = [
  {
    id: "1",
    bucket: "",
    fileName: "video.mp4",
    type: ReportFileType.VIDEO,
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "2",
    bucket: "",
    fileName: "image.avi",
    type: ReportFileType.IMAGE,
    src: "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "3",
    bucket: "",
    fileName: "audio.mp3",
    type: ReportFileType.AUDIO,
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
