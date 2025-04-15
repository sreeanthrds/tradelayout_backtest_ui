
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Initialize with a default theme value
  const [theme, setThemeState] = useState<string>("light");
  const [mounted, setMounted] = useState(false);
  
  // Safely access the theme context only after component is mounted
  const themeContext = typeof window !== 'undefined' ? useTheme() : { theme: "light", setTheme: () => {} };
  
  // useEffect only runs on the client, so now we can safely show the UI and use the context
  useEffect(() => {
    setMounted(true);
    if (themeContext && themeContext.theme) {
      setThemeState(themeContext.theme);
    }
  }, [themeContext]);

  // Handle toggle click
  const handleToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setThemeState(newTheme);
    if (themeContext && themeContext.setTheme) {
      themeContext.setTheme(newTheme);
    }
  };

  if (!mounted) {
    return null; // Render nothing during SSR or before mount
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="rounded-full"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-700" />
      )}
    </Button>
  );
}
