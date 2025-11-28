"use client";

import { ThemeProvider } from "@/provider/theme-provider";
import { ClerkThemeWrapper } from "@/components/clerk-theme-wrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkThemeWrapper>{children}</ClerkThemeWrapper>
    </ThemeProvider>
  );
}
