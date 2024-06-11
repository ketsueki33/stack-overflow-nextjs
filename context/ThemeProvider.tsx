"use client";

import { ReactNode, createContext, useContext, useState } from "react";

interface ThemeContextType {
    mode: "dark" | "light";
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<"dark" | "light">("dark");

    const toggleTheme = () => {
        if (mode === "dark") {
            setMode("light");
            document.documentElement.classList.add("light");
        }
        if (mode === "light") {
            setMode("dark");
            document.documentElement.classList.add("dark");
        }
    };

    return <ThemeContext.Provider value={{ mode, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a Theme Provider");
    }

    return context;
}
