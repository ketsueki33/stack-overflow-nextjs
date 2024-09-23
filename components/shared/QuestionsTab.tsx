import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
    const { questions, isNext } = await getUserQuestions({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });
    console.log("client");

    return (
        <>
            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ? (
                    questions.map((qn) => {
                        return (
                            <QuestionCard
                                key={qn._id.toString()}
                                qn={qn}
                                clerkId={clerkId}
                            />
                        );
                    })
                ) : (
                    <p className="italic text-gray-500">
                        You have not posted any questions yet...
                    </p>
                )}
            </div>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={isNext}
                scroll={false}
            />
        </>
    );
};
export default QuestionsTab;
