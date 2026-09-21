import { TeaType } from "@/types";
import { Leaf, Flame, Flower2, Sprout, Snowflake } from "lucide-react";

/**
 * tea-visual.ts - backend KHÔNG có field ảnh sản phẩm (`Tea` schema chỉ có
 * name/type/price/description/origin/stock) nên mỗi loại trà được gán 1
 * bảng màu + icon riêng để thẻ sản phẩm vẫn bắt mắt, dễ phân biệt bằng mắt
 * thay vì mọi thẻ đều giống hệt nhau vì thiếu ảnh thật.
 */
export const TEA_VISUAL: Record<
  TeaType,
  { icon: React.ComponentType<{ className?: string }>; gradient: string }
> = {
  [TeaType.GREEN_TEA]: { icon: Leaf, gradient: "from-emerald-400 to-emerald-600" },
  [TeaType.BLACK_TEA]: { icon: Flame, gradient: "from-amber-700 to-stone-800" },
  [TeaType.OOLONG_TEA]: { icon: Sprout, gradient: "from-orange-400 to-amber-600" },
  [TeaType.HERBAL_TEA]: { icon: Flower2, gradient: "from-pink-400 to-rose-500" },
  [TeaType.WHITE_TEA]: { icon: Snowflake, gradient: "from-slate-300 to-slate-500" },
};
