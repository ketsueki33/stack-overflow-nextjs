"use client";

import { useToast } from "@/hooks/use-toast";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
    downvoteQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import { ArrowBigDown, ArrowBigUp, Bookmark } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

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
    const router = useRouter();

    const { toast } = useToast();

    useEffect(() => {
        if (type === "question") viewQuestion({ questionId: itemId, userId });
    }, [itemId, userId, pathname, router, type]);

    const handleSave = async () => {
        if (!userId) {
            toast({
                variant: "destructive",
                title: "Please Sign in",
                description: "You must be signed in to perform this action.",
            });
            return;
        }

        await toggleSaveQuestion({
            userId,
            questionId: itemId,
            path: pathname,
        });
    };

    const handleVote = async (action: "upvote" | "downvote") => {
        if (!userId) {
            toast({
                variant: "destructive",
                title: "Please Sign in",
                description: "You must be signed in to perform this action.",
            });
            return;
        }

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
