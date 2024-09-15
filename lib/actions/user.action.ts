"use server";

import Question from "@/database/question.model";
import User, { IUser } from "@/database/user.model";
import { UserWithPopulatedQuestions } from "@/types";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetSavedQuestionsParams,
    GetUserByIdParams,
    ToggleSaveQuestionParams,
    UpdateUserParams,
} from "./shared.types";

export async function getUserById(params: GetUserByIdParams): Promise<IUser> {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser = await User.create(userData);

        return newUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const { clerkId, updateData, path } = params;

        const user = await User.findOneAndUpdate({ clerkId }, updateData);

        revalidatePath(path);

        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const { clerkId } = params;

        const user = await User.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error("User not found");
        }

        // TODO: add deleted user for comments, questions, answers.

        const deletedUser = await User.findByIdAndDelete(user._id);

        return deletedUser;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllUsers(
    params: GetAllUsersParams,
): Promise<{ users: IUser[] }> {
    try {
        connectToDatabase();
        // const { page = 1, pageSize = 20, filter, searchQuery } = params;

        const users = await User.find({}).sort({ joinedAt: -1 });

        return { users };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase();
        const { userId, questionId, path } = params;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const isQuestionSaved = user.saved.includes(questionId);

        if (isQuestionSaved) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: { saved: questionId },
                },
                { new: true },
            );
        } else {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { saved: questionId },
                },
                { new: true },
            );
        }
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        connectToDatabase();

        const {
            clerkId,
            page = 1,
            pageSize = 10,
            filter,
            searchQuery,
        } = params;

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, "i") } }
            : {};

        const user = await User.findOne({ clerkId })
            .populate({
                path: "saved",
                match: query,
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
            .lean<UserWithPopulatedQuestions>();

        if (!user) {
            throw new Error("User not found");
        }

        const savedQuestions = user.saved;

        return savedQuestions;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/*
export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();
    } catch (error) {
        console.log(error);
        throw error;
    }
}
*/
