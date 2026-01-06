"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is fresh for 2 minutes, then considered stale
            staleTime: 2 * 60 * 1000,
            // Cache persists for 10 minutes after last use
            gcTime: 10 * 60 * 1000,
            // Refetch when user switches back to the tab
            refetchOnWindowFocus: true,
            // Don't refetch on component mount if data is still fresh
            refetchOnMount: true,
            // Refetch when network reconnects
            refetchOnReconnect: true,
            // Retry failed queries twice
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
