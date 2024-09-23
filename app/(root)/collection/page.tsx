import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";

const Collection = async ({ searchParams }: SearchParamsProps) => {
    const { userId } = auth();

    if (!userId)
        return (
            <NoResult
                title="You must be signed in to view saved questions"
                description="Your saved questions will appear here. Save the questions you want to go back to later without the hassle of searching for them again."
                linkTitle="Sign In"
                linkTo="/sign-in"
            />
        );

    const { questions, isNext } = await getSavedQuestions({
        clerkId: userId,
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
    });

    const isSearching = Boolean(searchParams.q || searchParams.filter);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <LocalSearch
                    route="/collection"
                    iconPosition="left"
                    placeholder="Search your saved questions..."
                />
                <Filter
                    filters={QuestionFilters}
                    customClasses="min-h-[40px] sm:min-w-[170px]"
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ? (
                    questions.map((qn) => {
                        return <QuestionCard key={qn._id.toString()} qn={qn} />;
                    })
                ) : (
                    <NoResult
                        title={
                            isSearching
                                ? "No questions found..."
                                : "You haven't saved any questions yet"
                        }
                        description={
                            isSearching
                                ? "Your search returned no results. Please try adjusting your search terms or filters."
                                : "Your saved questions will appear here. Save the questions you want to go back to later without the hassle of searching for them again."
                        }
                        linkTitle={isSearching ? undefined : "Go to Home Page"}
                        linkTo={isSearching ? undefined : "/"}
                    />
                )}
            </div>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={isNext}
            />
        </>
    );
};

export default Collection;
