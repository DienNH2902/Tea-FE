"use client";

import { use } from "react";
import { TeaForm } from "@/components/admin/tea-form";
import { PageHeader } from "@/components/shared/page-header";
import { useTea } from "@/hooks/use-teas";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";

/** AdminEditTeaPage ("/admin/teas/[id]/edit") - sửa sản phẩm có sẵn, tải dữ
 * liệu hiện tại rồi đổ vào `<TeaForm>` chung (qua prop `tea`). */
export default function AdminEditTeaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: tea, isLoading, isError } = useTea(id);

  if (isError) return notFound();

  return (
    <div className="space-y-6">
      <PageHeader title="Chỉnh sửa sản phẩm" />
      {isLoading || !tea ? <Skeleton className="h-96 max-w-2xl" /> : <TeaForm tea={tea} />}
    </div>
  );
}
