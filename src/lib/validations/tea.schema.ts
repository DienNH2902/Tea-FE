import { z } from "zod";
import { TeaType } from "@/types";

/** Schema form tạo/sửa sản phẩm ở trang admin - khớp validation của
 * `CreateTeaDto` bên backend. */
export const teaSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên trà (tiếng Việt)"),
  nameEn: z.string().min(1, "Vui lòng nhập tên trà (tiếng Anh)"),
  type: z.nativeEnum(TeaType, { errorMap: () => ({ message: "Vui lòng chọn loại trà" }) }),
  price: z.coerce.number().min(0, "Giá tiền không được nhỏ hơn 0"),
  description: z.string().optional(),
  origin: z.string().optional(),
  stock: z.coerce.number().min(0, "Số lượng tồn kho không được nhỏ hơn 0").optional(),
  isAvailable: z.boolean().optional(),
});
export type TeaFormValues = z.infer<typeof teaSchema>;
