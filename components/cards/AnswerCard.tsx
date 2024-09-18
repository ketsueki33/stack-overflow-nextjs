import Link from "next/link";

import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";
import { PopulatedAnswerWithQuestionTitle } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
    clerkId?: string | null;
    answer: PopulatedAnswerWithQuestionTitle;
}

const AnswerCard = ({ clerkId, answer }: Props) => {
    const showActionButtons = (clerkId &&
        clerkId === answer.author.clerkId) as boolean;

    return (
        <div className="card-wrapper rounded-[10px] px-11 py-9">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 mb-2 line-clamp-1 flex sm:hidden">
                        {getTimestamp(answer.createdAt)}
                    </span>
                    <Link
                        href={`/question/${answer.question._id.toString()}/#${answer._id.toString()}`}
                    >
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                            {answer.question.title}
                        </h3>
                    </Link>
                </div>
                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="answer"
                            itemId={answer._id.toString()}
                        />
                    )}
                </SignedIn>
            </div>

            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgUrl={answer.author.picture}
                    alt="user avatar"
                    value={answer.author.username}
                    title={` • answered ${getTimestamp(answer.createdAt)}`}
                    href={`/profile/${answer.author.clerkId}`}
                    textStyles="body-medium text-dark400_light700"
                    isAuthor
                />

                <div className="flex-center gap-3">
                    <Metric
                        imgUrl="/assets/icons/like.svg"
                        alt="like icon"
                        value={formatNumber(answer.upvotes.length)}
                        title=" Votes"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
            </div>
        </div>
    );
};

export default AnswerCard;
