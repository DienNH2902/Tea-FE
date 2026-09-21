import { z } from "zod";
import { GenderEnum } from "@/types";

/** Schema đăng nhập - khớp validation của `LoginDto` bên backend */
export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

/** Schema đăng ký - khớp validation của `RegisterDto` bên backend */
export const registerSchema = z
  .object({
    name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
    email: z.string().min(1, "Vui lòng nhập email").email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng nhập lại mật khẩu"),
    age: z.coerce.number().min(0, "Tuổi không hợp lệ").optional(),
    gender: z.nativeEnum(GenderEnum, { errorMap: () => ({ message: "Vui lòng chọn giới tính" }) }),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

/** Schema đổi mật khẩu - khớp `UpdatePasswordDto` */
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmNewPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu mới"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmNewPassword"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/** Schema chỉnh sửa hồ sơ cá nhân */
export const profileSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  age: z.coerce.number().min(0, "Tuổi không hợp lệ").optional(),
  gender: z.nativeEnum(GenderEnum),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
});
export type ProfileFormValues = z.infer<typeof profileSchema>;
