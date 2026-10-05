type NodeSection = {
  heading?: string;
  lines?: string[];
  origin?: string[];
};

type FlowNode = {
  id: string;
  column: 0 | 1 | 2 | 3;
  centerY: number;
  title: string;
  sections: NodeSection[];
  kind?: "farmer" | "output";
  inputs: string[];
};

type PositionedText = {
  text: string;
  y: number;
  className: string;
};

const NODE_WIDTH = 330;
const MIN_NODE_HEIGHT = 118;
const COLUMN_X = [30, 450, 870, 1290];
const COLUMN_TITLES = ["1. Data we use", "2. Get ready", "3. Work out", "4. What you see"];

const nodes: FlowNode[] = [
  {
    id: "nasa",
    column: 0,
    centerY: 182,
    title: "NASA weather and soil",
    sections: [
      { heading: "Rain, 10 km squares", origin: ["From NASA GPM IMERG, via GES DISC"] },
      { heading: "Soil wetness, 9 km squares", origin: ["From NASA SMAP Level 4, via NSIDC"] },
      { heading: "Temperature, about 50 km", origin: ["From NASA POWER, built on MERRA-2"] },
    ],
    inputs: [],
  },
  {
    id: "crops",
    column: 0,
    centerY: 368,
    title: "Crop facts",
    sections: [
      {
        lines: ["Water need and soil effect of rice,", "maize, and soybean."],
        origin: ["From FAO Irrigation Paper 56"],
      },
    ],
    inputs: [],
  },
  {
    id: "maps",
    column: 0,
    centerY: 514,
    title: "Maps",
    sections: [
      {
        lines: ["District borders and field outlines."],
        origin: ["Borders from BIG (Indonesia)", "Outlines from Fields of the World"],
      },
    ],
    inputs: [],
  },
  {
    id: "calendar",
    column: 0,
    centerY: 657,
    title: "Planting calendar",
    sections: [
      {
        lines: ["Best planting months for each area."],
        origin: ["From KATAM, Ministry of Agriculture"],
      },
    ],
    inputs: [],
  },
  {
    id: "you",
    column: 0,
    centerY: 800,
    title: "You tell us",
    kind: "farmer",
    sections: [
      {
        lines: ["Where your field is, your soil type,", "your crop, and your planting date."],
        origin: ["From you, saved in your account"],
      },
    ],
    inputs: [],
  },

  {
    id: "latest",
    column: 1,
    centerY: 150,
    title: "Read the latest days",
    sections: [
      {
        lines: [
          "Collect the last days of rain,",
          "soil wetness, and heat.",
          "Each value keeps its date.",
        ],
      },
    ],
    inputs: ["nasa"],
  },
  {
    id: "normal",
    column: 1,
    centerY: 340,
    title: "Learn what is normal",
    sections: [
      {
        lines: [
          "Past years of NASA data give the",
          "normal for each season. Crop facts",
          "give the normal water need.",
        ],
      },
    ],
    inputs: ["nasa", "crops"],
  },
  {
    id: "area",
    column: 1,
    centerY: 657,
    title: "Find your area",
    sections: [{ lines: ["Match your field to its district", "and to its planting calendar."] }],
    inputs: ["maps", "calendar", "you"],
  },

  {
    id: "changes",
    column: 2,
    centerY: 245,
    title: "Spot changes",
    sections: [
      {
        lines: [
          "Fixed rules compare the latest days",
          "with normal. AI only explains the",
          "result in plain words.",
        ],
      },
    ],
    inputs: ["latest", "normal"],
  },
  {
    id: "compare",
    column: 2,
    centerY: 520,
    title: "Compare crop plans",
    sections: [
      {
        lines: [
          "For 3 seasons: how much water each",
          "crop needs against normal rain.",
          "Rice, rice, rice is the baseline.",
        ],
      },
    ],
    inputs: ["normal", "area"],
  },

  {
    id: "scene",
    column: 3,
    centerY: 140,
    title: "3D farm",
    kind: "output",
    sections: [{ lines: ["An illustrated view of your farm", "and the latest conditions."] }],
    inputs: ["changes"],
  },
  {
    id: "alerts",
    column: 3,
    centerY: 300,
    title: "Alerts and advice",
    kind: "output",
    sections: [
      { lines: ["Dry, very wet, or low soil wetness.", "A short reason and a check to do."] },
    ],
    inputs: ["changes"],
  },
  {
    id: "cards",
    column: 3,
    centerY: 470,
    title: "Six farm cards",
    kind: "output",
    sections: [
      { lines: ["Crop progress, rain, soil wetness,", "temperature, water need, plans."] },
    ],
    inputs: ["changes", "compare"],
  },
  {
    id: "plans",
    column: 3,
    centerY: 640,
    title: "Plans to consider",
    kind: "output",
    sections: [{ lines: ["3 or 4 plans for the next 3 seasons.", "You choose one."] }],
    inputs: ["compare"],
  },
];

