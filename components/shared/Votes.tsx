"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
    downvoteQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatNumber } from "@/lib/utils";
import { ArrowBigDown, ArrowBigUp, Bookmark } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
    type: "question" | "answer";
    itemId: string;
    userId: string | undefined;
    upvotes: number;
    hasUpvoted: boolean;
    downvotes: number;
    hasDownvoted: boolean;
    hasSaved?: boolean;
}
const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    hasDownvoted,
    hasUpvoted,
    downvotes,
    hasSaved,
}: Props) => {
    const pathname = usePathname();
    const handleSave = () => {
        // TODO: write server action for saving questions
    };

    const handleVote = async (action: "upvote" | "downvote") => {
        if (!userId) {
            alert("YOU MUST BE SIGNED IN"); // REVIEW:
            return;
        }
        // TODO: call toaster to let user log in

        if (action === "upvote") {
            if (type === "question") {
                await upvoteQuestion({
                    questionId: itemId,
                    userId,
                    hasDownvoted,
                    hasUpvoted,
                    path: pathname,
                });
            } else {
                await upvoteAnswer({
                    answerId: itemId,
                    userId,
                    hasDownvoted,
                    hasUpvoted,
                    path: pathname,
                });
            }
        }
        if (action === "downvote") {
            if (type === "question") {
                await downvoteQuestion({
                    questionId: itemId,
                    userId,
                    hasDownvoted,
                    hasUpvoted,
                    path: pathname,
                });
            } else {
                await downvoteAnswer({
                    answerId: itemId,
                    userId,
                    hasDownvoted,
                    hasUpvoted,
                    path: pathname,
                });
            }
        }
    };

    return (
        <div className="flex-center gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1">
                    <span
                        onClick={() => {
                            handleVote("upvote");
                        }}
                    >
                        {hasUpvoted ? (
                            <ArrowBigUp
                                className="cursor-pointer text-green-500 hover:text-green-400"
                                fill="currentColor"
                            />
                        ) : (
                            <ArrowBigUp className="cursor-pointer text-gray-500 hover:text-green-400" />
                        )}
                    </span>
                    <p className="body-medium text-dark400_light900">
                        {formatNumber(upvotes)}
                    </p>
                </div>
                <div className="flex-center gap-1">
                    <span
                        onClick={() => {
                            handleVote("downvote");
                        }}
                    >
                        {hasDownvoted ? (
                            <ArrowBigDown
                                className="cursor-pointer text-red-500 hover:text-red-400"
                                fill="currentColor"
                            />
                        ) : (
                            <ArrowBigDown className="cursor-pointer text-gray-500 hover:text-red-400" />
                        )}
                    </span>
                    <p className="body-medium text-dark400_light900">
                        {formatNumber(downvotes)}
                    </p>
                </div>
            </div>
            {type === "question" && (
                <span onClick={handleSave}>
                    {hasSaved ? (
                        <Bookmark
                            className="size-5 cursor-pointer text-yellow-500 hover:text-yellow-400"
                            fill="currentColor"
                        />
                    ) : (
                        <Bookmark className="size-5 cursor-pointer text-gray-500 hover:text-yellow-400" />
                    )}
                </span>
            )}
        </div>
    );
};
export default Votes;
