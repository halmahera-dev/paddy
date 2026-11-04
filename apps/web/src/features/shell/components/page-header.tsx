import { SidebarTrigger } from "@hollou/ui/components/sidebar";

// The sticky bar at the top of every desk page: menu, page name, actions.
export function PageHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="glass sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      <SidebarTrigger className="-ml-1" />
      <h1 className="truncate text-sm font-medium">{title}</h1>
      {actions ? <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
}
