"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
}

/** QuantitySelector - bộ chọn số lượng dạng [-] [số] [+], dùng chung ở
 * trang chi tiết sản phẩm (chọn số lượng trước khi thêm giỏ) và trang giỏ
 * hàng (chỉnh số lượng từng dòng). Tự giới hạn trong khoảng [min, max]. */
export function QuantitySelector({ value, onChange, max = 99, min = 1 }: QuantitySelectorProps) {
  function clamp(n: number) {
    return Math.min(max, Math.max(min, n));
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        aria-label="Giảm số lượng"
      >
        <Minus className="size-3.5" />
      </Button>
      <Input
        type="number"
        className="h-8 w-14 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
        aria-label="Tăng số lượng"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
