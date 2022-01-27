import { User } from "packages/state/domain/user";
import { File } from "../../file";

export interface Report {
  reportId: string;
  title: string;
  description: string;
  author: User;
  files: File[];
  createdAt: string;
  id?: string;
}
