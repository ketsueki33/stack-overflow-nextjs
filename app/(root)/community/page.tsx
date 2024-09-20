import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";

const Community = async ({ searchParams }: SearchParamsProps) => {
    const results = await getAllUsers({ searchQuery: searchParams.q });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Users</h1>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <LocalSearch
                    route="/community"
                    iconPosition="left"
                    placeholder="Search for users..."
                />
                <Filter
                    filters={UserFilters}
                    customClasses="min-h-[40px] sm:min-w-[170px]"
                />
            </div>
            <section className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {results.users.length > 0 ? (
                    results.users.map((user) => (
                        <UserCard key={user.clerkId} user={user} />
                    ))
                ) : (
                    <div className="col-span-full">
                        <NoResult
                            title="No users found..."
                            description="Your search returned no results. Please try adjusting your search terms or filters."
                        />
                    </div>
                )}
            </section>
        </>
    );
};

export default Community;
