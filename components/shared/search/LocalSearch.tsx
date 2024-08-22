"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";

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
