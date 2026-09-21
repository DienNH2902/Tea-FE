"use client";
import { useEffect, useState } from "react";

/** useDebounce - trì hoãn cập nhật giá trị cho tới khi người dùng NGỪNG gõ
 * trong `delayMs` mili-giây - dùng cho ô tìm kiếm sản phẩm để tránh gọi API
 * liên tục theo từng ký tự gõ. */
export function useDebounce<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
