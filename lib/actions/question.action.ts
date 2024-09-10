"use server";

import Question, { IQuestion } from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { PopulatedQuestion } from "@/types";

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
