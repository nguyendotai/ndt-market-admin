import { notFound } from "next/navigation";

import { ModulePlaceholder } from "@/components/common/module-placeholder";
import { adminMenu } from "@/configs/menu";

type AdminModulePageProps = {
  params: Promise<{
    module: string;
  }>;
};

export default async function AdminModulePage({ params }: AdminModulePageProps) {
  const { module } = await params;
  const exists = adminMenu.some((item) => item.module === module);

  if (!exists || module === "dashboard") {
    notFound();
  }

  return <ModulePlaceholder module={module} />;
}

