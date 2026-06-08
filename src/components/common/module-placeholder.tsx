import { adminMenu } from "@/configs/menu";

type ModulePlaceholderProps = {
  module: string;
};

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const menuItem = adminMenu.find((item) => item.module === module);
  const title = menuItem?.title ?? "Module";

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Module</p>
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">
          {title}
        </h1>
      </section>

      <section className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h2 className="text-base font-semibold">Dang chuan bi</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Noi dung quan tri cho module nay se duoc phat trien trong cac buoc tiep theo.
        </p>
      </section>
    </div>
  );
}
