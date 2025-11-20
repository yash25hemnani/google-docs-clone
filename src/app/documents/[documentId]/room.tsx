// Liveblocks uses the concept of rooms, separate virtual spaces where people collaborate, and to create a
// realtime experience, multiple users must be connected to the same room.
// When using Next.js’ /app router, we recommend creating your room in a Room.tsx file in the same directory
// as your current route.

"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullScreenLoader } from "@/components/fullscreen-loader";
import { getDocuments, getUsers } from "./actions";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

type User = { id: string; name: string; avatar: string };
export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const [users, setUsers] = useState<User[]>([]);

  // useMemo (callback, dependency array)
  const fetchUsers = useMemo(
    () => async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users!");
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <LiveblocksProvider
      throttle={16}
      // Doing this to ensure we always have a room loaded.
      authEndpoint={async () => {
        const endpoint = "/api/liveblocks-auth";
        const room = params.documentId as string;

        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({ room }),
        });

        return await response.json();
      }}
      // userIds are received automatically via the auth endpoint
      resolveUsers={({ userIds }) => {
        // Here, we are returning the complete user objects
        return userIds.map(
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}
      // This function handles autocomplete for @mentions.
      resolveMentionSuggestions={({ text }) => {
        let filterUsers = users;

        if (text) {
          filterUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        // You return only the user IDs, not the user data
        // Liveblocks will take these IDs and ask 'resolveUsers' for the actual data.
        // We have defined resolveUsers above.
        return filterUsers.map((user) => user.id);
      }}
      resolveRoomsInfo={async ({ roomIds }) => {
        const documents = await getDocuments(roomIds as Id<"documents">[]);

        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider
        // Defined in liveblocks.config.ts
        initialStorage={{ leftMargin: 56, rightMargin: 56 }}
        id={params.documentId as string}
      >
        {" "}
        {/* Using the documentId as the room ID */}
        <ClientSideSuspense
          fallback={<FullScreenLoader label="Room Loading" />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
