import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
            <div className="mt-9 flex w-full flex-col gap-10">
                <div>
                    <Skeleton className="mb-2 h-3 w-32" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div>
                    <Skeleton className="mb-2 h-3 w-32" />
                    <Skeleton className="h-[280px] w-full" />
                </div>
                <div>
                    <Skeleton className="mb-2 h-3 w-32" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
            <Skeleton className="mt-10 h-8 w-[140px] rounded-md" />
        </div>
    );
};

export default Loading;
