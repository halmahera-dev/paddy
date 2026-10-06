"use client";

import { CameraControls, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { Crop, Farm } from "@/features/farm/farm-queries";

import { cropName } from "@/features/farm/crop-progress";

import { type FieldMoment, rowGrowth } from "../field-timeline";

const plotWidth = 20;
const plotDepth = 14;
const bundWidth = 1.6;
const groundTop = -0.3;
const slabHalfWidth = 34;
const slabHalfDepth = 28.5;

const palette = {
  bund: "#a9b87a",
  topsoil: "#6b4a2e",
  clay: "#9a6b4b",
  subsoil: "#c9a77a",
  drySoil: "#d2b48c",
  wetSoil: "#7a5a3c",
  water: "#6fb7cf",
  road: "#e6dcc4",
  trunk: "#8a6a4a",
  leaf: "#4f8a3c",
  roof: "#b5563a",
  wall: "#efe3c8",
  sprout: "#a8d672",
  green: "#3f8f3a",
  gold: "#d9b44a",
  rain: "#9cc8d6",
  alert: "#e8a317",
  pole: "#5b4a3a",
  normalLine: "#ffffff",
  satelliteBody: "#e8e2d4",
  solarPanel: "#2c6fb0",
};

type CropShape = { maxHeight: number; geometry: THREE.BufferGeometry; ripe: string };

function buildCropShape(crop: Exclude<Crop, "fallow">): CropShape {
  if (crop === "maize") {
    return {
      maxHeight: 2.4,
      geometry: new THREE.ConeGeometry(0.28, 1, 4).translate(0, 0.5, 0),
      ripe: "#c9a95c",
    };
  }
  if (crop === "soybean") {
    return {
      maxHeight: 0.8,
      geometry: new THREE.IcosahedronGeometry(0.4, 0).translate(0, 0.4, 0),
      ripe: "#b59a4a",
    };
  }
  return {
    maxHeight: 1.1,
    geometry: new THREE.ConeGeometry(0.24, 1, 5).translate(0, 0.5, 0),
    ripe: palette.gold,
  };
}

// Seeded so each clump keeps the same jitter across frames and replays.
function seededNoise(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

const plantColumns = 24;
const plantRows = 16;

function Plants({ farm, day }: { farm: Farm; day: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const crop = farm.cropRecord.crop;
  const shape = useMemo(() => (crop === "fallow" ? null : buildCropShape(crop)), [crop]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || !shape) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();
    const color = new THREE.Color();
    const sprout = new THREE.Color(palette.sprout);
    const green = new THREE.Color(palette.green);
    const ripe = new THREE.Color(shape.ripe);

    for (let row = 0; row < plantRows; row++) {
      const growth = rowGrowth(farm, day, row / (plantRows - 1));
      for (let column = 0; column < plantColumns; column++) {
        const index = row * plantColumns + column;
        const x = -plotWidth / 2 + 0.6 + (column / (plantColumns - 1)) * (plotWidth - 1.2);
        const z = -plotDepth / 2 + 0.6 + (row / (plantRows - 1)) * (plotDepth - 1.2);
        const jitter = seededNoise(index);
        const height =
          growth === null ? 0.0001 : shape.maxHeight * (0.12 + 0.88 * Math.min(growth / 0.6, 1));
        const width = growth === null ? 0.0001 : 0.5 + 0.5 * Math.min(growth / 0.4, 1);

        rotation.setFromAxisAngle(THREE.Object3D.DEFAULT_UP, jitter * Math.PI * 2);
        matrix.compose(
          new THREE.Vector3(
            x + (jitter - 0.5) * 0.2,
            groundTop,
            z + (seededNoise(index + 7) - 0.5) * 0.2,
          ),
          rotation,
          new THREE.Vector3(width, height * (0.9 + jitter * 0.2), width),
        );
        mesh.setMatrixAt(index, matrix);

        if (growth === null || growth < 0.75) {
          color.lerpColors(sprout, green, Math.min((growth ?? 0) / 0.5, 1));
        } else {
          color.lerpColors(green, ripe, (growth - 0.75) / 0.25);
        }
        mesh.setColorAt(index, color);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [farm, day, shape]);

  if (!shape) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[shape.geometry, undefined, plantColumns * plantRows]}
      castShadow
    >
      <meshStandardMaterial flatShading roughness={0.9} />
    </instancedMesh>
  );
}

function FocusPlot({ moment }: { moment: FieldMoment }) {
  const soilColor = useMemo(
    () => new THREE.Color(palette.drySoil).lerp(new THREE.Color(palette.wetSoil), moment.wetness),
    [moment.wetness],
  );
  const waterOpacity = Math.max(0, (moment.wetness - 0.55) * 1.6);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={groundTop + 0.01} receiveShadow>
        <planeGeometry args={[plotWidth, plotDepth]} />
        <meshStandardMaterial color={soilColor} roughness={1} />
      </mesh>
      {waterOpacity > 0 && (
        <mesh rotation-x={-Math.PI / 2} position-y={groundTop + 0.12}>
          <planeGeometry args={[plotWidth, plotDepth]} />
          <meshStandardMaterial
            color={palette.water}
            transparent
            opacity={Math.min(waterOpacity, 0.85)}
            roughness={0.15}
          />
        </mesh>
      )}
    </group>
  );
}

const neighborColors = [
  "#b7c98a",
  "#c9b98a",
  "#9fbf7a",
  "#d4c29a",
  "#a7c48a",
  "#c2b07e",
  "#b0c785",
  "#cbbd92",
];

function NeighborPlots() {
  const plots = [];
  for (let row = -1; row <= 1; row++) {
    for (let column = -1; column <= 1; column++) {
      if (row === 0 && column === 0) continue;
      plots.push({ row, column, color: neighborColors[plots.length] });
    }
  }
  return plots.map(function NeighborPlot(plot) {
    return (
      <mesh
        key={`${plot.row}:${plot.column}`}
        rotation-x={-Math.PI / 2}
        position={[
          plot.column * (plotWidth + bundWidth),
          groundTop + 0.01,
          plot.row * (plotDepth + bundWidth),
        ]}
        receiveShadow
      >
        <planeGeometry args={[plotWidth, plotDepth]} />
        <meshStandardMaterial color={plot.color} roughness={1} />
      </mesh>
    );
  });
}

function Bunds() {
  const lines = [];
  const spanX = 3 * plotWidth + 4 * bundWidth;
  const spanZ = 3 * plotDepth + 4 * bundWidth;
  for (let index = 0; index < 4; index++) {
    const x = (index - 1.5) * (plotWidth + bundWidth);
    const z = (index - 1.5) * (plotDepth + bundWidth);
    lines.push({ key: `x${index}`, position: [x, 0, 0], size: [bundWidth, 0.35, spanZ] });
    lines.push({ key: `z${index}`, position: [0, 0, z], size: [spanX, 0.35, bundWidth] });
  }
  return lines.map(function Bund(line) {
    return (
      <mesh
        key={line.key}
        position={[line.position[0], groundTop + 0.17, line.position[2]]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={line.size as [number, number, number]} />
        <meshStandardMaterial color={palette.bund} flatShading roughness={1} />
      </mesh>
    );
  });
}

const soilLayers = [
  { color: palette.topsoil, top: groundTop, bottom: -1.3 },
  { color: palette.clay, top: -1.3, bottom: -3.3 },
  { color: palette.subsoil, top: -3.3, bottom: -5 },
];

// Root-zone moisture near 0.45 m³/m³ means saturated clay.
const saturatedMoisture = 0.45;
const rootZoneDepth = 3;

function SoilSlab({ farm }: { farm: Farm }) {
  const { rootZoneMoisture, normalRootZoneMoisture, moistureObserved } = farm.conditions;
  const frontZ = slabHalfDepth + 0.02;
  const normalDepth = (normalRootZoneMoisture / saturatedMoisture) * rootZoneDepth;

  return (
    <group>
      {soilLayers.map(function SoilLayer(layer) {
        const height = layer.top - layer.bottom;
        return (
          <mesh key={layer.color} position-y={layer.bottom + height / 2} receiveShadow>
            <boxGeometry args={[slabHalfWidth * 2, height, slabHalfDepth * 2]} />
            <meshStandardMaterial color={layer.color} flatShading roughness={1} />
          </mesh>
        );
      })}
      {rootZoneMoisture !== null && (
        <mesh
          position={[
            0,
            groundTop - ((rootZoneMoisture / saturatedMoisture) * rootZoneDepth) / 2,
            frontZ,
          ]}
        >
          <planeGeometry
            args={[plotWidth, (rootZoneMoisture / saturatedMoisture) * rootZoneDepth]}
          />
          <meshBasicMaterial color={palette.water} transparent opacity={0.55} />
        </mesh>
      )}
      <mesh position={[0, groundTop - normalDepth, frontZ + 0.01]}>
        <planeGeometry args={[plotWidth, 0.08]} />
        <meshBasicMaterial color={palette.normalLine} />
      </mesh>
      <Chip position={[plotWidth / 2 + 1, -2, frontZ]} align="left">
        {rootZoneMoisture === null
          ? "Root-zone moisture · no reading"
          : `Root-zone moisture ${rootZoneMoisture} m³/m³ · normal ${normalRootZoneMoisture}`}
        <span className="text-muted-foreground"> · area 9 km · {moistureObserved}</span>
      </Chip>
    </group>
  );
}

function Canal() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, groundTop + 0.02, -25.8]}>
      <planeGeometry args={[slabHalfWidth * 2, 2.6]} />
      <meshStandardMaterial color={palette.water} roughness={0.2} />
    </mesh>
  );
}

