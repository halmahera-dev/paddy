import { Dots, FaceText, Line, Solid } from "@/components/iso/react/draw";
import { BASE_ART, CROP_ART, DIAL_ART, GAUGE_ART, RAIL_ART, TRAY_ART } from "./geometry";
import { RotationBenchLive } from "./live";

const BASE = (
  <g key="base">
    <path className="iso-halo" d={BASE_ART.halo} />
    {BASE_ART.feet.map((parts, index) => (
      <g key={index}>
        <Solid paths={parts[0]!} tone="lo" crease="faint" />
        <Solid paths={parts[1]!} tone="mid" crease="faint" />
      </g>
    ))}
    <Solid paths={BASE_ART.slab} tone="mid" crease="faint" />
    <Line d={BASE_ART.groove} tone="lo" />
    <Line d={BASE_ART.screwRings} tone="lo" />
    <Dots points={BASE_ART.screws} size={0.5} tone="mid" />
    {BASE_ART.seats.map((paths, index) => (
      <g key={index}>
        <Solid paths={paths} tone="lo" crease="faint" />
        <Line d={BASE_ART.seatLines[index]!} tone="faint" />
      </g>
    ))}
    <Solid paths={BASE_ART.strip} tone="lo" crease="none" />
    <Line d={BASE_ART.stripMinor} tone="lo" />
    <Line d={BASE_ART.stripMajor} tone="mid" />
    <Solid paths={BASE_ART.plate} tone="lo" crease="none" />
    <Line d={BASE_ART.plateLine} tone="faint" />
    <Line d={BASE_ART.plateRule} tone="lo" free />
    <Dots points={BASE_ART.plateScrews} size={0.45} tone="mid" />
  </g>
);

const GAUGES = GAUGE_ART.map((gauge, index) => ({
  pedestal: (
    <g key={`pedestal-${index}`}>
      <Solid paths={gauge.flange} tone="lo" crease="faint" />
      <Solid paths={gauge.foot} tone="mid" crease="faint" />
      <Line d={gauge.footSeam} tone="faint" />
    </g>
  ),
  collarBack: <Solid key={`collar-back-${index}`} paths={gauge.collarBack} tone="hi" crease="faint" />,
  tube: (
    <g key={`tube-${index}`}>
      <Solid paths={gauge.tube} tone="lo" crease="none" className="rb-glass" />
      <Solid paths={gauge.water} tone="mid" crease="none" className="rb-water" />
      <Line d={gauge.meniscus} tone="mid" className="rb-water-line" />
      <Line d={gauge.shine} tone="faint" />
      <Line d={gauge.rule} tone="lo" />
      <Line d={gauge.ticksMinor} tone="lo" />
      <Line d={gauge.ticksMajor} tone="mid" />
    </g>
  ),
  collarFront: (
    <g key={`collar-front-${index}`}>
      <Solid paths={gauge.collarFront} tone="hi" crease="faint" />
      <Dots points={gauge.collarScrew} size={0.5} tone="hi" />
    </g>
  ),
  cap: <Solid key={`cap-${index}`} paths={gauge.cap} tone="mid" crease="faint" />,
}));

const RAIL = (
  <g key="rail">
    {RAIL_ART.feet.map((paths, index) => (
      <Solid key={index} paths={paths} tone="lo" crease="faint" />
    ))}
    <Dots points={RAIL_ART.footScrews} size={0.45} tone="mid" />
    {RAIL_ART.posts.map((paths, index) => (
      <g key={index}>
        <Solid paths={paths} tone="mid" crease="faint" />
        <Line d={RAIL_ART.postLines[index]!} tone="faint" />
      </g>
    ))}
    <Solid paths={RAIL_ART.rail} tone="mid" crease="faint" />
    <Line d={RAIL_ART.ticksMinor} tone="lo" />
    <Line d={RAIL_ART.ticksMajor} tone="mid" />
    <Dots points={RAIL_ART.screws} size={0.5} tone="mid" />
    {RAIL_ART.stops.map((paths, index) => (
      <Solid key={index} paths={paths} tone="mid" crease="faint" />
    ))}
  </g>
);

const RICE = CROP_ART.map((crop, tray) => (
  <g key={`rice-${tray}`}>
    <Solid paths={crop.rice.sheet} tone="faint" crease="none" flat className="rb-sheet" />
    <Line d={crop.rice.ripples} tone="faint" className="rb-ripple" />
    <Line d={crop.rice.stems} tone="mid" free="end" />
    <Line d={crop.rice.heads} tone="mid" free="end" />
    <Dots points={crop.rice.bases} size={0.5} tone="mid" />
  </g>
));

