import { User } from "./user";
import { Report } from "./report";

export interface Project {
  name: string;
  description: string;
  users: User[];
  reports: Report[];
  createdAt: string;
  id?: string;
}

export interface ProjectQuery {
  sortKey?: string;
  sortOrder?: string;
  search?: string;
  page: number;
  total?: number;
  size: number;
}
