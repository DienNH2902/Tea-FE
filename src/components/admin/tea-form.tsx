"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { teaSchema, TeaFormValues } from "@/lib/validations/tea.schema";
import { TEA_TYPE_LABEL_VI, Tea, TeaType } from "@/types";
import { useCreateTea, useUpdateTea } from "@/hooks/use-teas";

interface TeaFormProps {
  /** Có giá trị khi đang SỬA 1 sản phẩm có sẵn - không có nghĩa là TẠO MỚI */
  tea?: Tea;
}

/**
 * TeaForm - form tạo/sửa sản phẩm, DÙNG CHUNG cho `/admin/teas/new` và
 * `/admin/teas/[id]/edit` (tách khỏi từng trang để không viết trùng gần
 * như toàn bộ form 2 lần - 2 trang chỉ khác nhau ở việc CÓ hay KHÔNG có
 * dữ liệu mặc định và gọi mutation nào).
 */
export function TeaForm({ tea }: TeaFormProps) {
  const router = useRouter();
  const createTea = useCreateTea();
  const updateTea = useUpdateTea();
  const isEditing = !!tea;

  const form = useForm<TeaFormValues>({
    resolver: zodResolver(teaSchema),
    defaultValues: {
      name: tea?.name ?? "",
      nameEn: tea?.nameEn ?? "",
      type: tea?.type ?? TeaType.GREEN_TEA,
      price: tea?.price ?? 0,
      description: tea?.description ?? "",
      origin: tea?.origin ?? "",
      stock: tea?.stock ?? 0,
      isAvailable: tea?.isAvailable ?? true,
    },
  });

  function onSubmit(values: TeaFormValues) {
    if (isEditing) {
      updateTea.mutate(
        { id: tea._id, payload: values },
        { onSuccess: () => router.push("/admin/teas") },
      );
    } else {
      createTea.mutate(values, { onSuccess: () => router.push("/admin/teas") });
    }
  }

  const isPending = createTea.isPending || updateTea.isPending;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên (Tiếng Việt)</FormLabel>
                    <FormControl>
                      <Input placeholder="Trà Sen Tây Hồ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên (Tiếng Anh)</FormLabel>
                    <FormControl>
                      <Input placeholder="West Lake Lotus Tea" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại trà</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(TEA_TYPE_LABEL_VI).map(([type, label]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá bán (đ)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tồn kho</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xuất xứ</FormLabel>
                  <FormControl>
                    <Input placeholder="Tây Hồ, Hà Nội" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Đang kinh doanh (hiển thị cho khách)</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
