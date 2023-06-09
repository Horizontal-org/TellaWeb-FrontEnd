export const toReport = (report: any) => ({
  ...report,
  date: new Date(report.createdAt),
  name: report.title,
  files: report.files.map((file: any) => ({
    ...file,
    src: `${process.env.NEXT_PUBLIC_API_URL}/file/asset/${report.id}/${file.id}/`,
    thumbnail: ["VIDEO", "IMAGE"].includes(file.type)
      ? `${process.env.NEXT_PUBLIC_API_URL}/file/asset/${report.id}/${file.id}/`
      : undefined,
  })),
});
