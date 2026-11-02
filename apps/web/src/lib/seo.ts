import "server-only";
import { env } from "@hollou/env/server";

export const siteUrl = new URL("/", env.BETTER_AUTH_URL);

export const siteDescription =
  "LANDAS reads NISAR radar to show where North Jakarta sinks the fastest.";
