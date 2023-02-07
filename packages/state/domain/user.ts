export const ROLES = {
  ADMIN: 'admin',
  REPORTER: 'reporter',
  VIEWER: 'viewer',
  EDITOR: 'editor'
}

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  note?: string
}

export interface LoginResponse {
  access_token: string
  two_factor_enabled: boolean
  user: User
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
  exclude?: Array<string>;
  size: number;
}
