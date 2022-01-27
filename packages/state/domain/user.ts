enum Roles {
  ADMIN,
  USER,
}

export interface User {
  id: string;
  username: string;
  role: Roles;
}

export interface Credential {
  username: string;
  password: string;
}
