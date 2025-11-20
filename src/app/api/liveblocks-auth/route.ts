import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET as string,
});

export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();
  const document = await convex.query(api.documents.getById, { id: room });

  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  const isOwner = document.ownerId === user.id;

  // The sessionClaim may sometimes return o.id or org_id
  const o = sessionClaims.o as { id?: string } | undefined;

  const orgId = sessionClaims.org_id ?? o?.id ?? null;

  const isOrganizationMember =
  orgId && document.organizationId === orgId;


  if (!isOwner && !isOrganizationMember) {
    console.log("Error:: Not an owner or organization member:  ", { isOwner, isOrganizationMember });
    return new Response("Unauthorized", { status: 401 });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
      avatar: user.imageUrl,
    },
  });

  // Session returns two options FULL_ACCESS and READ_ACCESS
  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
