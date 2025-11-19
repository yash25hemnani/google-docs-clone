import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// By default, clerkMiddleware() will not protect any routes. All routes are public and you must opt-in to protection for routes.https://clerk.com/docs/references/nextjs/clerk-middleware) to learn how to require authentication for specific routes.

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/api/(.*)",
  ],
};
