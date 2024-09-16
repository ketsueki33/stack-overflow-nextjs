"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
    GetAllTagsParams,
    GetQuestionsByTagIdParams,
    GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITags } from "@/database/tag.model";
import { FilterQuery, Types } from "mongoose";
import { TagWithPopulatedQuestions } from "@/types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        const { userId } = params;
        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        // TODO: Find interactions for the user and group by tags...
        return [
            {
                _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
                name: "Temp1",
            },
            {
                _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
                name: "Temp2",
            },
            {
                _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
                name: "Temp3",
            },
        ];
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(
    params: GetAllTagsParams,
): Promise<{ tags: ITags[] }> {
    try {
        connectToDatabase();

        const tags = await Tag.find({}).sort({ createdAt: -1 });
        return { tags };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function getQuestionByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase();
        const { tagId, page = 1, pageSize = 10, searchQuery } = params;

        const tagFilter: FilterQuery<ITags> = { _id: tagId };

        const tag = await Tag.findOne(tagFilter)
            .populate({
                path: "questions",
                match: searchQuery
                    ? { title: { $regex: searchQuery, $options: "i" } }
                    : {},
                options: {
                    sort: {
                        createdAt: -1,
                    },
                    populate: [
                        {
                            path: "author",
                            select: "_id clerkId username picture",
                        },
                        { path: "tags", select: "_id name" },
                    ],
                },
            })
            .lean<TagWithPopulatedQuestions>();

        if (!tag) {
            throw new Error("User not found");
        }

        const questions = tag.questions;

        return { questions, tagTitle: tag.name.toUpperCase() };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
