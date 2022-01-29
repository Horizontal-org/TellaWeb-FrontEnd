import { FileType } from "../domain/file";
import { Report } from "../domain/report";

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
