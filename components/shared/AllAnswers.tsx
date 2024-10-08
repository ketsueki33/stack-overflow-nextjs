import { AnswerFilters } from "@/constants/filters";
import Filter from "./Filter";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { ParseHTML } from "./ParseHTML";
import Votes from "./Votes";
import { auth } from "@clerk/nextjs/server";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "./EditDeleteAction";
import Pagination from "./Pagination";

interface Props {
    questionId: string;
    userId: string | undefined;
    totalAnswers: number;
    page?: number;
    filter?: string;
}

const AllAnswers = async ({
    questionId,
    userId,
    totalAnswers,
    filter,
    page,
}: Props) => {
    const { answers, isNext } = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter,
    });

    const { userId: clerkId } = auth();

    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="h3-bold text-primary-500">{`${totalAnswers} ${totalAnswers === 1 ? "Answer" : "Answers"}`}</h3>
                <Filter filters={AnswerFilters} />
            </div>
            <div>
                {answers.map((answer) => {
                    const showActionButtons = (clerkId &&
                        clerkId === answer.author.clerkId) as boolean;
                    return (
                        <article
                            className="light-border border-b py-10"
                            key={answer._id.toString()}
                        >
                            <div className="flex items-center justify-between">
                                <div className="mb-8 flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center sm:gap-2">
                                    <Link
                                        className="flex flex-1 items-start gap-1 sm:items-center"
                                        href={`/profile/${answer.author.clerkId}`}
                                    >
                                        <Image
                                            src={answer.author.picture}
                                            alt="user image"
                                            height={18}
                                            width={18}
                                            className="rounded-full object-cover max-sm:mt-0.5"
                                        />
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <p className="body-semibold text-dark300_light700">
                                                {answer.author.username}
                                            </p>
                                            <p className="small-regular text-dark400_light500 mt-0.5 line-clamp-1">
                                                <span className="max-sm:hidden">
                                                    &nbsp;-&nbsp;
                                                </span>
                                                answered{" "}
                                                {getTimestamp(answer.createdAt)}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="flex justify-end gap-3">
                                        <Votes
                                            type="answer"
                                            itemId={answer._id.toString()}
                                            userId={userId}
                                            hasUpvoted={answer.upvotes.some(
                                                (upvoteId) =>
                                                    upvoteId.toString() ===
                                                    userId,
                                            )}
                                            hasDownvoted={answer.downvotes.some(
                                                (downvoteId) =>
                                                    downvoteId.toString() ===
                                                    userId,
                                            )}
                                            upvotes={answer.upvotes.length}
                                            downvotes={answer.downvotes.length}
                                        />
                                        <SignedIn>
                                            {showActionButtons && (
                                                <EditDeleteAction
                                                    size={18}
                                                    type="answer"
                                                    itemId={answer._id.toString()}
                                                />
                                            )}
                                        </SignedIn>
                                    </div>
                                </div>
                            </div>
                            <ParseHTML data={answer.content} />
                        </article>
                    );
                })}
            </div>

            <Pagination pageNumber={page ? +page : 1} isNext={isNext} />
        </div>
    );
};
export default AllAnswers;
