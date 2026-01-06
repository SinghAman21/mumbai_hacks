"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Forces dark theme while mounted.
 * Restores the previous theme setting on unmount.
 */
export function ForceDarkTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const previousThemeRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (previousThemeRef.current === null && theme) {
      previousThemeRef.current = theme;
    }

    if (resolvedTheme !== "dark") {
      setTheme("dark");
    }
  }, [theme, resolvedTheme, setTheme]);

  React.useEffect(() => {
    return () => {
      const previousTheme = previousThemeRef.current;
      if (previousTheme && previousTheme !== "dark") {
        setTheme(previousTheme);
      }
    };
  }, [setTheme]);

  return null;
}
