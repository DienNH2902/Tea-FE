"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEA_TYPE_LABEL_VI, TeaType } from "@/types";

export interface TeaFiltersValue {
  search: string;
  type: TeaType | "all";
  availability: "all" | "in-stock" | "out-of-stock";
}

interface TeaFiltersProps {
  value: TeaFiltersValue;
  onChange: (value: TeaFiltersValue) => void;
}

/**
 * TeaFilters - thanh công cụ lọc/tìm kiếm cho trang Cửa hàng: tìm theo
 * tên, lọc theo loại trà, lọc còn hàng/hết hàng. Là component "điều khiển"
 * (controlled) - trang cha (`/teas`) giữ state thật, component này chỉ lo
 * hiển thị và báo lại thay đổi qua `onChange`.
 */
export function TeaFilters({ value, onChange }: TeaFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Tìm kiếm theo tên trà..."
          className="pl-9"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <Select
        value={value.type}
        onValueChange={(type) => onChange({ ...value, type: type as TeaFiltersValue["type"] })}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Loại trà" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả loại trà</SelectItem>
          {Object.entries(TEA_TYPE_LABEL_VI).map(([type, label]) => (
            <SelectItem key={type} value={type}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.availability}
        onValueChange={(availability) =>
          onChange({ ...value, availability: availability as TeaFiltersValue["availability"] })
        }
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Tình trạng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Còn &amp; hết hàng</SelectItem>
          <SelectItem value="in-stock">Chỉ còn hàng</SelectItem>
          <SelectItem value="out-of-stock">Chỉ hết hàng</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
