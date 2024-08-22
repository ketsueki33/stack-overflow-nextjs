import UserCard from "@/components/cards/UserCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getAllUsers } from "@/lib/actions/user.action";

const Community = async () => {
    const results = await getAllUsers({});

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
            <section className="mt-12 flex flex-wrap gap-4">
                {results.users.length > 0 ? (
                    results.users.map((user) => (
                        <UserCard key={user.clerkId} user={user} />
                    ))
                ) : (
                    <NoResult
                        title="No users yet..."
                        description="Join now to be the first!"
                        linkTitle="Sign Up"
                        linkTo="/sign-up"
                    />
                )}
            </section>
        </>
    );
};

export default Community;
