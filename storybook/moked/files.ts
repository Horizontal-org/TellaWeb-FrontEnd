import { ReportFile } from "../../packages/ui/domain/ReportFile";

export const FilesMokedData: ReportFile[] = [
  {
    id: "1",
    bucket: "",
    fileName: "video.avi",
    type: "video",
    src: {
      path: "",
      name: "",
    },
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "1",
    bucket: "",
    fileName: "image.avi",
    type: "image",
    src: {
      path: "",
      name: "",
    },
    size: Math.random() * 10000000,
    thumbnail:
      "https://wearehorizontal.org/wp-content/uploads/2020/04/SourTyre_FemaleLebaneseProtestor-MobilePhone_RomanDeckert22102019.jpg",
  },
  {
    id: "1",
    bucket: "",
    fileName: "audio.avi",
    type: "audio",
    src: {
      path: "",
      name: "",
    },
    size: Math.random() * 10000000,
  },
  {
    id: "1",
    bucket: "",
    fileName: "other.pdf",
    type: "file",
    src: {
      path: "",
      name: "",
    },
    size: Math.random() * 10000000,
  },
];
