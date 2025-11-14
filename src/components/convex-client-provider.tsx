"use client";

import { ReactNode } from "react";
import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { SignIn, useAuth } from "@clerk/nextjs";
import { FullScreenLoader } from "./fullscreen-loader";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* routing=hash => this is because we don't want to create a Catch-All route */}
          <SignIn routing="hash" /> 
        </div>
      </Unauthenticated>
      <AuthLoading>
        <FullScreenLoader label="Authentication Loading"/>
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
}
