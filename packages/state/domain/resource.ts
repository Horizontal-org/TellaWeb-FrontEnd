import { User } from "./user";
import { File } from "./file";
import { Project } from "./project";

export interface Resource {
  id: string;
  title: string;
  fileName: string;
  description: string;
  size?: string;
  createdAt: string;
  projects?: Project[];
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
