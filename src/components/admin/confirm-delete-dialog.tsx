"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  isPending?: boolean;
}

/**
 * ConfirmDeleteDialog - hộp thoại xác nhận DÙNG CHUNG cho mọi hành động
 * xoá trong khu vực admin (xoá sản phẩm, xoá đơn, xoá người dùng...) - tránh
 * bấm nhầm 1 phát là mất dữ liệu vĩnh viễn.
 */
export function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  onConfirm,
  isPending,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xoá..." : "Xác nhận xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
