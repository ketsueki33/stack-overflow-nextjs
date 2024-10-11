import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
    return (
        <>
            <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-5 lg:flex-row">
                    <Skeleton className="size-[140px] shrink-0 rounded-full" />
                    <div className="mt-3">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="mt-6 h-4 w-[150px]" />
                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            <Skeleton className="h-5 w-[180px]" />
                            <Skeleton className="h-5 w-[180px]" />
                            <Skeleton className="h-5 w-[180px]" />
                        </div>
                        <Skeleton className="mt-8 h-[180px] w-full rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <Skeleton className="h-5 w-[70px]" />
                <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                    <Skeleton className="h-[100px] w-full md:h-[180px]" />
                    <Skeleton className="h-[100px] w-full md:h-[180px]" />
                    <Skeleton className="h-[100px] w-full md:h-[180px]" />
                    <Skeleton className="h-[100px] w-full md:h-[180px]" />
                </div>
            </div>

            <Skeleton className="mt-10 h-10 w-[200px]" />
            <Skeleton className="mt-10 h-[150px] w-full rounded-lg" />
        </>
    );
};
export default loading;
