"use client";

import { NotificationIcon, StarsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@paddy-field/ui/components/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerFooter,
} from "@paddy-field/ui/components/drawer";
import { useIsMobile } from "@paddy-field/ui/hooks/use-mobile";
import React from "react";
import { toast } from "sonner";

export default function NotificationButton() {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "j" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toast]);

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger render={<Button size="icon" variant="outline" />}>
        <HugeiconsIcon icon={NotificationIcon} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>We&apos;ll prepare your order as soon as possible.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
