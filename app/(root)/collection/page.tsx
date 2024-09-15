import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const Collection = async () => {
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

    const questions = await getSavedQuestions({ clerkId: userId });

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
                        title="You haven't saved any questions yet"
                        description="Your saved questions will appear here. Save the questions you want to go back to later without the hassle of searching for them again."
                        linkTitle="Go to Home Page"
                        linkTo="/"
                    />
                )}
            </div>
        </>
    );
};

export default Collection;
