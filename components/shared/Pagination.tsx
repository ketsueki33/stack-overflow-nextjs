"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    pageNumber: number;
    isNext: boolean;
    scroll?: boolean;
}

const Pagination = ({ pageNumber, isNext, scroll = true }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = (direction: "prev" | "next") => {
        const nextPageNumber =
            direction === "next" ? pageNumber + 1 : pageNumber - 1;

        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "page",
            value: nextPageNumber.toString(),
        });

        router.push(newUrl, { scroll });
    };

    if (!isNext && pageNumber === 1) return null;

    return (
        <div className="mt-10 flex w-full items-center justify-center gap-4">
            <Button
                variant="outline"
                disabled={pageNumber === 1}
                onClick={() => handleNavigation("prev")}
            >
                <ChevronLeft />
            </Button>
            <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
                <p className="paragraph-semibold text-light-900">
                    {pageNumber}
                </p>
            </div>
            <Button
                variant="outline"
                disabled={!isNext}
                onClick={() => handleNavigation("next")}
            >
                <ChevronRight />
            </Button>
        </div>
    );
};
export default Pagination;
