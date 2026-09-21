/**
 * ============================================================================
 *  AUTH TYPES - người dùng, đăng nhập/đăng ký, payload giải mã từ JWT
 * ============================================================================
 */

/** Giới tính - khớp `GenderEnum` bên backend (0 = Nữ, 1 = Nam) */
export enum GenderEnum {
  Female = 0,
  Male = 1,
}

/** Vai trò người dùng - khớp `RoleEnum` bên backend */
export enum RoleEnum {
  GUEST = 0,
  USER = 1,
  ADMIN = 2,
  MANAGER = 3,
}

/** Thông tin người dùng đầy đủ - khớp `ResponseUserDto` bên backend */
export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  gender: GenderEnum;
  role: RoleEnum;
  address: string;
  isRegular: boolean;
}

/** Payload giải mã được từ JWT lưu trong cookie (xem `src/lib/jwt.ts`) -
 * dùng để hiển thị nhanh thông tin người dùng (avatar, tên, quyền admin...)
 * mà KHÔNG cần gọi API mỗi lần render - luôn đối chiếu lại với API
 * `/users/profile` khi cần dữ liệu chắc chắn mới nhất. */
export interface DecodedTokenPayload {
  sub: string;
  name: string;
  email: string;
  role: RoleEnum;
  age: number;
  gender: GenderEnum;
  address: string;
  isRegular: boolean;
  iat: number;
  exp: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender: GenderEnum;
  address?: string;
}

/** Response trả về từ POST /auth/login - khớp `AuthService.login()` backend */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface UpdatePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

/** Payload cập nhật hồ sơ - các field đều tuỳ chọn (PATCH một phần) */
export interface UpdateProfilePayload {
  name?: string;
  age?: number;
  gender?: GenderEnum;
  address?: string;
}
