// Liveblocks uses the concept of rooms, separate virtual spaces where people collaborate, and to create a
// realtime experience, multiple users must be connected to the same room.
// When using Next.js’ /app router, we recommend creating your room in a Room.tsx file in the same directory
// as your current route.

"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();

  return (
    <LiveblocksProvider throttle={16} authEndpoint={"/api/liveblocks-auth"}>
      <RoomProvider id={params.documentId as string}>
        {" "}
        {/* Using the documentId as the room ID */}
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
