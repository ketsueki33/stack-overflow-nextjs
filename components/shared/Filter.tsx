"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    filters: { name: string; value: string }[];
    customClasses?: string;
    containerClasses?: string;
}

const Filter = ({ filters, customClasses, containerClasses }: Props) => {
    return (
        <div className={`relative ${containerClasses}`}>
            <Select>
                <SelectTrigger
                    className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 ${customClasses}`}
                >
                    <div className="line-clamp-1 flex-1 text-left">
                        <SelectValue placeholder="Filters" />
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
