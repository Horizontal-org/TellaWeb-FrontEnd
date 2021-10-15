import { Dto } from "../../Dto";
import { RolesUser } from "../../RolesUser";

export class ReadUserDto implements Dto {
  id: string;
  username: string;
  role: RolesUser;
}
