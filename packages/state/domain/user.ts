export const ROLES = {
  ADMIN: 'admin',
  REPORTER: 'reporter',
  VIEWER: 'viewer',
  EDITOR: 'editor'
}

export interface User {
  id: string;
  username: string;
  otp_active: boolean
  role: string;
  createdAt: string;
  note?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User,
  flagged?: boolean
}

export interface OtpEnableRes {
  otp_url: string
  otp_code: string
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
  excludeProject?: string;
  size: number;
  // Only the users of this project (admins are in every project)
  projectId?: string;
}

export interface OtpData {
  otpCode: string,
  otpUrl: string
}