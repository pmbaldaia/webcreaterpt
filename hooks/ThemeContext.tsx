import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useRNColorScheme } from "react-native";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const defaultTheme: ThemeType = "dark";

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useRNColorScheme(); // pega o esquema do sistema
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  useEffect(() => {
    AsyncStorage.getItem("theme").then((savedTheme) => {
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      } else {
        setTheme(systemTheme === "light" ? "light" : "dark");
      }
    });
  }, [systemTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
