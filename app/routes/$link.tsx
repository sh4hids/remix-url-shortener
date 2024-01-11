import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { RouteParams } from "routes-gen";
import { db } from "~/db/config.server";
import { links } from "~/db/schemas/links.server";
import { base62ToNumber } from "~/utils/base62";

export async function loader({ params }: LoaderFunctionArgs) {
  const { link } = params as RouteParams["/:link"];
  const id = base62ToNumber(link);

  console.log(id);

  const linkData = await db.select().from(links).where(eq(links.id, id));

  if (!linkData.length) {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect(linkData[0].url);
}
