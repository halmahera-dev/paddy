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
import { RotationBenchFigure } from "@/features/briefing/components/rotation-bench/figure";
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
        <Link href="/" className="flex items-center gap-2 font-heading text-sm font-semibold">
          <AppLogo />
          One Field
        </Link>
        <nav aria-label="Briefing sections" className="ml-auto hidden md:flex">
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#rotation" />}>
            Rotation
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#data" />}>
            Data
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#try" />}>
            Try it
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#success" />}>
            Success
          </Button>
          <Button variant="ghost" size="sm" nativeButton={false} render={<a href="#road" />}>
            Roadmap
          </Button>
        </nav>
        <Button
          variant="outline"
          className="mr-1 ml-auto shrink-0 md:ml-0"
          nativeButton={false}
          render={<Link href="/plan" />}
        >
          Full plan
        </Button>
        <ModeToggle />
      </header>

      <main>
        <Hero />
        <Challenge />
        <Problem />
        <HowRotationWorks />
        <NasaData />
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
    { value: "14–15 Nov", label: "Hackathon dates" },
    { value: "All of Java", label: "Per kecamatan (sub-district)" },
    { value: "3 seasons", label: "Rainy, early dry, and late dry" },
    { value: "4 inputs", label: "NASA data, soil, crop, and priority" },
  ];

  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
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
      <div className="from-deep-teal/85 via-deep-teal/60 sm:from-deep-teal/80 sm:via-deep-teal/40 absolute inset-0 -z-10 bg-linear-to-r to-transparent" />
      <div className="to-deep-teal/70 absolute inset-0 -z-10 bg-linear-to-b from-transparent from-55%" />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-end px-4 pt-28 pb-10 sm:px-6 sm:pb-14">
        <div className="briefing-rise">
          <Image
            src={spaceAppsLogo}
            alt="NASA Space Apps Challenge"
            loading="eager"
            className="h-9 w-auto sm:h-12"
          />
        </div>
        <h1 className="briefing-rise text-cream mt-6 max-w-3xl type-display-xl text-balance drop-shadow-lg">
          Plant what the <span className="font-light">sky</span> can carry.
        </h1>
        <p className="briefing-rise text-cream/85 mt-6 max-w-lg text-base leading-relaxed text-pretty sm:text-lg">
          One Field is a crop rotation tool for farmers and landowners in Java. It compares rice,
          maize, and soybean over three seasons with NASA rain and soil moisture data for their
          area.
        </p>
      </div>

      <dl className="border-cream/15 mx-auto grid w-full max-w-5xl grid-cols-2 gap-x-6 gap-y-5 border-t px-4 py-6 sm:grid-cols-4 sm:px-6">
        {facts.map(function renderFact(fact) {
          return (
            <div key={fact.value} className="min-w-0">
              <dt className="text-cream/65 text-xs">{fact.label}</dt>
              <dd className="text-cream mt-1 font-medium tabular-nums">{fact.value}</dd>
            </div>
          );
        })}
      </dl>
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
      <h2 className="mt-3 type-display text-balance">{title}</h2>
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
      <blockquote className="briefing-reveal type-headline">
        “Create a decision‑support tool that uses NASA Earth observations along with{" "}
        <mark className="bg-transparent text-primary">local soil information</mark>,{" "}
        <mark className="bg-transparent text-primary">crop characteristics</mark>, and{" "}
        <mark className="bg-transparent text-primary">farmer priorities</mark> to help farmers
        explore rotation strategies.”
      </blockquote>
      <p className="briefing-reveal mt-6 text-sm text-muted-foreground">
        This is the text of the Field Shift challenge. Judges score Impact, Creativity, Validity,
        Relevance, and Presentation.
      </p>
    </section>
  );
}

