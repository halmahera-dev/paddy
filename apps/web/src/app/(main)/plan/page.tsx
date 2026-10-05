import type { Metadata } from "next";

import { PageHeader } from "@/components/page-header";
import { DataFlow } from "@/features/plan/components/data-flow";

export const metadata: Metadata = {
  title: "Project Plan",
  description: "The One Field project plan for crop rotation choices with NASA data in Java.",
};

export default function PlanPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="Plan" />

      <DataFlow />

      <div className="px-4">
        <article className="typeset mx-auto max-w-3xl py-8">
          <p className="text-sm text-muted-foreground">
            Draft for review · <time dateTime="2026-09-30">September 30, 2026</time>
          </p>
          <h1>PRD: Field Shift Java — crop rotation choices with NASA data</h1>
          <p>
            This PRD targets the NASA Space Apps Challenge 2026 challenge{" "}
            <a href="https://www.spaceappschallenge.org/2026/challenges/field-shift-adapting-farms-with-nasa-data/">
              Field Shift: Adapting Farms with NASA Data
            </a>
            . The hackathon is on 14–15 November 2026. Judges score Impact, Creativity, Validity,
            Relevance, and Presentation.{" "}
            <a href="https://spaceappschallenge.org/resources/judging-awards-guide">
              Judging guide
            </a>
          </p>
          <blockquote>
            <p>
              “Create a decision‑support tool that uses NASA Earth observations along with local
              soil information, crop characteristics, and farmer priorities to help farmers explore
              rotation strategies that could strengthen soil health and adapt their farms to
              changing conditions.”
            </p>
          </blockquote>
          <p>
            Only the challenge summary is published now. Check this PRD again when the full
            challenge details and resources are published.
          </p>

          <h2>1. Executive Summary</h2>

          <h3>Problem Statement</h3>
          <p>
            Java farmers often plant rice in every season, including in dry seasons when rain is too
            low. This uses a lot of water and gives the soil no rest. Farmers and landowners do not
            have a simple way to compare other rotations against the rain and moisture in their own
            area.
          </p>

          <h3>Proposed Solution</h3>
          <p>
            A mobile-first web tool. The farmer or landowner selects a field, picks a soil type and
            one priority, and then compares 3–4 rotation plans for the next three seasons. NASA
            rain, weather, and soil-moisture data give the reason for each plan. A secondary
            district view shows government staff which <em>kecamatan</em> have the largest
            dry-season water gap for rice. They can use it to plan rotation support.
          </p>

          <h3>Confirmed scope</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Main user</td>
                <td>
                  The farmer or landowner who decides what is planted. The owner may farm the land
                  or rent it out.
                </td>
              </tr>
              <tr>
                <td>Secondary user</td>
                <td>
                  District agriculture staff. They use one district view with the same evidence.
                </td>
              </tr>
              <tr>
                <td>Launch area</td>
                <td>
                  All of Java, at <em>kecamatan</em> level.
                </td>
              </tr>
              <tr>
                <td>Local inputs</td>
                <td>
                  Soil type and one priority. The user picks both. The tool does not ask for other
                  plot facts.
                </td>
              </tr>
              <tr>
                <td>Crops</td>
                <td>Rice, maize, soybean, and fallow. These are the crops that KATAM covers.</td>
              </tr>
              <tr>
                <td>Seasons</td>
                <td>
                  Wet season (MH, about Nov–Feb), first dry season (MK1, about Mar–Jun), second dry
                  season (MK2, about Jul–Oct). Use the KATAM window for each area where available.
                </td>
              </tr>
              <tr>
                <td>Stack</td>
                <td>
                  The current repo: Next.js in <code>apps/web</code>, and Neon Postgres (used by the
                  probe scripts).
                </td>
              </tr>
              <tr>
                <td>Deadline</td>
                <td>The submission closes at the end of the hackathon on 15 November 2026.</td>
              </tr>
              <tr>
                <td>Budget, team size</td>
                <td>TBD.</td>
              </tr>
            </tbody>
          </table>

          <h3>Success Criteria</h3>
          <p>These targets are for the hackathon submission. They follow the judging criteria.</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>KPI</th>
                <th>Target</th>
                <th>Judging criterion</th>
                <th>How we measure</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Farmer task</td>
                <td>
                  At least 4 of 5 test users (farmers or landowners) choose a rotation plan without
                  help in 3 minutes or less.
                </td>
                <td>Impact</td>
                <td>
                  Timed test sessions before 14 November. We record the time and any help that we
                  gave.
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Farmer understanding</td>
                <td>
                  At least 4 of 5 test users can say, in their own words, why the plan they chose
                  uses less water or helps the soil.
                </td>
                <td>Impact, Validity</td>
                <td>
                  One question after the task. Two team members score the answer against the plan’s
                  evidence.
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Java coverage</td>
                <td>
                  100% of Java <em>kecamatan</em> in the boundary layer show plan results or an
                  unavailable state with a reason.
                </td>
                <td>Validity</td>
                <td>
                  A database check that counts every <em>kecamatan</em> by state.
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>Evidence tracing</td>
                <td>100% of numbers in a plan link to a source, period, and spatial scale.</td>
                <td>Validity</td>
                <td>
                  An audit of the plan output template and 10 random <em>kecamatan</em>.
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td>Challenge fit</td>
                <td>
                  The tool uses all four challenge inputs: NASA data, local soil, crop
                  characteristics, and farmer priority. The output is a rotation over several
                  seasons.
                </td>
                <td>Relevance</td>
                <td>A checklist review of the demo path.</td>
              </tr>
            </tbody>
          </table>
          <p>
            Secondary target: at least 1 extension worker (PPL) or district staff member finds the
            10 <em>kecamatan</em> with the largest MK2 water gap in one province in 2 minutes or
            less.
          </p>
          <p>
            Out of scope for these targets: yield, profit, and measured soil change. The hackathon
            cannot measure farm outcomes.
          </p>

          <h2>2. User Experience &amp; Functionality</h2>

          <h3>User Personas</h3>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Need</th>
                <th>Decision the tool supports</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Farmer or landowner</strong> (main)
                </td>
                <td>
                  Protect income and land quality. Use water well. The owner may not farm the land.
                </td>
                <td>
                  Which rotation plan to follow, or to discuss with the tenant, for the next three
                  seasons.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>District agriculture staff</strong> (secondary)
                </td>
                <td>Use limited seed, water, and extension support where it helps most.</td>
                <td>
                  Which <em>kecamatan</em> should get rotation support, such as legume seed or PPL
                  visits, first.
                </td>
              </tr>
            </tbody>
          </table>

          <h3>User Flows</h3>
          <p>
            <strong>Farmer or landowner:</strong> Open the tool → find the field (search a place,
            tap the map, or tap an FTW outline) → pick soil type → pick one priority → compare 3–4
            rotation plans → open the evidence for a plan → choose a plan → save or share it.
          </p>
          <p>
            <strong>District staff:</strong> Open the district view → select a province or district
            → see <em>kecamatan</em> sorted by MK2 water gap for rice → open one <em>kecamatan</em>{" "}
            → see the same evidence and the plans that the farmer view shows.
          </p>

          <h3>User Stories and Acceptance Criteria</h3>

          <h4>F1. Find my field</h4>
          <p>
            <strong>Story:</strong> As a farmer or landowner, I want to find my field on a map so
            that the plans use the conditions in my area.
          </p>
          <ul>
            <li>
              The user can search a village or <em>kecamatan</em> name, tap a point on the map, or
              tap an FTW outline.
            </li>
            <li>
              The tool shows the <em>kecamatan</em> that contains the point.
            </li>
            <li>
              An FTW outline shows its prediction year and the label “predicted outline, not a legal
              boundary”.
            </li>
            <li>The user can continue with a point when FTW has no outline.</li>
            <li>The flow works on a phone screen that is 360 px wide.</li>
          </ul>

          <h4>F2. Tell the tool about my soil and priority</h4>
          <p>
            <strong>Story:</strong> As a farmer or landowner, I want to give my soil type and my
            main priority so that the plans fit my field and my goal.
          </p>
          <ul>
            <li>
              Soil type choices: clay (<em>liat</em>), loam (<em>lempung</em>), sandy (
              <em>berpasir</em>), and “I do not know”. Each choice has a short plain description to
              help the user.
            </li>
            <li>Priority choices: save water, improve soil, or keep rice production.</li>
            <li>
              If the user picks “I do not know”, plans show the effect of each soil type, and the
              soil effect is marked as unresolved.
            </li>
            <li>Both inputs take 2 taps or fewer, and the user can change them at any time.</li>
            <li>The tool does not store these inputs unless the user saves a plan.</li>
          </ul>

          <h4>F3. Compare rotation plans</h4>
          <p>
            <strong>Story:</strong> As a farmer or landowner, I want to compare rotation plans side
            by side so that I can see the water and soil effect of each plan.
          </p>
          <ul>
            <li>
              The tool shows 3–4 plans for the next three seasons. Example plans: rice–rice–rice,
              rice–rice–soybean, rice–maize–soybean, rice–soybean–fallow.
            </li>
            <li>The tool always shows rice–rice–rice as the baseline.</li>
            <li>
              For each season in each plan, the tool shows:
              <ul>
                <li>
                  Rain cover: the percentage of the crop’s water need that normal rain in that
                  season covers.
                </li>
                <li>
                  Soil note: for example, a legume adds nitrogen, or a third rice season in a row
                  gives the soil no rest.
                </li>
                <li>Soil fit: whether the crop suits the soil type that the user picked.</li>
              </ul>
            </li>
            <li>The priority changes the order of the plans. It does not hide plans.</li>
            <li>Each plan shows which season has the largest water risk.</li>
            <li>The tool uses the words “plan to consider” and not “recommendation”.</li>
            <li>
              Plans use only crops and windows that KATAM lists for the area. If KATAM has no entry
              for the area, the tool uses the default season dates and shows this.
            </li>
          </ul>

          <h4>F4. See why</h4>
          <p>
            <strong>Story:</strong> As a farmer or landowner, I want to see the evidence behind a
            plan so that I can decide how much to trust it.
          </p>
          <ul>
            <li>
              Each number opens a short text that gives the source, the period, and the spatial
              scale. For example: “IMERG, MK2 average 2001–2025, 10 km grid cell”.
            </li>
            <li>
              The main view uses plain Bahasa Indonesia. Source names and technical details appear
              only when the user opens them.
            </li>
            <li>
              The evidence shows a current condition when data is available. For example: “Soil
              moisture now is lower than normal (SMAP, 28 October 2026)”.
            </li>
            <li>
              Missing and low-coverage data have different states. Missing data is not shown as
              zero.
            </li>
          </ul>

          <h4>F5. Save or share my plan</h4>
          <p>
            <strong>Story:</strong> As a landowner, I want to save or share a plan so that I can
            discuss it with the person who farms my land.
          </p>
          <ul>
            <li>The user can save a plan in the browser without an account.</li>
            <li>
              The user can share a link or an image that shows the plan, the field, the soil type,
              the priority, and the source dates.
            </li>
            <li>The shared plan uses the label “plan to consider, not checked on your field”.</li>
          </ul>

          <h4>G1. Find where rotation support helps most</h4>
          <p>
            <strong>Story:</strong> As district staff, I want to see which <em>kecamatan</em> have
            the largest dry-season water gap for rice so that I can plan rotation support.
          </p>
          <ul>
            <li>
              A map and a sorted list of <em>kecamatan</em> for a selected province or district.
            </li>
            <li>
              The sort measure is MK2 rain cover for rice. The tool shows its period and method.
            </li>
            <li>
              A <em>kecamatan</em> without valid data is marked unavailable and goes to the end of
              the list.
            </li>
            <li>
              <em>Kecamatan</em> that share one IMERG grid cell are marked as shared evidence.
            </li>
            <li>
              Opening a <em>kecamatan</em> shows the same plans and evidence as the farmer view.
            </li>
            <li>
              The view shows no data from single users. It has no saved farmer plans and no user
              locations.
            </li>
          </ul>

          <h3>Experience Requirements</h3>
          <ul>
            <li>
              Mobile first. The farmer flow must work on a mid-range Android phone. Device and
              network targets are TBD, and we must set them before the performance tests.
            </li>
            <li>The main language is Bahasa Indonesia. English is optional.</li>
            <li>
              Meaning must not depend only on color. Each rain-cover value shows a number and a text
              label.
            </li>
            <li>
              The user can do the core tasks with a keyboard or a screen reader, and with a list
              view instead of the map.
            </li>
          </ul>

          <h3>Non-Goals</h3>
          <ul>
            <li>
              Price, profit, or yield predictions. We have no price data. For this reason, “income”
              is not a priority choice.
            </li>
            <li>Irrigation water supply, fertilizer, or pest advice.</li>
            <li>
              A recommendation that is checked for one field. Plans are exploratory scenarios at
              area level.
            </li>
            <li>Soil tests, plot records, crop history, or land ownership.</li>
            <li>Crops other than rice, maize, and soybean in the MVP.</li>
            <li>User accounts, government saved lists, and export versioning.</li>
            <li>An AI chat assistant or new model training.</li>
            <li>Crop detection from HLS images.</li>
          </ul>

          <h2>3. AI System Requirements</h2>
          <p>
            The MVP uses no language model and trains no model. FTW uses machine learning to predict
            field outlines. The tool only shows the published FTW predictions.
          </p>
          <p>The plan logic is a fixed set of rules. We can test it and explain it.</p>

          <h3>Tool Requirements</h3>
          <ul>
            <li>FTW global predictions (2025) as map tiles, with year and confidence.</li>
            <li>
              A crop characteristics table: the season length and the water need for each crop,
              based on FAO-56 crop coefficients. The table also gives the soil fit and the
              soil-health note for each crop. A named source supports each row.
            </li>
            <li>
              A rule table for soil fit. A named agronomy source supports each rule. A PPL or
              agronomist reviews the table before the demo, if possible.
            </li>
          </ul>

          <h3>Evaluation Strategy</h3>
          <ul>
            <li>
              <strong>Rule tests:</strong> At least 20 fixed cases, each with inputs and the
              expected rain cover, order, and notes. They include “I do not know” soil, missing
              KATAM data, and missing NASA data. All tests must pass before the demo.
            </li>
            <li>
              <strong>Reasonableness check:</strong> For 5 known <em>kecamatan</em>, a PPL, an
              agronomist, or published local guidance agrees that the water-risk season is correct.
              If nobody can review the check, the PRD records this.
            </li>
            <li>
              <strong>FTW:</strong> Show the prediction label and year. Do not describe FTW
              confidence as ownership or as boundary accuracy.
            </li>
          </ul>

          <h2>4. Technical Specifications</h2>

          <h3>Architecture Overview</h3>
          <pre>
            <code>{`NASA IMERG monthly ──┐
NASA POWER daily ────┤
NASA SMAP L4 ────────┤
KATAM windows ───────┼─▶ Offline preparation ─▶ Neon Postgres
BIG kecamatan ───────┤     scripts              (one row per kecamatan
Crop table + rules ──┘                            and season)
                                                      │
                               Crop table + rules ─▶ Next.js app
                                                      │
                          ┌───────────────────────────┴──────┐
                          ▼                                  ▼
            Farmer view: field, soil,           District view:
            priority, plans  ◀── FTW tiles      sorted kecamatan`}</code>
          </pre>
          <ul>
            <li>
              <strong>Preparation happens before the demo.</strong> Scripts compute a season summary
              for each <em>kecamatan</em>: normal rain, reference crop water use (ETo), and current
              soil moisture. Then they store the result in Neon. The app does not read NASA files at
              request time.
            </li>
            <li>
              <strong>The app computes the plans at request time.</strong> It combines the stored
              season summaries with the soil type, the priority, and the crop table. This is a pure
              function, and the rule tests cover it.
            </li>
            <li>
              <strong>Rain cover</strong> = normal season rain ÷ (crop coefficient × ETo for the
              season). ETo uses the Hargreaves method with POWER daily minimum and maximum
              temperature, because POWER solar values were missing in the probe.
            </li>
          </ul>

          <h3>Integration Points</h3>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Use</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NASA IMERG Final monthly V07</td>
                <td>
                  Normal rain per season, 2001–2025, for each <em>kecamatan</em>
                </td>
                <td>
                  The grid is 0.1°. Compute an area-weighted value for each <em>kecamatan</em>. Mark{" "}
                  <em>kecamatan</em> that share one cell. Access needs an Earthdata token and GES
                  DISC approval (tested).
                </td>
              </tr>
              <tr>
                <td>NASA POWER daily</td>
                <td>Minimum and maximum temperature for ETo</td>
                <td>
                  One request for each <em>kecamatan</em> centroid, cached. This is about 7,000
                  requests, so rate limits and run time need a test.
                </td>
              </tr>
              <tr>
                <td>NASA SMAP L4 (SPL4SMGP)</td>
                <td>Current root-zone moisture compared to normal</td>
                <td>Latest available date. Show the date. The grid is about 9 km.</td>
              </tr>
              <tr>
                <td>KATAM</td>
                <td>
                  Planting windows and crops for each <em>kecamatan</em>
                </td>
                <td>
                  Access is not verified. A dated manual import is acceptable if the terms allow it.
                  If there is no KATAM entry, use the default seasons.
                </td>
              </tr>
              <tr>
                <td>
                  BIG <em>kecamatan</em> boundaries
                </td>
                <td>The area unit for Java</td>
                <td>Used in the probe. The license terms for reuse need a check.</td>
              </tr>
              <tr>
                <td>FTW global predictions 2025</td>
                <td>Field outlines on the map</td>
                <td>Map tiles only. No analysis on the outlines.</td>
              </tr>
              <tr>
                <td>Crop table and soil rules</td>
                <td>Plan logic</td>
                <td>A static file in the repo, with a source for each row.</td>
              </tr>
            </tbody>
          </table>
          <p>
            <strong>Soil data.</strong> FTW does not give soil type. NASA SMAP gives moisture, not
            soil texture. For this reason, the user picks the soil type. Optional for v1.1: fill in
            a default soil type from ISRIC SoilGrids and let the user change it. SoilGrids is not
            NASA data. This is a scope decision.
          </p>

          <h3>Security &amp; Privacy</h3>
          <ul>
            <li>No accounts in the MVP. Saved plans stay in the browser.</li>
            <li>
              A shared link contains only the location, the soil type, the priority, and the plan.
              Before the user shares a link, the tool tells the user that the link contains a
              location.
            </li>
            <li>
              The district view shows only area data. It never shows user locations or saved plans.
            </li>
            <li>
              Keep the NASA credentials on the preparation machine. Never send them to the browser
              or put them in the repo.
            </li>
            <li>
              Show the source attribution and licenses for NASA, FTW, BIG, and KATAM in the app.
            </li>
          </ul>

          <h2>5. Risks &amp; Roadmap</h2>

          <h3>Phased Rollout</h3>
          <table>
            <thead>
              <tr>
                <th>Phase</th>
                <th>Date</th>
                <th>Scope</th>
                <th>Exit criteria</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prep</td>
                <td>Now to 13 Nov 2026</td>
                <td>
                  Prepare the data for all of Java. Write the crop table and rule tests. Test the
                  flow with farmers.
                </td>
                <td>
                  KPI 3 passes. Rule tests pass. At least 5 test sessions are complete. We confirm
                  the Space Apps rules on work done before the event.
                </td>
              </tr>
              <tr>
                <td>MVP</td>
                <td>14–15 Nov 2026</td>
                <td>Farmer flow F1–F5 and district view G1. Demo video and project page.</td>
                <td>All five KPIs are met or reported honestly. The submission is complete.</td>
              </tr>
              <tr>
                <td>v1.1</td>
                <td>Dec 2026 – Jan 2027</td>
                <td>
                  Add inputs for last season’s crop and water source (irrigated or rain-fed). Add an
                  optional SoilGrids default. Test with more farmers.
                </td>
                <td>At least 20 test users. The KPI 1 and 2 targets still pass.</td>
              </tr>
              <tr>
                <td>v2.0</td>
                <td>2027</td>
                <td>
                  A local agronomist reviews the plans. Add more crops. Add price data if a reliable
                  source exists.
                </td>
                <td>An agronomist approves the plans in a pilot district.</td>
              </tr>
            </tbody>
          </table>

          <h3>Technical and Product Risks</h3>
          <table>
            <thead>
              <tr>
                <th>Risk</th>
                <th>Effect</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Space Apps rules limit work done before the event</td>
                <td>Prep work may not count.</td>
                <td>
                  Read the rules now. If the rules limit it, keep prep to data and research, and
                  build the app during the event.
                </td>
              </tr>
              <tr>
                <td>KATAM access fails</td>
                <td>Plans cannot use the local windows and crops.</td>
                <td>Use the default seasons and show this. Try a dated manual import.</td>
              </tr>
              <tr>
                <td>Data preparation for all of Java takes too long</td>
                <td>KPI 3 fails.</td>
                <td>
                  Run the preparation by province, starting now. Show “unavailable” for{" "}
                  <em>kecamatan</em> that are not done.
                </td>
              </tr>
              <tr>
                <td>Irrigation is unknown</td>
                <td>Rain cover can look bad for irrigated rice.</td>
                <td>Label rain cover as “rain only”. Add the water source input in v1.1.</td>
              </tr>
              <tr>
                <td>The crop table or soil rules are wrong</td>
                <td>The plans mislead users.</td>
                <td>
                  Give a source for each row. Ask a PPL or agronomist to review. The rule tests fix
                  the expected output.
                </td>
              </tr>
              <tr>
                <td>A 10 km rain cell looks like field data</td>
                <td>Users trust the numbers too much.</td>
                <td>
                  Show the scale in the evidence. Mark shared cells. Use “your area” and not “your
                  field”.
                </td>
              </tr>
              <tr>
                <td>We cannot find 5 farmers to test before the event</td>
                <td>KPIs 1 and 2 have no evidence.</td>
                <td>
                  Start recruiting now, through family, PPL contacts, or farmer groups. Remote video
                  sessions are acceptable.
                </td>
              </tr>
              <tr>
                <td>POWER rate limits</td>
                <td>Preparation stops.</td>
                <td>
                  Cache every response. Add a delay between requests. Continue from the last
                  completed <em>kecamatan</em>.
                </td>
              </tr>
            </tbody>
          </table>

          <h3>Open Decisions</h3>
          <ol>
            <li>Confirm the Space Apps rules on work done before 14 November.</li>
            <li>Confirm the KATAM access path.</li>
            <li>
              Approve the crop list, the three plan sets, and the named sources for the crop table.
            </li>
            <li>Decide whether SoilGrids can be an optional fourth data source in v1.1.</li>
            <li>Set the team size, the phone, and the network targets.</li>
          </ol>
        </article>
      </div>
    </div>
  );
}
