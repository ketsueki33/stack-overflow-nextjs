"use client";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { useState } from "react";

const HomeFilters = () => {
    const [active, setActive] = useState("unfiltered");
    return (
        <div className="hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((item) => (
                <Button
                    className={`body-medium background-light800_dark200 h-[40px] rounded-lg px-6 py-3 capitalize shadow-none hover:bg-light-700 dark:hover:bg-dark-400 ${active === item.value ? "border-2 border-primary-500 text-primary-500" : "text-light-500"}`}
                    key={item.value}
                    onClick={() => {
                        active === item.value
                            ? setActive("unfiltered")
                            : setActive(item.value);
                    }}
                >
                    {item.name}
                </Button>
            ))}
        </div>
    );
};
export default HomeFilters;
