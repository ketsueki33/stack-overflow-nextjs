import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <>
            <div className="flex w-full justify-between">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Skeleton className="w-[150px] rounded-md" />
            </div>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row md:flex-col">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md sm:w-[250px] md:hidden" />
                <div className="hidden gap-2 md:flex">
                    {[1, 2, 3, 4].map((e) => (
                        <Skeleton
                            key={e}
                            className="h-8 w-[120px] rounded-md"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {[1, 2, 3].map((e) => (
                    <Skeleton className="h-[180px] w-full rounded-lg" key={e} />
                ))}
            </div>
        </>
    );
};

export default Loading;
