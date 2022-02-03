enum Roles {
  ADMIN,
  USER,
}

export interface User {
  id: string;
  username: string;
  role: Roles;
  createdAt: string;
}

export interface Credential {
  username: string;
  password: string;
}

export interface UserQuery {
  sortKey?: string;
  sortOrder?: string;
  search?: string;
  page: number;
  total?: number;
  size: number;
}
