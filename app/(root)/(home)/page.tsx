import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import { getQuestions } from "@/lib/actions/question.action";
import { SearchParamsProps } from "@/types";
import Link from "next/link";

const Home = async ({ searchParams }: SearchParamsProps) => {
    const questions = await getQuestions({
        searchQuery: searchParams.q,
    });

    return (
        <>
            <div className="flex w-full justify-between">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Link href={"/ask-question"}>
                    <Button variant="orange"> Ask a Question</Button>
                </Link>
            </div>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row md:flex-col">
                <LocalSearch
                    route="/"
                    iconPosition="left"
                    placeholder="Search Questions..."
                />
                <Filter
                    filters={HomePageFilters}
                    customClasses="min-h-[40px] sm:min-w-[170px]"
                    containerClasses="hidden max-md:flex"
                />
                <HomeFilters />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ? (
                    questions.map((qn) => {
                        return <QuestionCard key={qn._id.toString()} qn={qn} />;
                    })
                ) : (
                    <NoResult
                        title="There are no questions to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and
                kickstart the discussion. your query could be the next big thing
                others learn from. Get involved! 💡"
                        linkTitle="Ask a Question"
                        linkTo="/ask-a-question"
                    />
                )}
            </div>
        </>
    );
};

export default Home;
