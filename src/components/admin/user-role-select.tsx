"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleEnum } from "@/types";
import { useUpdateUser } from "@/hooks/use-users";

const ROLE_LABEL: Record<RoleEnum, string> = {
  [RoleEnum.GUEST]: "Khách",
  [RoleEnum.USER]: "Người dùng",
  [RoleEnum.ADMIN]: "Quản trị viên",
  [RoleEnum.MANAGER]: "Quản lý",
};

/** UserRoleSelect - đổi vai trò người dùng ngay trong bảng admin. */
export function UserRoleSelect({ userId, role }: { userId: string; role: RoleEnum }) {
  const updateUser = useUpdateUser();

  return (
    <Select
      value={String(role)}
      onValueChange={(next) => updateUser.mutate({ id: userId, payload: { role: Number(next) as RoleEnum } })}
      disabled={updateUser.isPending}
    >
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ROLE_LABEL).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
