import "server-only";
import { env } from "@hollou/env/server";

export const siteUrl = new URL("/", env.BETTER_AUTH_URL);

export const siteDescription =
  "Compare rice, maize, and soybean crop rotations for Java, Indonesia, using NASA rain and soil-moisture data, local soil types, and farmer priorities.";