function getNode(id: string) {
  const node = nodes.find(function (candidate) {
    return candidate.id === id;
  });
  if (!node) {
    throw new Error(`Unknown flow node: ${id}`);
  }
  return node;
}

function layoutNodeBody(node: FlowNode) {
  const texts: PositionedText[] = [];
  let y = 70;

  node.sections.forEach(function (section, index) {
    if (index > 0) {
      y += 10;
    }
    if (section.heading) {
      texts.push({ text: section.heading, y, className: "fill-foreground font-medium" });
      y += 20;
    }
    for (const line of section.lines ?? []) {
      texts.push({ text: line, y, className: "fill-muted-foreground" });
      y += 20;
    }
    for (const line of section.origin ?? []) {
      texts.push({ text: line, y, className: "fill-primary font-medium" });
      y += 20;
    }
  });

  const lastBaseline = y - 20;
  return { texts, height: Math.max(MIN_NODE_HEIGHT, lastBaseline + 14) };
}

function getInputPort(node: FlowNode, index: number) {
  const spread = (index - (node.inputs.length - 1) / 2) * 18;
  return { x: COLUMN_X[node.column], y: node.centerY + spread };
}

function getOutputPort(node: FlowNode) {
  return { x: COLUMN_X[node.column] + NODE_WIDTH, y: node.centerY };
}

function getEdges() {
  return nodes.flatMap(function (target) {
    return target.inputs.map(function (inputId, index) {
      const start = getOutputPort(getNode(inputId));
      const end = getInputPort(target, index);
      const curve = (end.x - start.x) / 2;
      const path = `M ${start.x} ${start.y} C ${start.x + curve} ${start.y}, ${end.x - curve} ${end.y}, ${end.x} ${end.y}`;
      return { key: `${inputId}-${target.id}`, path, start, end };
    });
  });
}

function getNodeStrokeClass(node: FlowNode) {
  if (node.kind === "farmer") return "stroke-amber-500";
  if (node.kind === "output") return "stroke-primary";
  return "stroke-border";
}

const flowAnimation = `
  @keyframes data-flow-dash { to { stroke-dashoffset: -12; } }
  .data-flow-edge { animation: data-flow-dash 1.2s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .data-flow-edge { animation: none; } }
`;

export function DataFlow() {
  const edges = getEdges();

  return (
    <section aria-labelledby="data-flow-title" className="mx-auto max-w-7xl px-4 pt-8">
      <h2 id="data-flow-title" className="text-xl font-semibold">
        How data reaches the farmer
      </h2>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        Read from left to right. Data goes in on the left, and each box says where it comes from.
        Each step prepares it. On the right is what the farmer or landowner sees.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card/40">
        <svg
          viewBox="0 0 1650 900"
          role="img"
          aria-label="Flow from data sources, to preparation, to calculation, to what the farmer sees"
          className="h-auto w-full min-w-[1100px]"
        >
          <style>{flowAnimation}</style>

          {COLUMN_TITLES.map(function (title, column) {
            return (
              <text
                key={title}
                x={COLUMN_X[column] + 4}
                y={52}
                className="fill-muted-foreground text-[15px] font-semibold tracking-widest uppercase"
              >
                {title}
              </text>
            );
          })}

          {edges.map(function (edge) {
            return (
              <path
                key={edge.key}
                d={edge.path}
                className="data-flow-edge fill-none stroke-muted-foreground"
                strokeWidth={2}
                strokeDasharray="6 6"
              />
            );
          })}

          {nodes.map(function (node) {
            const left = COLUMN_X[node.column];
            const body = layoutNodeBody(node);
            const top = node.centerY - body.height / 2;

            return (
              <g key={node.id}>
                <rect
                  x={left}
                  y={top}
                  width={NODE_WIDTH}
                  height={body.height}
                  rx={20}
                  strokeWidth={2}
                  className={`fill-card ${getNodeStrokeClass(node)}`}
                />
                <line
                  x1={left}
                  x2={left + NODE_WIDTH}
                  y1={top + 44}
                  y2={top + 44}
                  strokeWidth={2}
                  className="stroke-border"
                />
                <text
                  x={left + 24}
                  y={top + 29}
                  className="fill-foreground text-[20px] font-semibold"
                >
                  {node.title}
                </text>
                {body.texts.map(function (line) {
                  return (
                    <text
                      key={line.text}
                      x={left + 24}
                      y={top + line.y}
                      className={`text-[14px] ${line.className}`}
                    >
                      {line.text}
                    </text>
                  );
                })}
              </g>
            );
          })}

          {edges.map(function (edge) {
            return (
              <g key={edge.key} className="fill-muted-foreground">
                <circle cx={edge.start.x} cy={edge.start.y} r={6} />
                <circle cx={edge.end.x} cy={edge.end.y} r={6} />
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Satellite numbers describe your area, not your exact field. Plans are ideas to consider. We
        did not check them on your field.
      </p>
    </section>
  );
}
