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
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 15 } = params;

        const query: FilterQuery<typeof Question> = {};

        const skipCount = (page - 1) * pageSize;

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        let sortOptions = {};

        switch (filter) {
            case "popular":
                sortOptions = { views: -1 };
                break;
            case "unanswered":
                query.answers = { $size: 0 };
                break;
            default:
                sortOptions = { createdAt: -1 }; // "newest" is default case
                break;
        }
        const questions = await Question.find(query)
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
            .skip(skipCount)
            .limit(pageSize)
            .sort(sortOptions)
            .lean<PopulatedQuestion[]>();

        const totalQuestions = await Question.countDocuments(query);

        const isNext = totalQuestions > skipCount + questions.length;

        return { questions, isNext };
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

            if (!existingTag.description) {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
                    {
                        method: "POST",
                        body: JSON.stringify({ tag }),
                    },
                );
                const description = await response.json();

                await Tag.findByIdAndUpdate(existingTag._id, {
                    $set: { description: description.reply }, // Set the AI-generated description
                });
            }

            tagDocuments.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id, {
            $addToSet: { tags: { $each: tagDocuments } },
        });

        revalidatePath(path);

        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        });

        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
    } catch (error) {
        console.log(error);
    }
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

        // Increment user's reputation for upvoting
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasUpvoted ? -2 : hasDownvoted ? 0 : 2 },
        });

        // Increment author's reputation for recieving an upvote
        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasUpvoted ? -10 : 10 },
        });

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
    } catch (error) {
        console.log(error);
        throw error;
    }
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
