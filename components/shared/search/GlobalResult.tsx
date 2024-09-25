"use client";
import { LoaderCircle, PackageOpen, Tag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

interface Props {
    handleClose: () => void;
}

const GlobalResult = ({ handleClose }: Props) => {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>();

    const global = searchParams.get("global");
    const type = searchParams.get("type");

    useEffect(() => {
        const fetchResult = async () => {
            setResult([]);
            setIsLoading(true);

            try {
                const results = await globalSearch({ query: global, type });

                setResult(JSON.parse(results));
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        if (global) fetchResult();
    }, [global, type]);

    const renderLink = (type: string, id: string) => {
        switch (type) {
            case "question":
                return `/question/${id}`;
            case "answer":
                return `/question/${id}`;
            case "profile":
                return `/profile/${id}`;
            case "tag":
                return `/tags/${id}`;
            default:
                return "";
        }
    };

    return (
        <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 p-5 shadow-sm dark:bg-dark-400">
            <GlobalFilters />
            <div className="my-5 border-t border-gray-500/50" />
            <div className="space-y-5">
                <p className="text-dark400_light900 paragraph-semibold">
                    Top Matches
                </p>
                {isLoading ? (
                    <div className="flex-center flex-col px-5">
                        <LoaderCircle className="my-2 animate-spin" />
                        <p className="text-dark200_light800 body-regular">
                            Patience my friend...
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {result?.length > 0 ? (
                            result.map((item: any, index: number) => (
                                <Link
                                    className="hover: flex w-full items-center gap-3 rounded-lg px-5 py-2.5 hover:bg-dark-400/10 hover:dark:bg-light-700/10"
                                    href={renderLink(item.type, item.id)}
                                    key={item.type + item.id + index}
                                    onClick={handleClose}
                                >
                                    <Tag className="shrink-0" size={18} />
                                    <div className="flex flex-col">
                                        <p className="body-medium text-dark200_light800 line-clamp-1">
                                            {item.title}
                                        </p>
                                        <p className="text-dark400_light500 small-medium mt-1 font-bold capitalize">
                                            {item.type}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="flex-center flex-col gap-2 px-5 text-gray-500">
                                <PackageOpen size={28} />
                                <p className="body-regular">No results found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default GlobalResult;
