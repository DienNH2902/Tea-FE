"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { useUsers, useDeleteUser } from "@/hooks/use-users";

const PAGE_SIZE = 10;

/** AdminUsersPage ("/admin/users") - danh sách toàn bộ người dùng, cho
 * phép đổi vai trò và xoá tài khoản. */
export default function AdminUsersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading } = useUsers(pageNumber, PAGE_SIZE);
  const deleteUser = useDeleteUser();

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý người dùng" description="Toàn bộ tài khoản đã đăng ký trong hệ thống" />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Khách quen</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              data?.data.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isRegular ? <Badge variant="success">Khách quen</Badge> : <Badge variant="outline">Thường</Badge>}
                  </TableCell>
                  <TableCell>
                    <UserRoleSelect userId={user._id} role={user.role} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ConfirmDeleteDialog
                      trigger={
                        <Button variant="ghost" size="icon" aria-label="Xoá người dùng">
                          <Trash2 className="text-destructive size-4" />
                        </Button>
                      }
                      title={`Xoá tài khoản "${user.name}"?`}
                      description="Hành động này không thể hoàn tác."
                      onConfirm={() => deleteUser.mutate(user._id)}
                      isPending={deleteUser.isPending}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {data && (
        <Pagination
          pageNumber={data.pageNumber}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          onPageChange={setPageNumber}
        />
      )}
    </div>
  );
}
