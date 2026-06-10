"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Save, Settings, Shield, Store, Upload, UserRound, Wrench } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  changePasswordSchema,
  profileSettingsSchema,
  storeSettingsSchema,
  systemSettingsSchema,
  type ChangePasswordInput,
  type ChangePasswordValues,
  type ProfileSettingsInput,
  type ProfileSettingsValues,
  type StoreSettingsInput,
  type StoreSettingsValues,
  type SystemSettingsInput,
  type SystemSettingsValues,
} from "@/modules/settings";
import { authService } from "@/services/auth.service";
import { settingsService } from "@/services/settings.service";
import { uploadService } from "@/services/upload.service";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateAuthUser } from "@/store/slices";

type SettingsTab = "profile" | "security" | "store" | "system";

const tabs: Array<{ id: SettingsTab; label: string; icon: typeof UserRound }> = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "security", label: "Security", icon: Shield },
  { id: "store", label: "Store settings", icon: Store },
  { id: "system", label: "System settings", icon: Wrench },
];

const defaultStoreValues: StoreSettingsInput = {
  address: "NDT Market",
  defaultShippingFee: 30000,
  email: "support@ndtmarket.vn",
  freeShippingThreshold: 300000,
  phone: "0900000000",
  storeName: "NDT Market",
};

