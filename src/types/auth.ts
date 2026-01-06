// src/types/auth.ts

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// 如果需要，也可以把登录表单的类型放这里
export interface LoginPayload {
  username: string;
  password: string;
}
