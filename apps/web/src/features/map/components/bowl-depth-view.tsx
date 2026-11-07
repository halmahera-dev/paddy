const viewWidth = 320;
const groundY = 64;
const pixelsPerMeter = 30;
const maxDepthMeters = 3.4;
const viewHeight = groundY + maxDepthMeters * pixelsPerMeter;
const personHeightPixels = 1.7 * pixelsPerMeter;
const curveSteps = 40;
const bowlSpread = 0.2;

function bowlY(x: number, depthMeters: number) {
  const offset = (x - viewWidth / 2) / (viewWidth * bowlSpread);
  return groundY + depthMeters * pixelsPerMeter * Math.exp(-(offset * offset));
}

function bowlPoints(depthMeters: number) {
  return Array.from({ length: curveSteps + 1 }, (_, step) => {
    const x = (step / curveSteps) * viewWidth;
    return `${x.toFixed(1)},${bowlY(x, depthMeters).toFixed(1)}`;
  });
}

export function BowlDepthView({
  todayMeters,
  projectedMeters,
  description,
  todayLabel,
  projectedLabel,
  depthLabel,
}: {
  todayMeters: number;
  projectedMeters: number;
  description: string;
  todayLabel: string;
  projectedLabel: string;
  depthLabel: string;
}) {
  const unitPoints = bowlPoints(1);
  const depthPixels = projectedMeters * pixelsPerMeter;
  const scaleDepth = {
    transform: `scaleY(${projectedMeters})`,
    transformOrigin: `0 ${groundY}px`,
    transformBox: "view-box",
  } as const;
  const followDepth = (fraction: number) => ({ transform: `translateY(${depthPixels * fraction}px)` });
  const motion = "transition-transform duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <figure className="flex flex-col gap-2">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full rounded-2xl bg-muted/50"
        role="img"
        aria-label={description}
      >
        <g className={motion} style={scaleDepth}>
          <polygon points={`0,${groundY} ${unitPoints.join(" ")} ${viewWidth},${groundY}`} className="fill-chart-3/25" />
          <polyline
            points={unitPoints.join(" ")}
            fill="none"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="stroke-chart-3"
          />
        </g>
        <polyline
          points={bowlPoints(todayMeters).join(" ")}
          fill="none"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          className="stroke-muted-foreground"
        />
        <line
          x1="0"
          x2={viewWidth}
          y1={groundY}
          y2={groundY}
          strokeWidth="1"
          strokeDasharray="6 4"
          className="stroke-muted-foreground/60"
        />
        <line
          x1={viewWidth / 2 + 12}
          x2={viewWidth / 2 + 12}
          y1={groundY}
          y2={groundY + pixelsPerMeter}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          className={`stroke-foreground/40 ${motion}`}
          style={scaleDepth}
        />
        <text
          x={viewWidth / 2 + 18}
          y={groundY + 4}
          fontSize="11"
          className={`fill-muted-foreground tabular-nums ${motion}`}
          style={followDepth(1 / 2)}
        >
          {depthLabel}
        </text>
        <g className={`fill-muted-foreground/70 ${motion}`} style={followDepth(1)}>
          <circle cx={viewWidth / 2} cy={groundY - personHeightPixels + 4} r="4" />
          <rect x={viewWidth / 2 - 6} y={groundY - personHeightPixels + 9} width="12" height="15" rx="4" />
          <rect x={viewWidth / 2 - 5} y={groundY - personHeightPixels + 22} width="4" height={personHeightPixels - 22} rx="2" />
          <rect x={viewWidth / 2 + 1} y={groundY - personHeightPixels + 22} width="4" height={personHeightPixels - 22} rx="2" />
        </g>
      </svg>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground tabular-nums">
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-4 border-t border-dashed border-muted-foreground" />
          {todayLabel}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-chart-3" />
          {projectedLabel}
        </span>
      </figcaption>
    </figure>
  );
}
