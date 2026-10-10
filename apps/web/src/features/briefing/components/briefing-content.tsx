import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@paddy-field/ui/components/badge";
import { Button } from "@paddy-field/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@paddy-field/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@paddy-field/ui/components/table";
import Image from "next/image";
import Link from "next/link";

import { AppLogo } from "@/components/app-logo";
import { ModeToggle } from "@/components/mode-toggle";
import { RiceSeasonChart } from "@/features/briefing/components/rice-season-chart";
import { RotationExplorer } from "@/features/briefing/components/rotation-explorer";
import { TeamCarousel } from "@/features/briefing/components/team-carousel";

import heroImage from "../../../../public/daisies.webp";
import akmalPhoto from "../../../../public/members/akmal.webp";
import ariqPhoto from "../../../../public/members/ariq.webp";
import falifPhoto from "../../../../public/members/falif.webp";
import nadyaPhoto from "../../../../public/members/nadya.webp";
import zakiPhoto from "../../../../public/members/zaki.webp";
import spaceAppsLogo from "../../../../public/nasa_space_apps_challenge.png";

export function BriefingContent() {
  return (
    <div data-page="briefing" className="min-h-svh overflow-x-clip bg-background text-foreground">
      <header className="fixed inset-x-3 top-3 z-30 mx-auto flex max-w-5xl items-center gap-1 rounded-full border border-black/6 glass py-1.5 pr-1.5 pl-4 sm:inset-x-6">
        <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold">
          <AppLogo />
          One Field
        </Link>
        <nav aria-label="Briefing sections" className="ml-auto hidden sm:flex">
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#try" />}>
            Try it
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#success" />}>
            Success
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#road" />}>
            Road
          </Button>
        </nav>
        <Button
          variant="outline"
          className="mr-1 ml-auto shrink-0 sm:ml-0"
          nativeButton={false}
          render={<Link href="/plan" />}
        >
          Full PRD
        </Button>
        <ModeToggle />
      </header>

      <main>
        <Hero />
        <Challenge />
        <Problem />
        <TryIt />
        <FiveTaps />
        <Success />
        <TwoUsers />
        <Ingredients />
        <NotBuilding />
        <Road />
        <Risks />
        <Team />
        <OpenDecisions />
      </main>
    </div>
  );
}

