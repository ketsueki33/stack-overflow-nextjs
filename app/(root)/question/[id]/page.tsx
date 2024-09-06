import { Answer } from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import Metric from "@/components/shared/Metric";
import { ParseHTML } from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import { Button } from "@/components/ui/button";
import { IUser } from "@/database/user.model";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import Image from "next/image";
import Link from "next/link";

interface Props {
    params: { id: string };
}
const Page = async ({ params }: Props) => {
    const question = await getQuestionById({
        questionId: new Types.ObjectId(params.id),
    });
    const { userId: clerkId } = auth();

    let mongoUser: IUser | undefined;

    if (clerkId) {
        mongoUser = await getUserById({ userId: clerkId });
    }

    return (
        <>
            <div className="flex w-full flex-col items-start">
                <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                    <Link
                        className="flex items-center justify-start gap-1"
                        href={`/profile/${question.author.clerkId}`}
                    >
                        <Image
                            src={question.author.picture}
                            className="rounded-full"
                            width={22}
                            height={22}
                            alt="profile"
                        />
                        <p className="paragraph-semibold text-dark300_light700">
                            {question.author.username}
                        </p>
                    </Link>
                    <div className="flex justify-end"> (VOTING)</div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5">
                    {question.title}
                </h2>
                <div className="mb-8 mt-5 flex flex-wrap gap-4">
                    <Metric
                        imgUrl="/assets/icons/clock.svg"
                        alt="Asked on"
                        value={` asked ${getTimestamp(question.createdAt)}`}
                        title=""
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/message.svg"
                        alt="answers"
                        value={formatNumber(question.answers.length)}
                        title="Answers"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="Views"
                        value={formatNumber(question.views)}
                        title="Views"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
            </div>
            <ParseHTML data={question.content} />
            <div className="mt-8 flex flex-wrap gap-4">
                {question.tags.map((tag) => (
                    <RenderTag
                        key={tag._id.toString()}
                        name={tag.name}
                        _id={tag._id}
                    />
                ))}
            </div>

            <AllAnswers
                questionId={question._id}
                userId={JSON.stringify(mongoUser?._id)}
                totalAnswers={question.answers.length}
            />
            {mongoUser ? (
                <Answer questionId={question._id} userId={mongoUser._id} />
            ) : (
                <div className="mt-5 flex w-full justify-end">
                    <Link href="/sign-in">
                        <Button variant="secondary">Login to Answer</Button>
                    </Link>
                </div>
            )}
        </>
    );
};
export default Page;
