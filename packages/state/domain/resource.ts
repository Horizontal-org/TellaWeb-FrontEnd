import { User } from "./user";
import { File } from "./file";

export interface Resource {
  id: string;
  title: string;
  fileName: string;
  description: string;
  createdAt: string;
}

export interface ResourceQuery {
  sortKey?: string;
  sortOrder?: string;
  search?: string;
  page: number;
  total?: number;
  size: number;
  exclude?: Array<string>;
}