function Hero() {
  const facts = [
    { value: "14–15 Nov", label: "Hackathon" },
    { value: "All of Java", label: "Kecamatan level" },
    { value: "3 seasons", label: "Rainy · early dry · late dry" },
    { value: "4 inputs", label: "NASA · soil · crop · priority" },
  ];

  return (
    <section className="relative isolate flex min-h-svh items-end overflow-hidden">
      <Image
        src={heroImage}
        alt="Impressionist oil painting of cream daisies in a field under a teal sky"
        fill
        loading="eager"
        fetchPriority="high"
        placeholder="blur"
        sizes="100vw"
        className="briefing-hero-image -z-10 object-cover object-center dark:brightness-75"
      />
      <div className="from-deep-teal/85 via-deep-teal/55 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent from-60% to-background" />

      <div className="mx-auto w-full max-w-5xl px-4 pt-28 pb-12 sm:px-6 sm:pt-32 sm:pb-24">
        <div className="briefing-rise">
          <Image
            src={spaceAppsLogo}
            alt="NASA Space Apps Challenge"
            loading="eager"
            className="h-10 w-auto sm:h-14"
          />
        </div>
        <h1 className="briefing-rise text-display-xl text-cream mt-5 max-w-3xl font-heading font-semibold text-balance drop-shadow-lg">
          Plant what the <span className="font-light">sky</span> can carry.
        </h1>
        <p className="briefing-rise text-cream/90 mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
          A crop rotation tool for Java farmers and landowners. Compare three seasons of rice,
          maize, and soybean against NASA rain and soil-moisture data for your area.
        </p>
        <div className="briefing-rise mt-8 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
          {facts.map(function renderFact(fact) {
            return (
              <Card key={fact.value} size="sm" className="min-w-0">
                <CardContent>
                  <p className="font-medium tabular-nums">{fact.value}</p>
                  <p className="text-xs text-muted-foreground">{fact.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="briefing-reveal max-w-2xl">
      <Badge>{eyebrow}</Badge>
      <h2 className="text-display mt-3 font-heading font-semibold text-balance">{title}</h2>
      {children ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {children}
        </p>
      ) : null}
    </div>
  );
}

function Challenge() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <blockquote className="briefing-reveal text-display-sm font-heading font-medium">
        “Create a decision‑support tool that uses NASA Earth observations along with{" "}
        <mark className="bg-transparent text-primary">local soil information</mark>,{" "}
        <mark className="bg-transparent text-primary">crop characteristics</mark>, and{" "}
        <mark className="bg-transparent text-primary">farmer priorities</mark> to help farmers
        explore rotation strategies.”
      </blockquote>
      <p className="briefing-reveal mt-6 text-sm text-muted-foreground">
        The Field Shift challenge text. Judges score Impact, Creativity, Validity, Relevance, and
        Presentation.
      </p>
    </section>
  );
}

function Problem() {
  return (
    <section className="bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:gap-12">
        <SectionHeading eyebrow="The problem" title="Rice. Rice. Rice.">
          Many Java farmers plant rice in every season, also when the rain is too low. This uses a
          lot of water and gives the soil no rest. Farmers have no simple way to compare other
          rotations against the rain in their own area.
        </SectionHeading>
        <div className="briefing-reveal">
          <Card>
            <CardHeader>
              <CardTitle>Rice, three seasons in a row</CardTitle>
              <CardDescription>Part of rice water need that normal rain covers.</CardDescription>
            </CardHeader>
            <CardContent>
              <RiceSeasonChart />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Example area. Rain only, no irrigation.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

function TryIt() {
  return (
    <section
      id="try"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
    >
      <SectionHeading eyebrow="Try the idea" title="Three seasons. Four plans. Your call.">
        Pick a soil type and a priority. The plans change their order, but the tool never hides a
        plan. Rice–rice–rice always stays as the baseline.
      </SectionHeading>
      <div className="briefing-reveal mt-10">
        <RotationExplorer />
      </div>
    </section>
  );
}

function FiveTaps() {
  const steps = [
    {
      code: "F1",
      title: "Find my field",
      body: "Search a village, tap the map, or tap an FTW outline.",
    },
    {
      code: "F2",
      title: "Soil and priority",
      body: "Clay, loam, sandy, or “I do not know”. Then one goal.",
    },
    {
      code: "F3",
      title: "Compare plans",
      body: "Rain cover, soil fit, and a soil note for each season.",
    },
    { code: "F4", title: "See why", body: "Each number opens its source, period, and grid scale." },
    { code: "F5", title: "Save or share", body: "Send the plan to the person who farms the land." },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The farmer flow"
          title="From open to decided in under 3 minutes."
        />
      </div>
      <ol className="mx-auto mt-8 grid max-w-5xl gap-3 px-4 sm:mt-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        {steps.map(function renderStep(step, index) {
          return (
            <li
              key={step.code}
              className="briefing-reveal flex min-w-0 sm:last:col-span-2 lg:last:col-span-1"
            >
              <Card className="w-full" size="sm">
                <CardHeader>
                  <div className="flex items-start gap-4 sm:flex-col">
                    <p className="font-heading text-5xl font-semibold text-primary tabular-nums">
                      {index + 1}
                    </p>
                    <div className="grid min-w-0 gap-1">
                      <CardTitle>{step.title}</CardTitle>
                      <CardDescription>{step.body}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Badge variant="secondary">{step.code}</Badge>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Success() {
  const kpis = [
    {
      value: "4 of 5",
      title: "Farmer task",
      body: "Test users choose a plan without help, in 3 minutes or less.",
      criterion: "Impact",
    },
    {
      value: "4 of 5",
      title: "Understanding",
      body: "Test users say why their plan saves water or helps the soil.",
      criterion: "Impact · Validity",
    },
    {
      value: "100%",
      title: "Java coverage",
      body: "Every kecamatan shows plans, or a reason why data is missing.",
      criterion: "Validity",
    },
    {
      value: "100%",
      title: "Evidence tracing",
      body: "Every number links to a source, period, and spatial scale.",
      criterion: "Validity",
    },
    {
      value: "4 / 4",
      title: "Challenge fit",
      body: "NASA data, local soil, crop traits, and farmer priority.",
      criterion: "Relevance",
    },
  ];

  return (
    <section
      id="success"
      className="to-deep-teal scroll-mt-24 bg-linear-to-br from-brand py-14 text-brand-foreground sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="briefing-reveal max-w-2xl">
          <Badge variant="secondary">Success criteria</Badge>
          <h2 className="text-display mt-3 font-heading font-semibold">
            How we will know it works.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-foreground/80 sm:text-lg">
            Each target maps to a judging criterion. We measure them before we submit on 15
            November.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-5">
          {kpis.map(function renderKpi(kpi) {
            return (
              <div
                key={kpi.title}
                className="briefing-reveal flex min-w-0 sm:last:col-span-2 lg:last:col-span-1"
              >
                <Card className="w-full">
                  <CardHeader>
                    <p className="font-heading text-4xl font-semibold tracking-tight tabular-nums">
                      {kpi.value}
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-1">
                    <CardTitle>{kpi.title}</CardTitle>
                    <CardDescription>{kpi.body}</CardDescription>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Badge variant="secondary">{kpi.criterion}</Badge>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
        <p className="briefing-reveal mt-6 text-sm text-brand-foreground/80">
          Secondary target: a PPL or district staff member finds the 10 kecamatan with the largest
          dry-season water gap in one province, in 2 minutes or less.
        </p>
      </div>
    </section>
  );
}

function TwoUsers() {
  const users = [
    {
      role: "Main user",
      title: "The farmer or landowner",
      body: "The person who decides what is planted. The owner may farm the land or rent it out.",
      decision:
        "Which rotation to follow, or to discuss with the tenant, for the next three seasons.",
      span: "md:col-span-3",
    },
    {
      role: "Secondary user",
      title: "District staff",
      body: "One view that sorts kecamatan by the dry-season water gap for rice.",
      decision: "Where legume seed and PPL visits go first.",
      span: "md:col-span-2",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Users" title="Two users. One set of evidence." />
      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {users.map(function renderUser(user) {
          return (
            <div key={user.title} className={user.span}>
              <div className="briefing-reveal flex h-full">
                <Card className="w-full">
                  <CardHeader>
                    <Badge variant="secondary">{user.role}</Badge>
                    <CardTitle>{user.title}</CardTitle>
                    <CardDescription>{user.body}</CardDescription>
                  </CardHeader>
                  <CardFooter className="mt-auto">
                    <div className="grid gap-0.5">
                      <p className="font-medium">Decision</p>
                      <p className="text-muted-foreground">{user.decision}</p>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Ingredients() {
  const sources = [
    { name: "IMERG", owner: "NASA", role: "Normal rain per season, 2001–2025", scale: "10 km" },
    {
      name: "POWER",
      owner: "NASA",
      role: "Min and max temperature for crop water use",
      scale: "Point",
    },
    {
      name: "SMAP L4",
      owner: "NASA",
      role: "Root-zone moisture now, compared to normal",
      scale: "9 km",
    },
    {
      name: "KATAM",
      owner: "Kementan",
      role: "Planting windows and crops per kecamatan",
      scale: "Kecamatan",
    },
    {
      name: "BIG",
      owner: "Indonesia",
      role: "Kecamatan boundaries for all of Java",
      scale: "Boundary",
    },
    {
      name: "FTW 2025",
      owner: "Fields of The World",
      role: "Predicted field outlines on the map",
      scale: "Field",
    },
    {
      name: "You",
      owner: "The farmer",
      role: "Soil type and one priority, in 2 taps",
      scale: "Your field",
    },
  ];

  return (
    <section className="bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="What goes in" title="Seven ingredients, each at its own scale.">
          A 10 km rain cell is not your field. The tool shows the scale of every number, so a large
          cell never looks like field data.
        </SectionHeading>
        <div className="briefing-reveal mt-10">
          <Card>
            <CardContent className="px-4 sm:px-2">
              <dl className="grid gap-5 sm:hidden">
                {sources.map(function renderMobileSource(source) {
                  return (
                    <div key={source.name} className="grid grid-cols-2 items-start gap-x-3 gap-y-1">
                      <dt className="min-w-0">
                        <p className="font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">{source.owner}</p>
                      </dt>
                      <dd>
                        <Badge variant="secondary">{source.scale}</Badge>
                      </dd>
                      <dd className="col-span-2 text-muted-foreground">{source.role}</dd>
                    </div>
                  );
                })}
              </dl>
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Use</TableHead>
                      <TableHead className="text-right">Scale</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map(function renderSource(source) {
                      return (
                        <TableRow key={source.name}>
                          <TableCell>
                            <p className="font-medium">{source.name}</p>
                            <p className="text-xs text-muted-foreground">{source.owner}</p>
                          </TableCell>
                          <TableCell className="whitespace-normal">{source.role}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{source.scale}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function NotBuilding() {
  const nonGoals = [
    "Price, profit, or yield predictions",
    "Irrigation, fertilizer, or pest advice",
    "A checked recommendation for one field",
    "Soil tests, crop history, or land ownership",
    "User accounts and export versioning",
    "An AI chat assistant",
    "Crop detection from HLS images",
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Non-goals" title="What we will not build.">
        Two days is short. These stay out, so the core flow can be good.
      </SectionHeading>
      <ul className="briefing-reveal mt-10 flex flex-wrap gap-2">
        {nonGoals.map(function renderNonGoal(nonGoal) {
          return (
            <li key={nonGoal}>
              <Badge variant="outline" className="h-auto max-w-full whitespace-normal">
                <s className="decoration-primary decoration-2">{nonGoal}</s>
              </Badge>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Road() {
  const phases = [
    {
      name: "Prep",
      date: "Now → 13 Nov",
      body: "Prepare Java data. Write the crop table and rule tests. Test with 5 farmers.",
      current: true,
    },
    {
      name: "MVP",
      date: "14–15 Nov",
      body: "Farmer flow F1–F5 and the district view. Demo video and project page.",
    },
    {
      name: "v1.1",
      date: "Dec – Jan",
      body: "Last season’s crop and water source inputs. Optional SoilGrids default.",
    },
    {
      name: "v2.0",
      date: "2027",
      body: "A local agronomist reviews the plans. More crops. Price data if reliable.",
    },
  ];

  return (
    <section id="road" className="scroll-mt-24 bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="Roadmap" title="The road to 15 November." />
        <ol className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map(function renderPhase(phase) {
            return (
              <li
                key={phase.name}
                className={
                  phase.current
                    ? "briefing-reveal flex rounded-4xl ring-2 ring-primary"
                    : "briefing-reveal flex"
                }
              >
                <Card className="w-full">
                  <CardHeader>
                    <CardDescription>{phase.date}</CardDescription>
                    <CardTitle>{phase.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{phase.body}</p>
                  </CardContent>
                  {phase.current ? (
                    <CardFooter className="mt-auto">
                      <Badge>We are here</Badge>
                    </CardFooter>
                  ) : null}
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Risks() {
  const risks = [
    {
      risk: "Space Apps rules limit work before the event",
      response: "Read the rules now. Keep prep to data and research if needed.",
    },
    {
      risk: "KATAM access fails",
      response: "Use default season dates and say so. Try a dated manual import.",
    },
    {
      risk: "Java data takes too long to prepare",
      response: "Run by province, from now. Show “unavailable” until done.",
    },
    {
      risk: "Irrigation is unknown",
      response: "Label rain cover as “rain only”. Add water source in v1.1.",
    },
    {
      risk: "Crop table or soil rules are wrong",
      response: "A source for each row. PPL review. Rule tests fix the output.",
    },
    {
      risk: "No farmers to test before the event",
      response: "Recruit now through family, PPL contacts, and farmer groups.",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Risks" title="What could go wrong, and what we do." />
      <div className="briefing-reveal mt-10">
        <Card>
          <CardContent className="px-4 sm:px-2">
            <dl className="grid gap-5 sm:hidden">
              {risks.map(function renderMobileRisk(item) {
                return (
                  <div key={item.risk} className="grid gap-1.5">
                    <dt className="font-medium">{item.risk}</dt>
                    <dd className="text-muted-foreground">{item.response}</dd>
                  </div>
                );
              })}
            </dl>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Risk</TableHead>
                    <TableHead>What we do</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map(function renderRisk(item) {
                    return (
                      <TableRow key={item.risk}>
                        <TableCell className="whitespace-normal">
                          <span className="font-medium">{item.risk}</span>
                        </TableCell>
                        <TableCell className="whitespace-normal">
                          <span className="text-muted-foreground">{item.response}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function Team() {
  const members = [
    { name: "Nadya", title: "Product & Business Lead", photo: nadyaPhoto },
    { name: "Ariq", title: "Product Design Engineer", photo: ariqPhoto },
    { name: "Zaki", title: "Agronomy & Research Lead", photo: zakiPhoto },
    { name: "Akmal", title: "AI & Software Engineer", photo: akmalPhoto },
    { name: "Falif", title: "Earth Data Engineer", photo: falifPhoto },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="The team" title="Five people. One Field.">
          The people behind One Field.
        </SectionHeading>
      </div>
      <div className="briefing-reveal mt-10">
        <TeamCarousel members={members} />
      </div>
    </section>
  );
}

function OpenDecisions() {
  const decisions = [
    "Confirm the Space Apps rules on work before 14 November.",
    "Confirm the KATAM access path.",
    "Approve the crop list, the plan sets, and the crop-table sources.",
    "Decide if SoilGrids can be a fourth data source in v1.1.",
    "Set the team size, the phone, and the network targets.",
  ];

  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={heroImage}
        alt=""
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover object-bottom opacity-40 dark:opacity-25"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-background via-background/70 to-background/40" />
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <SectionHeading eyebrow="Open decisions" title="Five answers we still need." />
        <ol className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 lg:grid-cols-5">
          {decisions.map(function renderDecision(decision, index) {
            return (
              <li
                key={decision}
                className="briefing-reveal flex min-w-0 sm:last:col-span-2 lg:last:col-span-1"
              >
                <Card className="w-full">
                  <CardHeader>
                    <p className="font-heading text-3xl font-semibold text-primary tabular-nums">
                      {index + 1}
                    </p>
                  </CardHeader>
                  <CardContent>{decision}</CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
        <div className="briefing-reveal mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button
            variant="neutral"
            size="lg"
            className="group"
            nativeButton={false}
            render={<Link href="/plan" />}
          >
            Read the full PRD
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              data-icon="inline-end"
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </Button>
          <p className="text-sm text-muted-foreground">
            Draft for review · 30 September 2026 · Data: NASA, FTW, BIG, KATAM
          </p>
        </div>
      </div>
    </section>
  );
}
