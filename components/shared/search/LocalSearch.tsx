"use client";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    route: string;
    iconPosition: "left" | "right";
    placeholder: string;
    customClasses?: string;
    customIcon?: string;
}

const LocalSearch = ({
    route,
    iconPosition,
    placeholder,
    customClasses,
    customIcon = "/assets/icons/search.svg",
}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get("q");

    const [search, setSearch] = useState(query || "");

    useEffect(() => {
        const debounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "q",
                    value: search,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keys: ["q"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500);

        return () => clearTimeout(debounceFn);
    }, [search, router, pathname, route, query, searchParams]);

    return (
        <div
            className={`background-light800_dark300 relative flex min-h-[40px] grow items-center gap-1 rounded-xl px-4 ${customClasses}`}
        >
            {iconPosition === "left" && (
                <Image
                    src={customIcon}
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            )}
            <Input
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
                placeholder={placeholder}
                className="paragraph-regular no-focus placeholder text-dark400_light700 body-regular border-none bg-transparent shadow-none outline-none"
            />
            {iconPosition === "right" && (
                <Image
                    src={customIcon}
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
            )}
        </div>
    );
};
export default LocalSearch;
