"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    filters: { name: string; value: string }[];
    customClasses?: string;
    containerClasses?: string;
}

const Filter = ({ filters, customClasses, containerClasses }: Props) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const paramFilter = searchParams.get("filter");

    const handleUpdateParams = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "filter",
            value,
        });

        router.push(newUrl, { scroll: false });
    };

    return (
        <div className={`relative ${containerClasses}`}>
            <Select
                onValueChange={handleUpdateParams}
                defaultValue={paramFilter || undefined}
            >
                <SelectTrigger
                    className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 ${customClasses}`}
                >
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Sort By" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {filters.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
export default Filter;
