"use client";

import {
  Add01Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@paddy-field/ui/components/badge";
import { Button } from "@paddy-field/ui/components/button";
import { ButtonGroup, ButtonGroupSeparator } from "@paddy-field/ui/components/button-group";
import { Checkbox } from "@paddy-field/ui/components/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@paddy-field/ui/components/field";
import { Input } from "@paddy-field/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@paddy-field/ui/components/input-group";
import { Kbd } from "@paddy-field/ui/components/kbd";
import { NativeSelect, NativeSelectOption } from "@paddy-field/ui/components/native-select";
import { RadioGroup, RadioGroupItem } from "@paddy-field/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@paddy-field/ui/components/select";
import { Slider } from "@paddy-field/ui/components/slider";
import { Spinner } from "@paddy-field/ui/components/spinner";
import { Switch } from "@paddy-field/ui/components/switch";
import { Textarea } from "@paddy-field/ui/components/textarea";
import { Toggle } from "@paddy-field/ui/components/toggle";
import { ToggleGroup, ToggleGroupItem } from "@paddy-field/ui/components/toggle-group";

import { ShowcaseBlock, ShowcaseSection } from "./showcase-section";
import { StateMatrix, previewState } from "./state-matrix";

const buttonVariants = [
  "default",
  "brand",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "link",
] as const;

const badgeVariants = ["default", "brand", "secondary", "outline", "destructive", "blur"] as const;

const cropItems = [
  { label: "Rice (IR64)", value: "rice" },
  { label: "Corn", value: "corn" },
  { label: "Soybean", value: "soybean" },
];

export function ControlsSection() {
  return (
    <>
      <ShowcaseSection
        id="actions"
        title="Actions"
        description="Pills only. The main action is ink, not emerald. Emerald marks state and small highlights."
      >
        <ShowcaseBlock
          title="Button"
          description="One ink primary per group. Brand emerald is for confirming field actions such as Start planting."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              Book a call
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Button>
            <Button variant="brand">Start planting</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
          <StateMatrix
            rows={buttonVariants}
            states={["default", "hover", "focus", "active", "disabled", "loading"]}
            render={(variant, state) => (
              <Button
                variant={variant}
                {...previewState(state)}
                disabled={state === "disabled" || state === "loading"}
              >
                {state === "loading" && <Spinner data-icon="inline-start" />}
                Save plan
              </Button>
            )}
          />
        </ShowcaseBlock>

        <div className="grid gap-10 lg:grid-cols-2">
          <ShowcaseBlock title="Sizes and icons" description="Smallest to largest, then icon-only.">
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra small</Button>
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary">
                <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                Add field
              </Button>
              <Button variant="outline" size="icon" aria-label="Settings">
                <HugeiconsIcon icon={Settings01Icon} />
              </Button>
              <Button variant="destructive" size="icon" aria-label="Delete field">
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
              <Button variant="secondary" className="max-w-56">
                <span className="truncate">Export harvest report for Sawah Barat North Block</span>
              </Button>
            </div>
          </ShowcaseBlock>

          <ShowcaseBlock title="Button group, toggle, kbd">
            <ButtonGroup>
              <Button variant="secondary">Day</Button>
              <ButtonGroupSeparator />
              <Button variant="secondary">Week</Button>
              <ButtonGroupSeparator />
              <Button variant="secondary">Season</Button>
            </ButtonGroup>
            <div className="flex flex-wrap items-center gap-3">
              <ToggleGroup defaultValue={["map"]}>
                <ToggleGroupItem value="map">Map</ToggleGroupItem>
                <ToggleGroupItem value="list">List</ToggleGroupItem>
                <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
              </ToggleGroup>
              <Toggle aria-label="Show rain layer">Rain layer</Toggle>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                Press <Kbd>D</Kbd> to switch theme
              </span>
            </div>
          </ShowcaseBlock>
        </div>

        <ShowcaseBlock title="Badge" description="Pills for status. Red only for urgency.">
          <div className="flex flex-wrap items-center gap-2">
            {badgeVariants.map((variant) => (
              <Badge key={variant} variant={variant}>
                {variant}
              </Badge>
            ))}
            <Badge variant="destructive">1 spot left!</Badge>
            <Badge variant="brand">Ready to harvest</Badge>
          </div>
        </ShowcaseBlock>
      </ShowcaseSection>

      <ShowcaseSection
        id="inputs"
        title="Inputs"
        description="Soft pill fields on a warm fill. Focus shows an emerald ring."
        className="bg-surface-sand/40"
      >
        <ShowcaseBlock title="Input states">
          <StateMatrix
            rows={["input"] as const}
            states={["default", "hover", "focus", "disabled", "invalid"]}
            render={(_, state) => (
              <Input
                placeholder="Field name"
                aria-invalid={state === "invalid" || undefined}
                {...previewState(state)}
              />
            )}
          />
        </ShowcaseBlock>

        <div className="grid gap-10 lg:grid-cols-2">
          <ShowcaseBlock title="Field" description="Label, help text, and error.">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="field-name">Field name</FieldLabel>
                <Input id="field-name" defaultValue="Sawah Barat" />
                <FieldDescription>Farmers see this name on their phone.</FieldDescription>
              </Field>
              <Field data-invalid>
                <FieldLabel htmlFor="field-area">Area (ha)</FieldLabel>
                <Input id="field-area" defaultValue="-2" aria-invalid />
                <FieldError>Area must be more than 0.</FieldError>
              </Field>
              <Field data-disabled>
                <FieldLabel htmlFor="field-owner">Owner</FieldLabel>
                <Input id="field-owner" defaultValue="Koperasi Tani Makmur" disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="field-notes">Notes</FieldLabel>
                <Textarea id="field-notes" placeholder="Water gate on the north side is broken." />
              </Field>
            </FieldGroup>
          </ShowcaseBlock>

          <ShowcaseBlock title="Selects and groups">
            <FieldGroup>
              <Field>
                <FieldLabel>Crop</FieldLabel>
                <Select items={cropItems} defaultValue="rice">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {cropItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="season">Season</FieldLabel>
                <NativeSelect id="season" defaultValue="wet">
                  <NativeSelectOption value="wet">Wet season</NativeSelectOption>
                  <NativeSelectOption value="dry">Dry season</NativeSelectOption>
                </NativeSelect>
              </Field>
              <Field>
                <FieldLabel htmlFor="search-fields">Search</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <HugeiconsIcon icon={Search01Icon} />
                  </InputGroupAddon>
                  <InputGroupInput id="search-fields" placeholder="Find a field" />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>12 results</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel>Water level target</FieldLabel>
                <Slider defaultValue={40} max={100} aria-label="Water level target" />
              </Field>
            </FieldGroup>
          </ShowcaseBlock>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <ShowcaseBlock title="Choices">
            <FieldSet>
              <FieldLegend>Irrigation</FieldLegend>
              <RadioGroup defaultValue="alternate">
                <Field orientation="horizontal">
                  <RadioGroupItem value="alternate" id="irrigation-alternate" />
                  <FieldLabel htmlFor="irrigation-alternate">Alternate wetting and drying</FieldLabel>
                </Field>
                <Field orientation="horizontal">
                  <RadioGroupItem value="continuous" id="irrigation-continuous" />
                  <FieldLabel htmlFor="irrigation-continuous">Continuous flooding</FieldLabel>
                </Field>
              </RadioGroup>
            </FieldSet>
          </ShowcaseBlock>

          <ShowcaseBlock title="Toggles">
            <FieldGroup>
              <Field orientation="horizontal">
                <Checkbox id="notify-rain" defaultChecked />
                <FieldContent>
                  <FieldLabel htmlFor="notify-rain">Rain alerts</FieldLabel>
                  <FieldDescription>Send a message one day before heavy rain.</FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Switch id="share-team" defaultChecked />
                <FieldLabel htmlFor="share-team">Share plan with the team</FieldLabel>
              </Field>
              <Field orientation="horizontal" data-disabled>
                <Switch id="auto-order" disabled />
                <FieldLabel htmlFor="auto-order">Auto-order fertilizer</FieldLabel>
              </Field>
            </FieldGroup>
          </ShowcaseBlock>
        </div>
      </ShowcaseSection>
    </>
  );
}
