"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITags } from "@/database/tag.model";
import { Types } from "mongoose";

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