function Problem() {
  return (
    <section className="bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-2 md:items-center lg:gap-12">
        <SectionHeading eyebrow="The problem" title="Many farmers plant rice in every season.">
          In Java, many farmers plant rice even when the rain is low, so the crop uses a lot of
          water and the soil never rests. Farmers have no simple way to compare other rotations with
          the rain in their own area.
        </SectionHeading>
        <div className="briefing-reveal">
          <Card>
            <CardHeader>
              <CardTitle>Rice in all three seasons</CardTitle>
              <CardDescription>How much of the rice water need normal rain covers</CardDescription>
            </CardHeader>
            <CardContent>
              <RiceSeasonChart />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                This is an example area, and the numbers count rain only, without irrigation.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

function HowRotationWorks() {
  const effects = [
    {
      title: "Fit the crop to the rain",
      body: "Rice needs about 1,000 mm of water in a season and about 200 mm more to flood the field first. Maize needs 450–500 mm and soybean needs 350–400 mm, but the late dry season gets only about 150 mm of rain.",
      fact: "−600 mm",
      factLabel: "Soybean instead of rice",
    },
    {
      title: "Let soybean fix nitrogen",
      body: "Bacteria on soybean roots take nitrogen from the air. The harvest removes most of it, so a legume helps the soil but does not replace fertilizer.",
      fact: "60–150 kg",
      factLabel: "Nitrogen per hectare",
    },
    {
      title: "Give the soil a dry season",
      body: "A paddy stays flooded, but a dry-land crop lets the soil drain and get air. Rice after rice also lets pests such as the brown planthopper move from one crop to the next.",
      fact: "1 of 3",
      factLabel: "Seasons without a flood",
    },
  ];

  return (
    <section
      id="rotation"
      className="mx-auto max-w-5xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-20 lg:py-24"
    >
      <SectionHeading
        eyebrow="How rotation works"
        title="A rotation changes the crop and keeps the field."
      >
        A rotation is the order of crops on one field. Java has three seasons each year, and each
        crop uses a different amount of water and gives the soil something different.
      </SectionHeading>
      <div className="briefing-reveal mt-10">
        <RotationBenchFigure />
      </div>
      <ol className="mt-8 grid gap-3 sm:mt-10 md:grid-cols-3">
        {effects.map(function renderEffect(effect) {
          return (
            <li key={effect.title} className="briefing-reveal flex min-w-0">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{effect.title}</CardTitle>
                  <CardDescription>{effect.body}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <div className="grid gap-0.5">
                    <p className="font-heading text-2xl font-semibold tracking-tight text-primary tabular-nums">
                      {effect.fact}
                    </p>
                    <p className="text-xs text-muted-foreground">{effect.factLabel}</p>
                  </div>
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ol>
      <p className="briefing-reveal mt-6 text-sm text-muted-foreground">
        The sources are FAO crop water needs, the TNAU rice guide, and Salvagiotti et al. 2008 for
        soybean nitrogen. The nitrogen dial gives a general guide, but it does not measure a field.
      </p>
    </section>
  );
}

function NasaData() {
  const datasets = [
    {
      name: "GPM IMERG",
      question: "How much rain does this season normally get?",
      body: "It gives monthly rain for 2001–2024, and we add the months of each season and average them over the kecamatan.",
      scale: "Final V07, 10 km",
    },
    {
      name: "NASA POWER",
      question: "How much water does the crop use here?",
      body: "Daily minimum and maximum temperatures give the reference water use (ETo), and FAO-56 crop factors change it into the crop water need.",
      scale: "Daily, 50 km",
    },
    {
      name: "SMAP L4",
      question: "Is the root zone wetter or drier than normal now?",
      body: "It models soil moisture down to 1 m deep, and we compare it with the same season in past years.",
      scale: "Every 3 hours, 9 km",
    },
  ];

  const steps = [
    { title: "Normal rain", source: "IMERG" },
    { title: "Crop water need", source: "POWER and FAO-56" },
    { title: "Rain cover", source: "Rain divided by need" },
    { title: "Soil note", source: "Rule table and soil type" },
    { title: "Plan order", source: "Farmer priority" },
  ];

  return (
    <section id="data" className="scroll-mt-24 bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="NASA data" title="Each NASA dataset answers one question.">
          The tool does not guess the best crop, but it shows how well normal rain covers each crop
          in each season for the farmer's area.
        </SectionHeading>

        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {datasets.map(function renderDataset(dataset) {
            return (
              <div key={dataset.name} className="briefing-reveal flex min-w-0">
                <Card className="w-full">
                  <CardHeader>
                    <CardDescription>{dataset.name}</CardDescription>
                    <CardTitle className="text-balance">{dataset.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{dataset.body}</p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Badge variant="secondary">{dataset.scale}</Badge>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="briefing-reveal mt-10">
          <Card>
            <CardHeader>
              <CardDescription>How one number is made</CardDescription>
              <p className="type-headline tracking-tight text-balance">
                Rain cover <span className="text-muted-foreground">=</span>{" "}
                <span className="text-primary">normal season rain</span>{" "}
                <span className="text-muted-foreground">÷</span>{" "}
                <span className="text-primary">Σ (Kc × ETo)</span>
              </p>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-x-3 gap-y-4 sm:grid-cols-5">
                {steps.map(function renderStep(step, index) {
                  return (
                    <li key={step.title} className="grid min-w-0 content-start gap-1 border-t pt-3">
                      <p className="text-xs text-muted-foreground tabular-nums">{index + 1}</p>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.source}</p>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                This number counts rain only, so it ignores irrigation and the water that farmers
                use to flood the field first. Use it to compare crops, not to measure one field.
              </p>
            </CardFooter>
          </Card>
        </div>

        <p className="briefing-reveal mt-6 max-w-2xl text-sm text-muted-foreground">
          We leave out HLS images and NDVI greenness, because they show that plants grow but not
          which crop grows or why. A rotation plan looks forward, so the decision uses rain,
          temperature, and soil moisture.
        </p>
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
      <SectionHeading eyebrow="Try the idea" title="Compare four plans over three seasons.">
        Pick a soil type and a priority, and the plans change their order. The tool never hides a
        plan, and the rice, rice, rice plan always stays so the farmer can compare with it.
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
      title: "Find the field",
      body: "Search for a village, tap the map, or tap a predicted field outline.",
    },
    {
      code: "F2",
      title: "Soil and priority",
      body: "Pick clay, loam, sandy, or “I do not know”, and then one priority.",
    },
    {
      code: "F3",
      title: "Compare plans",
      body: "See rain cover, soil fit, and a soil note for each season.",
    },
    { code: "F4", title: "See why", body: "Each number shows its source, time period, and scale." },
    { code: "F5", title: "Save or share", body: "Send the plan to the person who farms the land." },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Farmer steps"
          title="The farmer opens the tool and picks a plan in less than 3 minutes."
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
      title: "Plan without help",
      body: "Test users choose a plan without help in 3 minutes or less.",
      criterion: "Impact",
    },
    {
      value: "4 of 5",
      title: "Farmers know why",
      body: "Test users say why their plan saves water or helps the soil.",
      criterion: "Impact and Validity",
    },
    {
      value: "100%",
      title: "All of Java",
      body: "Every kecamatan shows plans or a reason for missing data.",
      criterion: "Validity",
    },
    {
      value: "100%",
      title: "Sources shown",
      body: "Every number links to its source, time period, and scale.",
      criterion: "Validity",
    },
    {
      value: "4 / 4",
      title: "All challenge inputs",
      body: "The tool uses NASA data, local soil, crop traits, and farmer priority.",
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
          <Badge variant="secondary">Our targets</Badge>
          <h2 className="mt-3 type-display">We use five targets to check that the tool works.</h2>
          <p className="mt-4 text-base leading-relaxed text-brand-foreground/80 sm:text-lg">
            Each target links to a judging area, and we measure the targets before we submit on 15
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
        <p className="briefing-rise mt-6 text-sm text-brand-foreground/80">
          Our second target is for district users. In 2 minutes or less, an agricultural extension
          officer (PPL) or district staff member finds the 10 kecamatan with the largest dry-season
          water gap in one province.
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
      body: "This person decides what to plant, and may farm the land or rent it out.",
      decision:
        "They choose which rotation to follow for the next three seasons, or which one to discuss with the tenant.",
      span: "md:col-span-3",
    },
    {
      role: "Second user",
      title: "District staff",
      body: "They use one view that sorts kecamatan by the dry-season water gap for rice.",
      decision: "They decide where legume seed and PPL visits go first.",
      span: "md:col-span-2",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Users" title="Two types of users see the same data." />
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
    { name: "IMERG", owner: "NASA", role: "Normal rain per season, 2001–2024", scale: "10 km" },
    {
      name: "POWER",
      owner: "NASA",
      role: "Minimum and maximum temperature for crop water use",
      scale: "Point",
    },
    {
      name: "SMAP L4",
      owner: "NASA",
      role: "Root-zone moisture now, compared with normal",
      scale: "9 km",
    },
    {
      name: "KATAM",
      owner: "Ministry of Agriculture",
      role: "Planting calendar with planting windows and crops per kecamatan",
      scale: "Kecamatan",
    },
    {
      name: "BIG",
      owner: "Indonesian mapping agency",
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
      name: "Farmer input",
      owner: "The farmer",
      role: "Soil type and one priority, in 2 taps",
      scale: "One field",
    },
  ];

  return (
    <section className="bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Inputs"
          title="The tool uses seven inputs, and each has its own scale."
        >
          A 10 km rain cell is not one farmer's field, so the tool shows the scale of every number.
          That way, a large cell never looks like field data.
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
    "User accounts and saved versions of exports",
    "An AI chat assistant",
    "Crop detection from HLS images",
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Not in this version" title="What we will not build.">
        The hackathon lasts only two days, so we leave these out and make the main flow work well.
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
      name: "Get ready",
      date: "Now to 13 Nov",
      body: "We prepare the Java data, write the crop table and rule tests, and test with 5 farmers.",
      current: true,
    },
    {
      name: "Hackathon build",
      date: "14–15 Nov",
      body: "We build farmer steps F1–F5 and the district view, and we make the demo video and project page.",
    },
    {
      name: "v1.1",
      date: "Dec – Jan",
      body: "We add inputs for last season’s crop and the water source, plus an optional SoilGrids default.",
    },
    {
      name: "v2.0",
      date: "2027",
      body: "A local agronomist reviews the plans, and we add more crops and price data if the data is reliable.",
    },
  ];

  return (
    <section id="road" className="scroll-mt-24 bg-muted/50 py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading eyebrow="Roadmap" title="Our steps before and after 15 November." />
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
      response:
        "We read the rules now, and if needed, we only do data and research work before the event.",
    },
    {
      risk: "We cannot get KATAM data",
      response:
        "We use default season dates and tell the user, and we also try a manual import that shows its date.",
    },
    {
      risk: "Java data takes too long to prepare",
      response:
        "We start now and process one province at a time, and the tool shows “unavailable” until a province is ready.",
    },
    {
      risk: "Irrigation is unknown",
      response: "We label rain cover as “rain only”, and we add the water source input in v1.1.",
    },
    {
      risk: "Crop table or soil rules are wrong",
      response: "Each row has a source, a PPL checks the rules, and rule tests check the output.",
    },
    {
      risk: "No farmers to test before the event",
      response: "We find test farmers now through family, PPL contacts, and farmer groups.",
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Risks" title="What can go wrong and how we respond." />
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
        <SectionHeading eyebrow="The team" title="Five people work on One Field.">
          Meet the people who build One Field.
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
    "Confirm how we get KATAM data.",
    "Approve the crop list, the plan sets, and the crop-table sources.",
    "Decide if SoilGrids can be a fourth data source in v1.1.",
    "Set the team size and the targets for phone and network.",
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
        <SectionHeading
          eyebrow="Still to decide"
          title="We still need answers to five questions."
        />
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
            Read the full plan
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              data-icon="inline-end"
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </Button>
          <p className="text-sm text-muted-foreground">
            Draft for review, 30 September 2026. Data from NASA, FTW, BIG, and KATAM.
          </p>
        </div>
      </div>
    </section>
  );
}
