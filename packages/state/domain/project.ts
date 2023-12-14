import { User } from "./user";
import { Report } from "./report";
import { Resource } from "./resource";

export interface Project {
  name: string;
  description: string;
  users: User[];
  resources: Resource[];
  reports: Report[];
  createdAt: string;
  url?: string;
  slug?: string;
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
