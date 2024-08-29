"use server";

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetUserByIdParams,
    UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";

export async function getUserById(params: GetUserByIdParams) {
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
