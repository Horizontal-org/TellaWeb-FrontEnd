import { Roles } from "./Roles";

export interface User {
  id: string;
  username: string;
  role: Roles;
}
