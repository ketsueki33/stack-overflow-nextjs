import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
    return (
        <div className="w-full">
            <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <div className="flex items-center gap-1">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>

            <Skeleton className="mt-3.5 h-8 w-3/4" />

            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-1">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-wrap gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-6 w-16" />
                    ))}
                </div>
                <Skeleton className="h-8 w-24" />
            </div>

            <div className="mt-8">
                <Skeleton className="mb-4 h-6 w-32" />
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-6 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    );
};
export default loading;
