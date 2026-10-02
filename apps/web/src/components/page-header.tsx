import { SidebarTrigger } from "@paddy-field/ui/components/sidebar";
import { cn } from "@paddy-field/ui/lib/utils";

import NotificationButton from "./notification-button";

function PageHeader({
  className,
  title,
  children,
  ...props
}: Omit<React.ComponentProps<"header">, "title"> & {
  title?: React.ReactNode;
}) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "page-header-material sticky top-0 z-20 flex shrink-0 items-center gap-2 px-4 py-3 backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <SidebarTrigger />

      {title === undefined ? null : (
        // Keyed so a title that arrives late (Mastra generates thread titles
        // asynchronously) remounts and fades in rather than teleporting.
        <span
          key={typeof title === "string" ? title : undefined}
          className="truncate text-sm font-medium opacity-100 transition-opacity duration-200 ease-out motion-reduce:duration-0 starting:opacity-0"
        >
          {title}
        </span>
      )}

      {children}

      <div className="ml-auto">
        <NotificationButton />
      </div>
    </header>
  );
}

export { PageHeader };
