"use client";

import { InboxIcon, Leaf01Icon, Notification01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@paddy-field/ui/components/accordion";
import { Alert, AlertDescription, AlertTitle } from "@paddy-field/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@paddy-field/ui/components/alert-dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@paddy-field/ui/components/avatar";
import { Badge } from "@paddy-field/ui/components/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@paddy-field/ui/components/breadcrumb";
import { Button } from "@paddy-field/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@paddy-field/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@paddy-field/ui/components/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@paddy-field/ui/components/empty";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@paddy-field/ui/components/hover-card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@paddy-field/ui/components/item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@paddy-field/ui/components/pagination";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@paddy-field/ui/components/popover";
import { Progress, ProgressLabel, ProgressValue } from "@paddy-field/ui/components/progress";
import { Separator } from "@paddy-field/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@paddy-field/ui/components/sheet";
import { Skeleton } from "@paddy-field/ui/components/skeleton";
import { Spinner } from "@paddy-field/ui/components/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@paddy-field/ui/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@paddy-field/ui/components/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@paddy-field/ui/components/tooltip";
import { toast } from "sonner";

import { ShowcaseBlock, ShowcaseSection } from "./showcase-section";

const fields = [
  { id: "SW-0142", name: "Sawah Barat", crop: "Rice (IR64)", stage: "Tillering", status: "On track" },
  { id: "SW-0143", name: "Sawah Timur", crop: "Rice (Ciherang)", stage: "Booting", status: "Needs water" },
  { id: "SW-0151", name: "Kebun Selatan", crop: "Corn", stage: "Harvest", status: "Ready" },
];

const statusBadgeVariant: Record<string, "brand" | "destructive" | "secondary"> = {
  "On track": "secondary",
  "Needs water": "destructive",
  Ready: "brand",
};

export function ComponentsSection() {
  return (
    <>
      <ShowcaseSection
        id="navigation"
        title="Navigation"
        description="Pill tabs and quiet links. The active item gets the strongest contrast."
      >
        <div className="grid gap-10 lg:grid-cols-2">
          <ShowcaseBlock title="Tabs">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="weather">Weather</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
                Three fields are on track this week.
              </TabsContent>
              <TabsContent value="weather" className="pt-3 text-sm text-muted-foreground">
                Heavy rain on Thursday afternoon.
              </TabsContent>
              <TabsContent value="tasks" className="pt-3 text-sm text-muted-foreground">
                Clean the north water gate.
              </TabsContent>
            </Tabs>
          </ShowcaseBlock>

          <ShowcaseBlock title="Breadcrumb and pagination">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#navigation">Farm</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#navigation">Fields</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Sawah Barat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Pagination className="justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#navigation" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#navigation">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#navigation" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#navigation">9</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#navigation" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </ShowcaseBlock>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="data-display"
        title="Data display"
        description="White cards float on cream with soft shadows. No borders."
        className="bg-surface-sand/40"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Sawah Barat</CardTitle>
              <CardDescription>Rice (IR64) · 2.4 ha</CardDescription>
              <CardAction>
                <Badge variant="brand">On track</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <Progress value={62}>
                <ProgressLabel>Season progress</ProgressLabel>
                <ProgressValue />
              </Progress>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">
                Open field
              </Button>
            </CardFooter>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Loading card</CardTitle>
              <CardDescription>Skeletons keep the layout still.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>People who can edit this farm.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <AvatarGroup>
                <Avatar>
                  <AvatarImage src="/missing-avatar.png" alt="Sari" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>BU</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>DW</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+4</AvatarGroupCount>
              </AvatarGroup>
              <Item variant="muted" size="sm">
                <ItemMedia variant="icon">
                  <HugeiconsIcon icon={Leaf01Icon} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Fertilize Sawah Timur</ItemTitle>
                  <ItemDescription>Due tomorrow, 07:00</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size="sm" variant="ghost">
                    Done
                  </Button>
                </ItemActions>
              </Item>
            </CardContent>
          </Card>
        </div>

        <ShowcaseBlock title="Table">
          <div className="rounded-4xl bg-card p-2 shadow-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Crop</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-mono text-xs">{field.id}</TableCell>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.crop}</TableCell>
                    <TableCell>{field.stage}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={statusBadgeVariant[field.status]}>{field.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ShowcaseBlock>

        <ShowcaseBlock title="Accordion">
          <Accordion className="rounded-4xl bg-card px-6 shadow-card">
            <AccordionItem value="when">
              <AccordionTrigger>When should I plant?</AccordionTrigger>
              <AccordionContent>
                Plant after the first two weeks of steady rain, when the soil stays wet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="water">
              <AccordionTrigger>How much water does rice need?</AccordionTrigger>
              <AccordionContent>
                Keep 2–5 cm of water in the field during tillering. Let it dry before harvest.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ShowcaseBlock>
      </ShowcaseSection>

      <ShowcaseSection
        id="feedback"
        title="Feedback"
        description="Short, friendly messages. Red only when something is wrong."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Alert>
              <HugeiconsIcon icon={Notification01Icon} />
              <AlertTitle>Rain on Thursday</AlertTitle>
              <AlertDescription>Plant the seedlings before Wednesday evening.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <HugeiconsIcon icon={Notification01Icon} />
              <AlertTitle>Pest report in Sawah Timur</AlertTitle>
              <AlertDescription>Brown planthoppers seen on 3 plots. Check today.</AlertDescription>
            </Alert>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => toast.success("Plan saved")}>
                Show toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.error("Could not reach the weather service")}
              >
                Show error toast
              </Button>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner /> Syncing fields
              </span>
            </div>
          </div>
          <Empty className="rounded-4xl bg-card shadow-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={InboxIcon} />
              </EmptyMedia>
              <EmptyTitle>No fields yet</EmptyTitle>
              <EmptyDescription>Draw your first field on the map to get a plan.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Draw a field</Button>
            </EmptyContent>
          </Empty>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="overlays"
        title="Overlays"
        description="Floating layers on white with soft shadows. Each button opens what it says."
        className="bg-surface-sand/40"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="secondary" />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename field</DialogTitle>
                <DialogDescription>Farmers will see the new name right away.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                <DialogClose render={<Button />}>Save</DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Open alert dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Sawah Barat?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the field and its season history. You cannot undo this.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep field</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet>
            <SheetTrigger render={<Button variant="secondary" />}>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Field details</SheetTitle>
                <SheetDescription>Sawah Barat · Rice (IR64) · 2.4 ha</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <Popover>
            <PopoverTrigger render={<Button variant="secondary" />}>Open popover</PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Soil moisture</PopoverTitle>
                <PopoverDescription>82% at 10 cm depth, measured 12 minutes ago.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="secondary" />}>Open menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Field</DropdownMenuLabel>
                <DropdownMenuItem>Rename</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger render={<Button variant="secondary" />}>Hover for tooltip</TooltipTrigger>
            <TooltipContent>Works</TooltipContent>
          </Tooltip>

          <HoverCard>
            <HoverCardTrigger render={<Button variant="link" />}>@koperasi-makmur</HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">Koperasi Tani Makmur</p>
                <p className="text-sm text-muted-foreground">42 farmers · 118 ha in Sleman</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Separator />
      </ShowcaseSection>
    </>
  );
}
