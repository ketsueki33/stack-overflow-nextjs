"use server";

import Answer, { IAnswer } from "@/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
    AnswerVoteParams,
    CreateAnswerParams,
    DeleteAnswerParams,
    GetAnswersParams,
} from "./shared.types";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { PopulatedAnswer } from "@/types";
import Interaction from "@/database/interaction.model";

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

        const { questionId, sortBy } = params;

        let sortOptions = {};

        switch (sortBy) {
            case "highest_upvotes":
                sortOptions = { upvotes: -1 };
                break;
            case "lowest_upvotes":
                sortOptions = { upvotes: 1 };
                break;
            case "recent":
                sortOptions = { createdAt: -1 };
                break;
            case "old":
                sortOptions = { createdAt: 1 };
                break;
            case "controversial":
                sortOptions = { downvotes: -1 };
                break;
            default:
                break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId username picture")
            .sort(sortOptions)
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

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        connectToDatabase();
        const { answerId, path } = params;

        const answer = await Answer.findById(answerId).lean<IAnswer>();

        if (!answer) {
            throw new Error("Answer not found");
        }

        await Promise.all([
            await Answer.deleteOne({ _id: answerId }),
            await Interaction.deleteMany({ answer: answerId }),
            await Question.updateMany(
                { _id: answer.question },
                { $pull: { answers: answerId } },
            ),
        ]);

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
