"use client";

import { Mode } from "@/types";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface ThemeContextType {
    mode: Mode;
    setTheme: (newMode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<Mode>("dark");

    const setTheme = (newMode: Mode) => {
        setMode(newMode);
    };

    const handleThemeChange = useCallback(() => {
        if (
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            if (mode !== "dark") setMode("dark");
            document.documentElement.classList.add("dark");
        } else {
            if (mode !== "light") setMode("light");
            document.documentElement.classList.remove("dark");
        }
    }, [mode]); // Add any dependencies of handleThemeChange here

    useEffect(() => {
        handleThemeChange();
    }, [handleThemeChange]);

    return (
        <ThemeContext.Provider value={{ mode, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a Theme Provider");
    }

    return context;
}
