import {
  AuthPloc,
  UserPloc,
  ValidateEmailUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  RemoteUserRepository,
} from "../../user";
import {
  GetReportsUseCase,
  RemoteReportRepository,
  ReportsPloc,
  LoadReportByIdUseCase,
} from "../../report";
import {
  ApiDataFetcher,
  InMemoryCredentailRepository,
  JWTTokenGenerator,
} from "../data";
import { FilePloc, RemoteFileRepository } from "../../file";
import { DownloadFileUseCase } from "../../file/domain/DownloadFileUseCase";
import { DownloadAllReportFilesUseCase } from "../../file/domain/DownloadAllReportFilesUseCase";
import { DeleteFileUseCase } from "../../file/domain/DeleteFileUseCase";
import { DeleteReportByIdUseCase } from "../../report/domain/DeleteReportByIdUseCase";

const BASE_URL = (process.env.BASE_URL = "http://localhost:3000");

function provideDataFetcher(url: string = BASE_URL) {
  const loginDataFetcher = new ApiDataFetcher(url);
  const tokenGenerator = new JWTTokenGenerator(loginDataFetcher);
  const credentialRepositroy = new InMemoryCredentailRepository(tokenGenerator);
  const dataFetcher = new ApiDataFetcher(url, credentialRepositroy);

  return { dataFetcher, credentialRepositroy };
}

function provideAuthPloc(url: string = BASE_URL): AuthPloc {
  const { dataFetcher, credentialRepositroy } = provideDataFetcher(url);
  const userRepository = new RemoteUserRepository(dataFetcher);
  const loginUserUseCase = new LoginUserUseCase(
    credentialRepositroy,
    userRepository
  );
  const logoutUserUseCase = new LogoutUserUseCase(credentialRepositroy);

  const authPloc = new AuthPloc(loginUserUseCase, logoutUserUseCase);
  return authPloc;
}

function provideUserPloc(url: string = BASE_URL): UserPloc {
  const { dataFetcher } = provideDataFetcher(url)
  const userRepository = new RemoteUserRepository(dataFetcher)
  const validateEmailUseCase = new ValidateEmailUseCase(userRepository)

  const usersPloc = new UserPloc(validateEmailUseCase)
  return usersPloc
}

function provideReportPloc(url: string = BASE_URL): ReportsPloc {
  const { dataFetcher } = provideDataFetcher(url);
  const reportRepository = new RemoteReportRepository(dataFetcher);
  const getReportsUseCase = new GetReportsUseCase(reportRepository);
  const loadReportByIdUseCase = new LoadReportByIdUseCase(reportRepository);
  const deleteReporByIdUseCase = new DeleteReportByIdUseCase(reportRepository);
  const reportsPloc = new ReportsPloc(
    getReportsUseCase,
    loadReportByIdUseCase,
    deleteReporByIdUseCase
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
  provideAuthPloc,
  provideReportPloc,
  provideFilePloc,
  provideUserPloc
};
