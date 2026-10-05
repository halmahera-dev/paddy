import { getAreaBoundaries } from "@/features/maps/maps-queries";
import { getSession } from "@/features/user/user-queries";

export async function GET() {
  if (!(await getSession())) {
    return new Response("Unauthorized", { status: 401 });
  }

  return Response.json(await getAreaBoundaries(), {
    headers: { "Cache-Control": "private, max-age=86400" },
  });
}
