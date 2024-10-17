import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Question",
};
const EditQuestion = async ({ params }: ParamsProps) => {
    const { userId } = auth();

    if (!userId) return null;

    const mongoUser = await getUserById({ userId });
    const question = await getQuestionById({ questionId: params.id });

    if (userId !== question.author.clerkId) throw new Error("Unauthorized"); // REVIEW:

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
            <div className="mt-9">
                <Question
                    purpose="edit"
                    questionDetails={JSON.stringify(question)}
                    mongoUserId={mongoUser._id.toString()}
                />
            </div>
        </>
    );
};
export default EditQuestion;
