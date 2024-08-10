import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/home/HomeFilters";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

const questions = [
    {
        _id: "1",
        title: "Cascading Deletes in SQLAlchemy?",
        tags: [
            { _id: "1", name: "python" },
            { _id: "2", name: "sql" },
        ],
        author: {
            _id: "1",
            name: "John Doe",
            picture: "/assets/icons/au.svg",
        },
        upvotes: 1500000,
        views: 500552,
        answers: [],
        createdAt: new Date("2024-08-01T12:00:00.000Z"),
    },
    {
        _id: "2",
        title: "How to center a div?",
        tags: [
            { _id: "3", name: "css" },
            { _id: "4", name: "html" },
        ],
        author: {
            _id: "2",
            name: "Jane Smith",
            picture: "/assets/icons/au.svg",
        },
        upvotes: 5,
        views: 50,
        answers: [] as string[],
        createdAt: new Date("2021-09-02T10:30:00.000Z"),
    },
];

const Home = () => {
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
                        return <QuestionCard key={qn._id} qn={qn} />;
                    })
                ) : (
                    <NoResult
                        title="There are no questions to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and
                kickstart the discussion. our query could be the next big thing
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
