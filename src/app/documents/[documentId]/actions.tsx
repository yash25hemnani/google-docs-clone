"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByArrayOfIds, {ids})
}

export async function getUsers() {
  const { sessionClaims } = await auth();

  if (!sessionClaims) {
    throw new Error("Unauthorized");
  }

  const clerk = await clerkClient();

  // The sessionClaim may sometimes return o.id or org_id
  const o = sessionClaims.o as { id?: string } | undefined;

  const orgId = sessionClaims.org_id ?? o?.id ?? null;

  const response = await clerk.users.getUserList({
    organizationId: [orgId as string],
  });

  const users = response.data.map((user) => ({
    id: user.id,
    name:
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    avatar: user.imageUrl,
  }));

  return users
}