function Road() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, groundTop + 0.02, 25.9]} receiveShadow>
      <planeGeometry args={[slabHalfWidth * 2, 2.6]} />
      <meshStandardMaterial color={palette.road} roughness={1} />
    </mesh>
  );
}

function Hut() {
  return (
    <group
      position={[plotWidth / 2 + bundWidth / 2, groundTop + 0.35, -plotDepth / 2 - bundWidth / 2]}
    >
      <mesh position-y={0.6} castShadow>
        <boxGeometry args={[1.3, 1.2, 1.3]} />
        <meshStandardMaterial color={palette.wall} flatShading />
      </mesh>
      <mesh position-y={1.7} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[1.35, 1, 4]} />
        <meshStandardMaterial color={palette.roof} flatShading />
      </mesh>
    </group>
  );
}

const treeSpots = [-30, -21, -9, 4, 15, 27];

function Trees() {
  return treeSpots.map(function Tree(x, index) {
    const height = 3 + seededNoise(index + 3) * 1.4;
    return (
      <group key={x} position={[x, groundTop, slabHalfDepth - 0.9]}>
        <mesh position-y={height / 2} castShadow>
          <cylinderGeometry args={[0.14, 0.22, height, 5]} />
          <meshStandardMaterial color={palette.trunk} flatShading />
        </mesh>
        <mesh position-y={height + 0.3} scale={[1, 0.6, 1]} castShadow>
          <icosahedronGeometry args={[1.3, 0]} />
          <meshStandardMaterial color={palette.leaf} flatShading />
        </mesh>
      </group>
    );
  });
}

