import { User } from "./user";
import { File } from "./file";

export interface Report {
  reportId: string;
  title: string;
  description: string;
  author: User;
  files: File[];
  createdAt: string;
  id?: string;
}

export interface ReportQuery {
  sortKey?: string;
  sortOrder?: string;
  search?: string;
  page: number;
  total?: number;
  size: number;
}
