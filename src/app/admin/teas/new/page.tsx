"use client";

import { TeaForm } from "@/components/admin/tea-form";
import { PageHeader } from "@/components/shared/page-header";

/** AdminNewTeaPage ("/admin/teas/new") - tạo sản phẩm mới, dùng `<TeaForm>` chung. */
export default function AdminNewTeaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Thêm sản phẩm mới" />
      <TeaForm />
    </div>
  );
}
