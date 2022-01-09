enum Roles {
  ADMIN,
  USER,
}

export interface User {
  id: string;
  username: string;
  role: Roles;
}
