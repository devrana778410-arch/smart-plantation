"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = new ConvexReactClient(convexUrl || "https://dummy-smart-plantation.convex.cloud");

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!convexUrl) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'red', fontFamily: 'sans-serif' }}>
        <h2>Backend Not Connected</h2>
        <p>This deployment is missing the <b>NEXT_PUBLIC_CONVEX_URL</b> environment variable.</p>
        <p>Please add it to your Vercel Dashboard and redeploy to enable the backend.</p>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      {children}
    </ConvexAuthProvider>
  );
}
