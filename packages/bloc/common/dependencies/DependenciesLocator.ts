import {
  GetReportsUseCase,
  RemoteReportRepository,
  ReportsPloc,
  LoadReportByIdUseCase,
  BatchDeleteReportUseCase,
} from "../../report";
import { ApiDataFetcher } from "../data";
import { FilePloc, RemoteFileRepository } from "../../file";
import { DownloadFileUseCase } from "../../file/domain/DownloadFileUseCase";
import { DownloadAllReportFilesUseCase } from "../../file/domain/DownloadAllReportFilesUseCase";
import { DeleteFileUseCase } from "../../file/domain/DeleteFileUseCase";
import { DeleteReportByIdUseCase } from "../../report/domain/DeleteReportByIdUseCase";

const BASE_URL = (process.env.BASE_URL = "http://localhost:3000");

function provideDataFetcher(url: string = BASE_URL) {
  const dataFetcher = new ApiDataFetcher(url);

  return { dataFetcher };
}

function provideReportPloc(url: string = BASE_URL): ReportsPloc {
  const { dataFetcher } = provideDataFetcher(url);
  const reportRepository = new RemoteReportRepository(dataFetcher);
  const getReportsUseCase = new GetReportsUseCase(reportRepository);
  const loadReportByIdUseCase = new LoadReportByIdUseCase(reportRepository);
  const deleteReporByIdUseCase = new DeleteReportByIdUseCase(reportRepository);
  const batchDeleteReportUseCase = new BatchDeleteReportUseCase(
    reportRepository
  );

  const reportsPloc = new ReportsPloc(
    getReportsUseCase,
    loadReportByIdUseCase,
    deleteReporByIdUseCase,
    batchDeleteReportUseCase
  );
  return reportsPloc;
}

function provideFilePloc(url: string = BASE_URL): FilePloc {
  const { dataFetcher } = provideDataFetcher(url);
  const fileRepository = new RemoteFileRepository(dataFetcher);
  const downloadAllReportFiles = new DownloadAllReportFilesUseCase(
    fileRepository
  );
  const downloadFile = new DownloadFileUseCase(fileRepository);
  const deleteFile = new DeleteFileUseCase(fileRepository);
  const filePloc = new FilePloc(
    downloadAllReportFiles,
    downloadFile,
    deleteFile
  );
  return filePloc;
}

export const dependenciesLocator = {
  provideReportPloc,
  provideFilePloc,
};
