"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  profileSchema,
  ProfileFormValues,
  changePasswordSchema,
  ChangePasswordFormValues,
} from "@/lib/validations/auth.schema";
import { useAuthStore } from "@/store/auth-store";
import { useProfile, useUpdateProfile, useChangePassword } from "@/hooks/use-auth";
import { GenderEnum } from "@/types";
import { getInitials } from "@/lib/utils";

/**
 * ProfilePage ("/profile") - CHỈ có thể vào từ menu Avatar ở NavBar. Có 2
 * tab: "Thông tin cá nhân" (xem/sửa) và "Đổi mật khẩu" - tách tab để không
 * dồn quá nhiều field vào 1 form dài, đúng tinh thần chia nhỏ theo chức năng.
 */
export default function ProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const { data: profile } = useProfile(!!storeUser);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  const user = profile ?? storeUser;

  const infoForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", age: undefined, gender: GenderEnum.Female, address: "" },
  });

  // Đổ dữ liệu vào form NGAY KHI có thông tin user (lần đầu tải xong /users/profile)
  useEffect(() => {
    if (user) {
      infoForm.reset({
        name: user.name,
        age: user.age,
        gender: user.gender,
        address: user.address,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  function onSubmitInfo(values: ProfileFormValues) {
    if (!user) return;
    updateProfile.mutate({ userId: user._id, payload: values });
  }

  function onSubmitPassword(values: ChangePasswordFormValues) {
    changePassword.mutate(
      { oldPassword: values.oldPassword, newPassword: values.newPassword },
      { onSuccess: () => passwordForm.reset() },
    );
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <PageHeader title="Hồ sơ của tôi" />

      <div className="flex items-center gap-4">
        <Avatar className="size-16">
          <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa thông tin</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...infoForm}>
                <form onSubmit={infoForm.handleSubmit(onSubmitInfo)} className="space-y-4">
                  <FormField
                    control={infoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ tên</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={infoForm.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tuổi</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={infoForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính</FormLabel>
                          <Select
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={String(GenderEnum.Female)}>Nữ</SelectItem>
                              <SelectItem value={String(GenderEnum.Male)}>Nam</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={infoForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu hiện tại</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhập lại mật khẩu mới</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={changePassword.isPending}>
                    {changePassword.isPending ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
