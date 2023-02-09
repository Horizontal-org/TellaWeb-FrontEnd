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
  user: User
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
  size: number;
}

export interface OtpData {
  otpCode: string,
  otpUrl: string
}