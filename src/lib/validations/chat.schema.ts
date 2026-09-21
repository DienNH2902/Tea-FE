import { z } from "zod";

/** Schema tin nhắn gửi cho BOT - chỉ cần chặn gửi tin nhắn rỗng */
export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, "Vui lòng nhập nội dung"),
});
export type ChatMessageFormValues = z.infer<typeof chatMessageSchema>;
