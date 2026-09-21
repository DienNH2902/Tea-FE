"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { useTeas, useDeleteTea } from "@/hooks/use-teas";
import { TEA_TYPE_LABEL_VI } from "@/types";
import { formatCurrency } from "@/lib/utils";

const PAGE_SIZE = 10;

/** AdminTeasPage ("/admin/teas") - bảng quản lý toàn bộ sản phẩm: xem, sửa, xoá, thêm mới. */
export default function AdminTeasPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isLoading } = useTeas(pageNumber, PAGE_SIZE);
  const deleteTea = useDeleteTea();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý sản phẩm"
        description="Toàn bộ trà đang được bày bán trong hệ thống"
        action={
          <Button asChild>
            <Link href="/admin/teas/new">
              <Plus className="size-4" /> Thêm sản phẩm
            </Link>
          </Button>
        }
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Tồn kho</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              data?.data.map((tea) => (
                <TableRow key={tea._id}>
                  <TableCell className="font-medium">{tea.name}</TableCell>
                  <TableCell>{TEA_TYPE_LABEL_VI[tea.type]}</TableCell>
                  <TableCell>{formatCurrency(tea.price)}</TableCell>
                  <TableCell>{tea.stock}</TableCell>
                  <TableCell>
                    <Badge variant={tea.isAvailable && tea.stock > 0 ? "success" : "destructive"}>
                      {tea.isAvailable && tea.stock > 0 ? "Đang bán" : "Ngừng/Hết hàng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/teas/${tea._id}/edit`} aria-label="Sửa sản phẩm">
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <ConfirmDeleteDialog
                        trigger={
                          <Button variant="ghost" size="icon" aria-label="Xoá sản phẩm">
                            <Trash2 className="text-destructive size-4" />
                          </Button>
                        }
                        title={`Xoá "${tea.name}"?`}
                        description="Hành động này không thể hoàn tác. Sản phẩm sẽ bị xoá vĩnh viễn khỏi hệ thống."
                        onConfirm={() => deleteTea.mutate(tea._id)}
                        isPending={deleteTea.isPending}
                      />
                    </div>
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
