"use client";
import { Badge } from "@/components/ui/badge";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const GlobalFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const typeParams = searchParams.get("type");
    const [active, setActive] = useState(typeParams || "");

    const handleTypeClick = (type: string) => {
        if (active !== type) {
            setActive(type);
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "type",
                value: type.toLowerCase(),
            });

            router.push(newUrl, { scroll: false });
        } else {
            setActive("");
            const newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keys: ["type"],
            });
            router.push(newUrl, { scroll: false });
        }
    };
    return (
        <div className="flex items-center gap-5 px-5">
            <p className="text-dark400_light900 paragraph-semibold">Type: </p>
            <div className="flex gap-3">
                {GlobalSearchFilters.map((item) => (
                    <Badge
                        onClick={() => handleTypeClick(item.value)}
                        variant="outline"
                        className={`body-medium cursor-pointer py-1 ${active === item.value ? "border-none bg-primary-500 !font-bold text-white" : "hover:border-primary-500 hover:text-primary-500"}`}
                        key={item.value}
                    >
                        {item.name}
                    </Badge>
                ))}
            </div>
        </div>
    );
};
export default GlobalFilters;
