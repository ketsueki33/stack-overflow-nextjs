import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import {
    getQuestions,
    getRecommendedQuestions,
} from "@/lib/actions/question.action";
import { PopulatedQuestion, SearchParamsProps } from "@/types";
import Link from "next/link";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";

interface Result {
    questions: PopulatedQuestion[];
    isNext: boolean;
}

export const metadata: Metadata = {
    title: "Home",
};

const Home = async ({ searchParams }: SearchParamsProps) => {
    const { userId } = auth();
    let result: Result;

    if (searchParams?.filter === "recommended") {
        if (userId) {
            result = await getRecommendedQuestions({
                userId,
                searchQuery: searchParams.q,
                page: searchParams.page ? +searchParams.page : 1,
            });
        } else {
            result = {
                questions: [],
                isNext: false,
            };
        }
    } else {
        result = await getQuestions({
            searchQuery: searchParams.q,
            filter: searchParams.filter,
            page: searchParams.page ? +searchParams.page : 1,
        });
    }

    const { questions, isNext } = result;

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

            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={isNext}
            />
        </>
    );
};

export default Home;
