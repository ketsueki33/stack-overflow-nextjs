"use client";
import { HomePageFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const HomeFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [active, setActive] = useState(
        searchParams.get("filter") || "newest",
    );

    useEffect(
        () => setActive(searchParams.get("filter") || "newest"),
        [searchParams],
    );

    const handleFilterChange = (item: string) => {
        if (active !== item) {
            setActive(item);
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: item.toLowerCase(),
            });

            router.push(newUrl, { scroll: false });
        }
    };

    return (
        <div className="hidden flex-wrap gap-3 md:flex">
            {HomePageFilters.map((item) => (
                <Button
                    className={`body-medium background-light800_dark200 h-[40px] rounded-lg px-6 py-3 capitalize shadow-none hover:bg-light-700 dark:hover:bg-dark-400 ${active === item.value ? "border-2 border-primary-500 text-primary-500" : "text-light-500"}`}
                    key={item.value}
                    onClick={() => {
                        handleFilterChange(item.value);
                    }}
                >
                    {item.name}
                </Button>
            ))}
        </div>
    );
};
export default HomeFilters;
