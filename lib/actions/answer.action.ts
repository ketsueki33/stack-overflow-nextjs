"use server";

import Answer, { IAnswer } from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
    AnswerVoteParams,
    CreateAnswerParams,
    GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { PopulatedAnswer } from "@/types";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase();

        const { path, question, ...rest } = params;
        const newAnswer: IAnswer = await Answer.create({
            question,
            ...rest,
        });

        // add answer to question's answers array
        await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id },
        });

        // TODO: Increase User Reputation

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAnswers(
    params: GetAnswersParams,
): Promise<PopulatedAnswer[]> {
    try {
        connectToDatabase();

        const { questionId } = params;

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId username picture")
            .sort({ createdAt: -1 })
            .lean<PopulatedAnswer[]>();

        return answers;
    } catch (error) {
        console.error("Error in getAnswers:", error);
        throw error;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();

        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

        let updateQuery = {};

        if (hasUpvoted) {
            updateQuery = { $pull: { upvotes: userId } };
        } else if (hasDownvoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId },
            };
        } else {
            updateQuery = {
                $addToSet: { upvotes: userId },
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        // TODO: Increment author's reputation +10 for upvoting an answer.

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDatabase();

        const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

        let updateQuery = {};

        if (hasDownvoted) {
            updateQuery = { $pull: { downvotes: userId } };
        } else if (hasUpvoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId },
            };
        } else {
            updateQuery = {
                $addToSet: { downvotes: userId },
            };
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) throw new Error("Answer not found");

        // TODO: Increment author's reputation +10 for downvoting a question.

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
