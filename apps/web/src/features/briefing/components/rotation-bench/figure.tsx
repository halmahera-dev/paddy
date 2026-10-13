import "@/components/iso/iso.css";
import { Plate } from "@/components/iso/react/draw";
import { RotationBenchArt } from "./art";
import { REST_PLAN, readoutOf } from "./model";
import "./rotation-bench.css";

export function RotationBenchFigure() {
  return (
    <div className="iso rb">
      <Plate
        fig="Fig 1"
        title="The rotation bench"
        hint="Tap a tray to change its crop"
        readout={readoutOf(REST_PLAN)}
        caption="Rain columns: normal season rain, NASA GPM IMERG 2001–2024, example area. Collars: crop water need. Nitrogen: illustrative."
      >
        <RotationBenchArt />
      </Plate>
    </div>
  );
}
