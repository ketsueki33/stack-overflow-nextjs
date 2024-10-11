import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <>
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="mt-11 h-8 w-full" />
            <div className="mt-10 flex w-full flex-col gap-6">
                {[1, 2, 3].map((e) => (
                    <Skeleton className="h-[180px] w-full rounded-lg" key={e} />
                ))}
            </div>
        </>
    );
};

export default Loading;