const MAIZE = CROP_ART.map((crop, tray) => (
  <g key={`maize-${tray}`}>
    {crop.maize.map((plant, index) => (
      <g key={index}>
        <Solid paths={plant.back} tone="mid" crease="faint" flat />
        <Solid paths={plant.stem} tone="mid" crease="none" />
        <Line d={plant.nodes} tone="lo" />
        <Solid paths={plant.cob} tone="hi" crease="none" />
        <Solid paths={plant.front} tone="mid" crease="faint" flat />
        <Line d={plant.tassel} tone="hi" free="end" />
      </g>
    ))}
  </g>
));

const SOYBEAN = CROP_ART.map((crop, tray) => (
  <g key={`soybean-${tray}`}>
    {crop.soybean.map((plant, index) => (
      <g key={index}>
        <Solid paths={plant.back} tone="mid" crease="faint" flat />
        <Solid paths={plant.stem} tone="mid" crease="none" />
        <Solid paths={plant.front} tone="mid" crease="faint" flat />
        <Solid paths={plant.pods} tone="hi" crease="none" />
      </g>
    ))}
  </g>
));

const TRAYS = TRAY_ART.map((tray, index) => ({
  ring: <path key={`ring-${index}`} className="rb-ring" d={tray.ring} />,
  back: (
    <g key={`back-${index}`}>
      <Solid paths={tray.back} tone="mid" crease="faint" />
      <Solid paths={tray.left} tone="mid" crease="faint" />
      <Solid paths={tray.soil} tone="faint" crease="none" flat className="rb-soil" />
      <Line d={tray.soilLine} tone="faint" />
      <Line d={tray.furrows} tone="faint" />
      <Dots points={tray.grains} size={0.45} tone="lo" />
      <Solid paths={tray.stake} tone="mid" crease="none" />
      <Solid paths={tray.head} tone="mid" crease="faint" />
      <Line d={tray.window} tone="lo" />
      <path className="rb-bar" d={tray.bar} />
      <Dots points={[tray.headDot]} size={0.5} tone="mid" />
    </g>
  ),
  crops: [RICE[index]!, MAIZE[index]!, SOYBEAN[index]!],
  front: (
    <g key={`front-${index}`}>
      <Solid paths={tray.right} tone="mid" crease="faint" />
      <Solid paths={tray.front} tone="mid" crease="faint" />
      <Line d={tray.frontLine} tone="faint" />
      <Dots points={tray.rimScrews} size={0.5} tone="mid" />
      <Line d={tray.slots} tone="lo" />
      <Dots points={tray.detents} size={0.55} tone="hi" />
      <Solid paths={tray.boss} tone="lo" crease="none" />
      <Solid paths={tray.knob} tone="mid" crease="faint" />
    </g>
  ),
  knob: (
    <g key={`knob-${index}`}>
      <Line d={tray.knobTicks} tone="lo" />
      <Line d={tray.pointer} tone="hi" free="end" />
      <Dots points={[[0, 0]]} size={0.7} tone="hi" />
    </g>
  ),
}));

const DIAL = (
  <g key="dial">
    <Solid paths={DIAL_ART.stand} tone="lo" crease="faint" />
    <Dots points={DIAL_ART.standScrews} size={0.45} tone="mid" />
    <Solid paths={DIAL_ART.pillar} tone="mid" crease="faint" />
    <Line d={DIAL_ART.pillarSeam} tone="faint" />
    <Solid paths={DIAL_ART.lug} tone="mid" crease="faint" />
    <Solid paths={DIAL_ART.puck} tone="mid" crease="faint" />
    <Line d={DIAL_ART.band} tone="faint" />
    <Line d={DIAL_ART.knurl} tone="faint" />
    <Line d={DIAL_ART.bezel} tone="lo" />
    <Line d={DIAL_ART.face} tone="faint" />
    <Line d={DIAL_ART.ticksMinor} tone="lo" />
    <Line d={DIAL_ART.ticksMajor} tone="mid" />
    <Line d={DIAL_ART.zero} tone="hi" />
    <FaceText transform={DIAL_ART.label} size={2.6} tone="lo" anchor="middle">
      N
    </FaceText>
    <Solid paths={DIAL_ART.crown} tone="mid" crease="faint" />
    <Solid paths={DIAL_ART.crownCap} tone="mid" crease="faint" />
  </g>
);

const HUB = <Solid key="hub" paths={DIAL_ART.hub} tone="mid" crease="faint" />;

const LABEL =
  "A bench with three soil trays in a row, one per season, each with a knob that swaps its crop. Behind each tray stands a glass rain gauge. The blue water column shows normal rain for that season, and a ring on the gauge marks the water the crop needs. A dial at the right end shows the soil nitrogen balance for the whole rotation.";

export function RotationBenchArt() {
  return <RotationBenchLive label={LABEL} base={BASE} gauges={GAUGES} rail={RAIL} trays={TRAYS} dial={DIAL} hub={HUB} />;
}
