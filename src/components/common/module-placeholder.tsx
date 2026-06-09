import { adminMenu } from "@/configs/menu";
import { PageHeader } from "@/components/common/page-header";

type ModulePlaceholderProps = {
  module: string;
};

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const menuItem = adminMenu.find((item) => item.module === module);
  const title = menuItem?.title ?? "Module";

  return (
    <div className="space-y-6">
      <PageHeader
        description="Noi dung quan tri cho module nay se duoc phat trien trong cac buoc tiep theo."
        title={title}
      />

      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-base font-semibold">Dang chuan bi</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Noi dung quan tri cho module nay se duoc phat trien trong cac buoc tiep theo.
        </p>
      </section>
    </div>
  );
}
