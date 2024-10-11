import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
            <div className="mt-9 flex w-full flex-col gap-9">
                <div className="space-y-3.5">
                    <Skeleton className="h-3 w-[60px]" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3.5">
                    <Skeleton className="h-3 w-[60px]" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3.5">
                    <Skeleton className="h-3 w-[60px]" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3.5">
                    <Skeleton className="h-3 w-[60px]" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <div className="space-y-3.5">
                    <Skeleton className="h-3 w-[60px]" />
                    <Skeleton className="h-[120px] w-full" />
                </div>
            </div>
            <div className="mt-16 flex justify-end gap-8">
                <Skeleton className="h-[40px] w-[80px]" />
                <Skeleton className="h-[40px] w-[150px]" />
            </div>
        </>
    );
};
export default loading;
