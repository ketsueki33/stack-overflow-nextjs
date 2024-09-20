"use server";

import Question, { IQuestion } from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsParams,
    QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { PopulatedQuestion } from "@/types";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function getQuestions(
    params: GetQuestionsParams,
): Promise<PopulatedQuestion[]> {
    try {
        connectToDatabase();

        const questions = await Question.find({})
            .populate({
                path: "tags",
                model: Tag,
                select: "name _id",
            })
            .populate({
                path: "author",
                model: User,
                select: "clerkId _id picture username",
            })
            .sort({ createdAt: -1 });

        return questions;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();

        const { title, content, tags, author, path } = params;

        const question: IQuestion = await Question.create({
            title,
            content,
            author,
            description: "",
        });

        const tagDocuments = [];

        // create tags or get them if they already exists
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                {
                    name: { $regex: new RegExp(`^${tag}$`, "i") },
                },
                {
                    $setOnInsert: { name: tag },
                    $addToSet: { questions: question._id },
                },
                { upsert: true, new: true },
            );
            tagDocuments.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id, {
            $addToSet: { tags: { $each: tagDocuments } },
        });

        revalidatePath(path);

        // TODO: Create an interaction record for user's ask question action
        // TODO: Incremenet author's reputation by +5 for creating a question
    } catch (error) {}
}

export async function getQuestionById(
    params: GetQuestionByIdParams,
): Promise<PopulatedQuestion> {
    try {
        connectToDatabase();
        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({
                path: "tags",
                model: Tag,
                select: "name _id",
            })
            .populate({
                path: "author",
                model: User,
                select: "clerkId _id picture username",
            });

        return question;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

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

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) throw new Error("Question not found");

        // TODO: Increment author's reputation +10 for upvoting a question.

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

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

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) throw new Error("Question not found");

        // TODO: Increment author's reputation +10 for downvoting a question.

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();
        const { questionId, path } = params;

        await Promise.all([
            await Question.deleteOne({ _id: questionId }),
            await Answer.deleteMany({ question: questionId }),
            await Interaction.deleteMany({ question: questionId }),
            await Tag.updateMany(
                { questions: questionId },
                { $pull: { questions: questionId } },
            ),
            await User.updateMany(
                { saved: questionId },
                { $pull: { saved: questionId } },
            ),
        ]);

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content } = params;

        const question = await Question.findById(questionId);

        if (!question) throw new Error("Question not found");

        question.title = title;
        question.content = content;

        await question.save();

        // TODO: Create an interaction record for user's ask question action
        // TODO: Incremenet author's reputation by +5 for creating a question
    } catch (error) {}
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({
                views: -1,
                upvotes: -1,
            })
            .limit(5)
            .lean<IQuestion[]>();

        return hotQuestions;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
