import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
    const { answers, isNext } = await getUserAnswers({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <>
            <div className="mt-10 flex w-full flex-col gap-6">
                {answers.length > 0 ? (
                    answers.map((ans) => {
                        return (
                            <AnswerCard
                                key={ans._id.toString()}
                                answer={ans}
                                clerkId={clerkId}
                            />
                        );
                    })
                ) : (
                    <p className="italic text-gray-500">
                        You have not answered any questions yet...
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
export default AnswersTab;
