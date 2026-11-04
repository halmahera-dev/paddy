"use client";

import {
  ComputerIcon,
  LanguageSkillIcon,
  LogoutSquare02Icon,
  MoonFastWindIcon,
  MoreVerticalCircle01Icon,
  PaintBoardIcon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Avatar, AvatarFallback } from "@hollou/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@hollou/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@hollou/ui/components/sidebar";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { hasLocale, type Dictionary, type Locale } from "@/lib/i18n";

export function NavUser({
  name,
  email,
  locale,
  labels,
}: {
  name: string;
  email: string;
  locale: Locale;
  labels: Dictionary["common"];
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function logOut() {
    authClient.signOut({
      fetchOptions: {
        onSuccess() {
          router.push(`/${locale}/landing`);
          router.refresh();
        },
      },
    });
  }

  function setLocale(next: string) {
    if (!hasLocale(next) || next === locale) return;
    router.push(pathname.replace(`/${locale}`, `/${next}`));
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
            <Avatar className="size-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-foreground">{name}</span>
              <span className="truncate text-xs text-muted-foreground">{email}</span>
            </div>
            <HugeiconsIcon icon={MoreVerticalCircle01Icon} className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={LanguageSkillIcon} />
                {labels.language}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={locale} onValueChange={setLocale}>
                    <DropdownMenuRadioItem value="id">{labels.indonesian}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">{labels.english}</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon icon={PaintBoardIcon} />
                {labels.theme}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">
                      <HugeiconsIcon icon={Sun03Icon} />
                      {labels.light}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      <HugeiconsIcon icon={MoonFastWindIcon} />
                      {labels.dark}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="system">
                      <HugeiconsIcon icon={ComputerIcon} />
                      {labels.system}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logOut}>
              <HugeiconsIcon icon={LogoutSquare02Icon} />
              {labels.logOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
