import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCookie, setCookie } from "./util";

type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  setTheme: (theme: string) => {},
  theme: "light",
});

interface ThemeProviderProps {
  children?: ReactNode;
  ssrTheme?: Theme;
  defaultTheme?: Theme;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  ssrTheme,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(ssrTheme ?? defaultTheme);

  const storageTheme = (theme: Theme) => {
    setCookie("rt-theme", theme, 365);
  };

  useEffect(() => {
    const el = document.documentElement;
    el.classList.add(theme ?? "");
    storageTheme(theme ?? "");
  }, [theme]);

  useEffect(() => {
    const cookieTheme = getCookie("rt-theme", document.cookie);
    if (!cookieTheme) {
      storageTheme(theme ?? "");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
