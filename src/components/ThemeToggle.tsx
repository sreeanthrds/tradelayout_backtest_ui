
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle toggle change
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null; // Render nothing during SSR
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-500" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Moon className="h-[1.2rem] w-[1.2rem] text-blue-700 dark:text-blue-400" />
    </div>
  );
}
