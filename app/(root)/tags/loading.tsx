import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Tags</h1>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full sm:w-[170px]" />
            </div>
            <section className="mt-12 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((e) => (
                    <Skeleton
                        key={e}
                        className="mx-auto h-[200px] w-full max-w-[350px] rounded-2xl"
                    />
                ))}
            </section>
        </>
    );
};

export default Loading;
