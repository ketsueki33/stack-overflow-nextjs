import { getUserAnswers } from "@/lib/actions/user.action";
import AnswerCard from "../cards/AnswerCard";

interface Props {
    searchParams?: string;
    userId: string;
    clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
    const answers = await getUserAnswers({ userId, page: 1 });

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
                        You have not posted any questions yet...
                    </p>
                )}
            </div>
        </>
    );
};
export default AnswersTab;