const rainDropCount = 900;
const rainCeiling = 26;

function Rain({ rainMm }: { rainMm: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const visibleDrops = Math.round(rainDropCount * Math.min(rainMm / 60, 1));

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < rainDropCount; index++) {
      matrix.makeTranslation(
        (seededNoise(index) - 0.5) * slabHalfWidth * 2,
        rainCeiling - seededNoise(index + 2000) * rainCeiling,
        (seededNoise(index + 1000) - 0.5) * slabHalfDepth * 2,
      );
      mesh.setMatrixAt(index, matrix);
    }
  }, []);

  useFrame(function fall({ clock }) {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.count = visibleDrops;
    if (visibleDrops === 0) return;
    const matrices = mesh.instanceMatrix.array;
    for (let index = 0; index < visibleDrops; index++) {
      const fallen =
        (seededNoise(index + 2000) * rainCeiling + clock.elapsedTime * 18) % rainCeiling;
      // Drops only move down, so write the y translation (column-major element 13).
      matrices[index * 16 + 13] = rainCeiling - fallen;
    }
    mesh.instanceMatrix.clearUpdateRanges();
    mesh.instanceMatrix.addUpdateRange(0, visibleDrops * 16);
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, rainDropCount]}>
      <boxGeometry args={[0.04, 0.7, 0.04]} />
      <meshBasicMaterial color={palette.rain} transparent opacity={0.7} />
    </instancedMesh>
  );
}

const cloudSpots: [number, number, number][] = [
  [-14, 22, -6],
  [8, 24, 4],
  [20, 21, -10],
  [-4, 23, 12],
];

