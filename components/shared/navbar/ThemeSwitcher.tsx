"use client";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { themes } from "@/constants";

import { useTheme } from "@/context/ThemeProvider";
import { Mode } from "@/types";
import Image from "next/image";

export const ThemeSwitcher = () => {
    const { mode, setTheme } = useTheme();
    return (
        <Menubar className="relative border-none bg-transparent shadow-none">
            <MenubarMenu>
                <MenubarTrigger className="cursor-pointer rounded-full hover:bg-slate-200 focus:bg-slate-200 data-[state=open]:bg-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800 dark:data-[state=open]:bg-slate-800">
                    {mode === "light" ? (
                        <Image
                            src="/assets/icons/sun.svg"
                            alt="sun"
                            width={20}
                            height={20}
                            className="active-theme"
                        />
                    ) : (
                        <Image
                            src="/assets/icons/moon.svg"
                            alt="moon "
                            width={20}
                            height={20}
                            className="active-theme"
                        />
                    )}
                </MenubarTrigger>
                <MenubarContent className="absolute -right-16 mt-3 min-w-[120px] rounded border py-2 dark:border-dark-400 dark:bg-dark-300">
                    {themes.map((item) => (
                        <MenubarItem
                            key={item.value}
                            className="flex items-center gap-4 px-2.5 py-2 dark:focus:bg-dark-400"
                            onClick={() => {
                                setTheme(item.value as Mode);

                                if (item.value !== "system") {
                                    localStorage.theme = item.value;
                                } else {
                                    localStorage.removeItem("theme");
                                }
                            }}
                        >
                            <Image
                                src={item.icon}
                                alt={item.value}
                                width={16}
                                height={16}
                                className={`${mode === item.value && "active-theme"}`}
                            />
                            <p
                                className={`body-medium text-light-500 ${
                                    mode === item.value
                                        ? "text-primary-500"
                                        : "text-dark100_light900"
                                }`}
                            >
                                {item.label}
                            </p>
                        </MenubarItem>
                    ))}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};
