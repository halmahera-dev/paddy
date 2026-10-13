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
        caption="The rain columns show normal season rain for an example area from NASA GPM IMERG, 2001–2024. The rings show the crop water need, and the nitrogen values are only a guide."
      >
        <RotationBenchArt />
      </Plate>
    </div>
  );
}
