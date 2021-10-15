import { FileType } from "../../file/domain/FileType.enum";
import { Report } from "../domain";

export const addThumbnail = (report: Report) => {
  return {
    ...report,
    files: [
      ...report.files.map((file) => ({
        ...file,
        thumbnail:
          file.type === FileType.IMAGE || file.type === FileType.VIDEO
            ? `thumbnails/${file.bucket}/${file.id}`
            : undefined,
      })),
    ],
  };
};
