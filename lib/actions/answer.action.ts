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
import User from "@/database/user.model";

export async function createAnswer(params: CreateAnswerParams) {
    try {
        connectToDatabase();

        const { path, question, content, author } = params;

        const newAnswer: IAnswer = await Answer.create({
            question,
            content,
            author,
        });

        // add answer to question's answers array
        const questionObj = await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id },
        });

        // Increase User Reputation
        await Interaction.create({
            user: author,
            action: "answer",
            question,
            answer: newAnswer._id,
            tags: questionObj.tags,
        });

        await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAnswers(params: GetAnswersParams) {
    try {
        connectToDatabase();

        const { questionId, sortBy, page = 1, pageSize = 10 } = params;

        let sortOptions = {};
        const skipCount = page >= 1 ? (page - 1) * pageSize : 0;

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
            .skip(skipCount)
            .limit(pageSize)
            .sort(sortOptions)
            .lean<PopulatedAnswer[]>();

        const totalAnswers = await Answer.countDocuments({
            question: questionId,
        });

        const isNext = totalAnswers > skipCount + answers.length;

        return { answers, isNext };
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

        // Increment user's reputation for upvoting
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasUpvoted ? -2 : hasDownvoted ? 0 : 2 },
        });

        // Increment author's reputation for recieving an upvote
        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasUpvoted ? -10 : 10 },
        });

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

        // Increment user's reputation for downvoting
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasDownvoted ? -2 : hasUpvoted ? 0 : 2 },
        });

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
