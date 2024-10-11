import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full sm:w-[170px]" />
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
