import { Answer } from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Metric from "@/components/shared/Metric";
import { ParseHTML } from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Votes from "@/components/shared/Votes";
import { Button } from "@/components/ui/button";
import { IUser } from "@/database/user.model";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

// interface Props {
//     params: { id: string };
// }
const Page = async ({ params, searchParams }: URLProps) => {
    const question = await getQuestionById({
        questionId: params.id,
    });
    const { userId: clerkId } = auth();

    const showActionButtons = (clerkId &&
        clerkId === question.author.clerkId) as boolean;

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
                    <div className="flex justify-end">
                        <Votes
                            type="question"
                            itemId={question._id.toString()}
                            userId={mongoUser?._id.toString()}
                            hasUpvoted={
                                mongoUser
                                    ? question.upvotes.includes(mongoUser._id)
                                    : false
                            }
                            hasDownvoted={
                                mongoUser
                                    ? question.downvotes.includes(mongoUser._id)
                                    : false
                            }
                            upvotes={question.upvotes.length}
                            downvotes={question.downvotes.length}
                            hasSaved={mongoUser?.saved.includes(question._id)}
                        />
                    </div>
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
            <div className="mt-8 flex items-center justify-between">
                <div className="flex flex-wrap gap-4">
                    {question.tags.map((tag) => (
                        <RenderTag
                            key={tag._id.toString()}
                            name={tag.name}
                            _id={tag._id}
                        />
                    ))}
                </div>
                <SignedIn>
                    <div className="flex gap-5">
                        <Link href="#answer-form">
                            <Button size="sm">Answer</Button>
                        </Link>
                        {showActionButtons && (
                            <EditDeleteAction
                                type="question"
                                itemId={question._id.toString()}
                                size={18}
                            />
                        )}
                    </div>
                </SignedIn>
            </div>
            <AllAnswers
                questionId={question._id.toString()}
                userId={mongoUser?._id.toString()}
                totalAnswers={question.answers.length}
                page={parseInt(searchParams?.page || "1")}
                filter={searchParams?.filter}
            />
            {mongoUser ? (
                <Answer
                    questionId={question._id.toString()}
                    userId={mongoUser._id.toString()}
                />
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
