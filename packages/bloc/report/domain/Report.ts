import { File } from "../../file";
import { User } from "../../user";

export interface Report {
  reportId: string;
  title: string;
  description: string;
  author: User;
  files: File[];
}
