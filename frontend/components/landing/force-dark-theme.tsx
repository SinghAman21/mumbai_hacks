"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Forces dark theme while mounted on the landing page.
 * Does not restore theme on unmount to prevent navigation flash.
 */
export function ForceDarkTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    if (resolvedTheme !== "dark") {
      setTheme("dark");
    }
  }, [resolvedTheme, setTheme]);

  return null;
}
