import { getUserQuestions } from "@/lib/actions/user.action";
import QuestionCard from "../cards/QuestionCard";

interface Props {
    searchParams?: string;
    userId: string;
    clerkId?: string | null;
}

const QuestionsTab = async ({ searchParams, userId, clerkId }: Props) => {
    const questions = await getUserQuestions({ userId, page: 1 });

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
        </>
    );
};
export default QuestionsTab;
