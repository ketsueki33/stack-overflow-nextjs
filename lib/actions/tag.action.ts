"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag, { ITags } from "@/database/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        const { userId } = params;
        const user = await User.findById(userId);

        if (!user) throw new Error("User not found");

        // TODO: Find interactions for the user and group by tags...
        return [
            { _id: "1", name: "Temp1" },
            { _id: "2", name: "Temp2" },
            { _id: "3", name: "Temp3" },
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