const defaultSystemValues: SystemSettingsInput = {
  maintenanceMode: false,
  themeDefault: "system",
};

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { setTheme, theme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState<SettingsTab | null>(null);

  const profileForm = useForm<ProfileSettingsInput, unknown, ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      avatar: user?.avatar ?? "",
      email: user?.email ?? "",
      fullName: user?.fullName ?? user?.name ?? "",
    },
  });

  const passwordForm = useForm<ChangePasswordInput, unknown, ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  const storeForm = useForm<StoreSettingsInput, unknown, StoreSettingsValues>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: defaultStoreValues,
  });

  const systemForm = useForm<SystemSettingsInput, unknown, SystemSettingsValues>({
    resolver: zodResolver(systemSettingsSchema),
    defaultValues: {
      ...defaultSystemValues,
      themeDefault: (theme as SystemSettingsValues["themeDefault"]) ?? "system",
    },
  });

  const avatar = useWatch({ control: profileForm.control, name: "avatar" });
  const maintenanceMode = useWatch({ control: systemForm.control, name: "maintenanceMode" });

  useEffect(() => {
    profileForm.reset({
      avatar: user?.avatar ?? "",
      email: user?.email ?? "",
      fullName: user?.fullName ?? user?.name ?? "",
    });
  }, [profileForm, user]);

  async function loadSettings() {
    setLoadingSettings(true);

    try {
      const [storeResponse, systemResponse] = await Promise.all([
        settingsService.getStoreSettings(),
        settingsService.getSystemSettings(),
      ]);
      storeForm.reset(storeResponse.data);
      systemForm.reset(systemResponse.data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingSettings(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadSettings();
    }, 0);

    return () => window.clearTimeout(timer);
    // loadSettings intentionally runs once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAvatarUpload(file?: File) {
    if (!file) return;
    setUploadingAvatar(true);

    try {
      const response = await uploadService.uploadImage(file, "avatar");
      profileForm.setValue("avatar", response.data.imageUrl, { shouldValidate: true });
      toast.success("Upload avatar thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleProfileSubmit(values: ProfileSettingsValues) {
    setSubmitting("profile");

    try {
      const payload = {
        avatar: emptyToUndefined(values.avatar),
        fullName: values.fullName,
      };
      const response = await settingsService.updateProfile(payload);
      dispatch(updateAuthUser(response.data));
      toast.success("Cap nhat profile thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  }

  async function handlePasswordSubmit(values: ChangePasswordValues) {
    setSubmitting("security");

    try {
      await authService.changePassword(values);
      passwordForm.reset();
      toast.success("Doi mat khau thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  }

  async function handleStoreSubmit(values: StoreSettingsValues) {
    setSubmitting("store");

    try {
      const response = await settingsService.updateStoreSettings(values);
      storeForm.reset(response.data);
      toast.success("Cap nhat store settings thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  }

  async function handleSystemSubmit(values: SystemSettingsValues) {
    setSubmitting("system");

    try {
      const response = await settingsService.updateSystemSettings(values);
      systemForm.reset(response.data);
      setTheme(response.data.themeDefault);
      toast.success("Cap nhat system settings thanh cong");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        description="Quan ly thong tin tai khoan admin, bao mat, cau hinh cua hang va he thong."
        icon={Settings}
        title="Settings"
      />

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <Card className="h-fit">
          <CardContent className="grid gap-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {activeTab === "profile" ? (
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Email chi dung de dang nhap va hien tai dang readonly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5" onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                    {avatar ? (
                      <div aria-label="Admin avatar" className="h-full w-full bg-cover bg-center" role="img" style={{ backgroundImage: `url(${avatar})` }} />
                    ) : (
                      <ImageIcon className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <label className="flex h-9 w-fit cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium hover:bg-muted">
                    {uploadingAvatar ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                    Upload avatar
                    <input accept="image/jpeg,image/jpg,image/png,image/webp" className="sr-only" disabled={uploadingAvatar} type="file" onChange={(event) => handleAvatarUpload(event.target.files?.[0])} />
                  </label>
                </div>

                <Field error={profileForm.formState.errors.fullName?.message} label="Full name">
                  <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...profileForm.register("fullName")} />
                </Field>
                <Field error={profileForm.formState.errors.avatar?.message} label="Avatar URL">
                  <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...profileForm.register("avatar")} />
                </Field>
                <Field error={profileForm.formState.errors.email?.message} label="Email">
                  <input className="h-10 rounded-lg border bg-muted px-3 text-sm text-muted-foreground outline-none" readOnly {...profileForm.register("email")} />
                </Field>

                <SubmitButton loading={submitting === "profile"} text="Luu profile" />
              </form>
            </CardContent>
          </Card>
        ) : null}

        {activeTab === "security" ? (
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Doi mat khau tai khoan dang dang nhap.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-5" onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                <Field error={passwordForm.formState.errors.currentPassword?.message} label="Current password">
                  <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="password" {...passwordForm.register("currentPassword")} />
                </Field>
                <Field error={passwordForm.formState.errors.newPassword?.message} label="New password">
                  <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="password" {...passwordForm.register("newPassword")} />
                </Field>
                <Field error={passwordForm.formState.errors.confirmPassword?.message} label="Confirm password">
                  <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" type="password" {...passwordForm.register("confirmPassword")} />
                </Field>
                <SubmitButton loading={submitting === "security"} text="Doi mat khau" />
              </form>
            </CardContent>
          </Card>
        ) : null}

        {activeTab === "store" ? (
          <Card>
            <CardHeader>
              <CardTitle>Store settings</CardTitle>
              <CardDescription>Thong tin cua hang mac dinh va cau hinh phi giao hang.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSettings ? (
                <LoadingBlock />
              ) : (
                <form className="grid gap-5" onSubmit={storeForm.handleSubmit(handleStoreSubmit)}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field error={storeForm.formState.errors.storeName?.message} label="Store name">
                      <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...storeForm.register("storeName")} />
                    </Field>
                    <Field error={storeForm.formState.errors.phone?.message} label="Phone">
                      <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...storeForm.register("phone")} />
                    </Field>
                    <Field error={storeForm.formState.errors.email?.message} label="Email">
                      <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...storeForm.register("email")} />
                    </Field>
                    <Field error={storeForm.formState.errors.defaultShippingFee?.message} label="Default shipping fee">
                      <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...storeForm.register("defaultShippingFee")} />
                    </Field>
                    <Field error={storeForm.formState.errors.freeShippingThreshold?.message} label="Free shipping threshold">
                      <input className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" min={0} type="number" {...storeForm.register("freeShippingThreshold")} />
                    </Field>
                  </div>
                  <Field error={storeForm.formState.errors.address?.message} label="Default store address">
                    <textarea className="min-h-24 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...storeForm.register("address")} />
                  </Field>
                  <SubmitButton loading={submitting === "store"} text="Luu store settings" />
                </form>
              )}
            </CardContent>
          </Card>
        ) : null}

        {activeTab === "system" ? (
          <Card>
            <CardHeader>
              <CardTitle>System settings</CardTitle>
              <CardDescription>Theme mac dinh va maintenance mode neu backend ho tro.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSettings ? (
                <LoadingBlock />
              ) : (
                <form className="grid gap-5" onSubmit={systemForm.handleSubmit(handleSystemSubmit)}>
                  <Field error={systemForm.formState.errors.themeDefault?.message} label="Theme default">
                    <select className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/30" {...systemForm.register("themeDefault")}>
                      <option value="system">System</option>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </Field>

                  <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
                    <span>
                      <span className="block text-sm font-medium">Maintenance mode</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {maintenanceMode ? "Dang bat bao tri he thong." : "Website dang hoat dong binh thuong."}
                      </span>
                    </span>
                    <input className="size-5 accent-primary" type="checkbox" {...systemForm.register("maintenanceMode")} />
                  </label>

                  <SubmitButton loading={submitting === "system"} text="Luu system settings" />
                </form>
              )}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {error ? <span className="text-xs font-medium text-destructive">{error}</span> : null}
    </label>
  );
}

function SubmitButton({ loading, text }: { loading: boolean; text: string }) {
  return (
    <div className="flex justify-end">
      <Button disabled={loading} type="submit">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {text}
      </Button>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="grid min-h-72 place-items-center">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  );
}

function emptyToUndefined(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "Da co loi xay ra";
}