function Clouds({ rainMm }: { rainMm: number }) {
  const cover = Math.min(rainMm / 40, 1);
  if (cover === 0) return null;
  const color = new THREE.Color("#ffffff").lerp(new THREE.Color("#8d97a3"), cover);
  return cloudSpots.map(function Cloud(position, index) {
    return (
      <mesh
        key={index}
        position={position}
        scale={[2 + cover * 1.5, 0.8 + cover * 0.5, 1.5 + cover]}
      >
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color={color} flatShading transparent opacity={0.4 + cover * 0.5} />
      </mesh>
    );
  });
}

function Satellite() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(function orbit({ clock }) {
    const group = groupRef.current;
    if (!group) return;
    const angle = clock.elapsedTime * 0.08;
    group.position.set(Math.cos(angle) * 44, 34, Math.sin(angle) * 30);
    group.rotation.y = -angle;
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[1, 1, 1.4]} />
        <meshStandardMaterial color={palette.satelliteBody} flatShading />
      </mesh>
      <mesh position-x={1.9}>
        <boxGeometry args={[2.6, 0.05, 1]} />
        <meshStandardMaterial color={palette.solarPanel} flatShading />
      </mesh>
      <mesh position-x={-1.9}>
        <boxGeometry args={[2.6, 0.05, 1]} />
        <meshStandardMaterial color={palette.solarPanel} flatShading />
      </mesh>
      <Chip position={[0, 1.8, 0]}>NASA rain · 10 km cell</Chip>
    </group>
  );
}

const flagSpots: [number, number][] = [
  [-6, -3],
  [5, 2],
  [-2, 4],
];

function AlertFlags({ moment }: { moment: FieldMoment }) {
  return moment.activeAlerts.map(function AlertFlag(alert, index) {
    const [x, z] = flagSpots[index % flagSpots.length];
    return (
      <group key={alert.id} position={[x, groundTop, z]}>
        <mesh position-y={1.5} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 3, 4]} />
          <meshStandardMaterial color={palette.pole} />
        </mesh>
        <mesh position={[0.5, 2.7, 0]} castShadow>
          <boxGeometry args={[1, 0.6, 0.04]} />
          <meshStandardMaterial color={palette.alert} flatShading />
        </mesh>
        <Chip position={[0, 3.6, 0]} tone="alert">
          {alert.title} · {alert.action}
        </Chip>
      </group>
    );
  });
}

function Chip({
  position,
  children,
  tone = "default",
  align = "center",
}: {
  position: [number, number, number];
  children: React.ReactNode;
  tone?: "default" | "alert";
  align?: "center" | "left";
}) {
  return (
    <Html
      position={position}
      center={align === "center"}
      zIndexRange={[10, 0]}
      className="pointer-events-none"
    >
      <div
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap shadow-sm ${
          tone === "alert"
            ? "border-destructive/40 bg-card text-card-foreground"
            : "bg-card text-card-foreground"
        }`}
      >
        <span
          className={`size-1.5 rounded-full ${tone === "alert" ? "bg-destructive" : "bg-primary"}`}
        />
        {children}
      </div>
    </Html>
  );
}

function CameraRig() {
  const controlsRef = useRef<CameraControls>(null);
  useLayoutEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.setLookAt(90, 110, 140, 0, 0, 0, false);
    controls.setLookAt(52, 46, 68, 0, -3, 0, true);
  }, []);
  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={14}
      maxDistance={150}
      maxPolarAngle={Math.PI * 0.42}
      smoothTime={0.9}
    />
  );
}

// Playback ticks every frame; the scene only redraws when the whole day changes.
export const FieldDiorama = memo(function FieldDiorama({
  farm,
  moment,
  day,
}: {
  farm: Farm;
  moment: FieldMoment;
  day: number;
}) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.5]}
      camera={{ fov: 35, near: 0.5, far: 600, position: [90, 110, 140] }}
    >
      <hemisphereLight args={["#fff6e5", "#b89a6a", 1.6]} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
      />
      <CameraRig />
      <SoilSlab farm={farm} />
      <NeighborPlots />
      <FocusPlot moment={moment} />
      <Bunds />
      <Canal />
      <Road />
      <Hut />
      <Trees />
      <Plants farm={farm} day={day} />
      <AlertFlags moment={moment} />
      <Rain rainMm={moment.week.rainMm} />
      <Clouds rainMm={moment.week.rainMm} />
      <Satellite />
      <Chip position={[0, 4.5, 0]}>
        {farm.name} · {cropName[farm.cropRecord.crop]} · {moment.stage}
      </Chip>
    </Canvas>
  );
});
