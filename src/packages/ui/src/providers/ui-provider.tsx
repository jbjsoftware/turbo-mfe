import { createContext, useContext, useEffect, useState } from "react";

import "@repo/ui/globals.css";

type Theme = "dark" | "light" | "system";

type UIProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type UIProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: UIProviderState = {
  theme: "system",
  setTheme: () => null,
};

const UIProviderContext = createContext<UIProviderState>(initialState);

export function UIProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: UIProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <UIProviderContext.Provider {...props} value={value}>
      {children}
    </UIProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(UIProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a UIProvider");

  return context;
};
