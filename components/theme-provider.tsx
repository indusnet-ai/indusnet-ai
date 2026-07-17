"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

function TimeThemeController() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const updateThemeBasedOnTime = () => {
      const hour = new Date().getHours();
      // 5:00 PM (17:00) to 5:00 AM (05:00): Bright (Light mode)
      // 5:00 AM (05:00) to 5:00 PM (17:00): Dark (Dark mode)
      if (hour >= 17 || hour < 5) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    };

    updateThemeBasedOnTime();
    
    // Check local time every 60 seconds to ensure seamless transitions
    const interval = setInterval(updateThemeBasedOnTime, 60000);
    return () => clearInterval(interval);
  }, [setTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <TimeThemeController />
      {children}
    </NextThemesProvider>
  );
}
