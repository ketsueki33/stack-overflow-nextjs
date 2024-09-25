"use client";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GlobalResult from "./GlobalResult";
import { CircleX } from "lucide-react";

const GlobalSearch = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get("global");

    const [search, setSearch] = useState(query || "");
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const debounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "global",
                    value: search,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keys: ["global", "type"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500);

        return () => clearTimeout(debounceFn);
    }, [search, router, pathname, query, searchParams]);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-[600px] max-lg:hidden"
        >
            <div
                onClick={() => {
                    if (query && !isOpen) setIsOpen(true);
                }}
                className="background-light800_darkgradient relative flex min-h-[30px] grow items-center gap-1 rounded-xl px-4"
            >
                <Image
                    src="/assets/icons/search.svg"
                    alt="search"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                />
                <Input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);

                        if (!isOpen) setIsOpen(true);
                        if (e.target.value === "" && isOpen) setIsOpen(false);
                    }}
                    className="paragraph-regular no-focus placeholder text-dark300_light900 body-regular border-none bg-transparent shadow-none outline-none"
                />
                {search && (
                    <CircleX
                        onClick={(e) => {
                            e.stopPropagation();
                            setSearch("");
                            setIsOpen(false);
                        }}
                        className="cursor-pointer text-[#7B8EC8] hover:text-inherit"
                        size={20}
                    />
                )}
            </div>
            {isOpen && <GlobalResult handleClose={handleClose} />}
        </div>
    );
};
export default GlobalSearch;
