import { ReadReportDto } from "../src/domain/dto/report";
import { ListReports } from "../src/domain/dto/report/list.report.dto";
import {
  CreateUserDto,
  EditUserDto,
  ReadUserDto,
} from "../src/domain/dto/user";

export declare const CreateApi: (
  baseUrl: string,
  authToken: string
) => {
  user: {
    create: (
      data: CreateUserDto,
      params?: Record<string, unknown>,
      query?: Record<string, unknown>
    ) => Promise<ReadUserDto>;
    toggleRole: (
      data: EditUserDto,
      params?: {
        id: string;
      },
      query?: Record<string, unknown>
    ) => Promise<ReadUserDto>;
  };
  report: {
    byId: (
      data: Record<string, never>,
      params?: {
        id: string;
      },
      query?: Record<string, unknown>
    ) => Promise<ReadReportDto>;
    list: (
      data: Record<string, unknown>,
      params?: Record<string, unknown>,
      query?: {
        offset: number;
        limit: number;
      }
    ) => Promise<ListReports>;
  };
  file: {
    fetch: (
      data: unknown,
      params?: {
        reportId: string;
        fileId: string;
      },
      query?: Record<string, unknown>
    ) => Promise<string>;
  };
};
