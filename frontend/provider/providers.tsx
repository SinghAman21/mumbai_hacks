"use client";

import { ThemeProvider } from "@/provider/theme-provider";
import { ClerkThemeWrapper } from "@/components/clerk-theme-wrapper";
import { QueryProvider } from "@/provider/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ClerkThemeWrapper>{children}</ClerkThemeWrapper>
      </ThemeProvider>
    </QueryProvider>
  );
}
