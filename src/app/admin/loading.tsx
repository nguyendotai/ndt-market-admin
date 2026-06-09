import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="grid min-h-[calc(100dvh-8rem)] place-items-center">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <p className="font-medium">Dang tai du lieu</p>
        <p className="mt-1 text-sm text-muted-foreground">
          He thong dang chuan bi noi dung moi nhat.
        </p>
      </div>
    </div>
  );
}

