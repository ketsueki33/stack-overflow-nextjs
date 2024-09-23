"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User, { IUser } from "@/database/user.model";
import "@/database/tag.model";

import {
    PopulatedAnswerWithQuestionTitle,
    PopulatedQuestion,
    UserWithPopulatedQuestions,
} from "@/types";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetSavedQuestionsParams,
    GetUserByIdParams,
    GetUserStatsParams,
    ToggleSaveQuestionParams,
    UpdateUserParams,
} from "./shared.types";

export const isUsernameAvailable = async (
    username: string,
): Promise<boolean> => {
    const { userId } = auth();
    try {
        const users = await clerkClient.users.getUserList({
            username: [username],
        });

        if (users.totalCount === 0) return true;

        const user = users.data[0];
        if (user.id === userId) return true;

        return false;
    } catch (error) {
        console.error("Error checking username availability:", error);
        throw error;
    }
};

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

        const { clerkId, updateData, path, fromClerk } = params;

        if (!fromClerk) {
            await clerkClient.users.updateUser(clerkId, {
                username: updateData.username,
                firstName: updateData.name?.split(" ")[0],
                lastName: updateData.name?.split(" ").slice(1).join(" "),
            });
        }

        const user = await User.findOneAndUpdate(
            { clerkId },
            updateData,
        ).lean<IUser>();

        revalidatePath(path);

        return {
            _id: user?._id.toString(),
            name: user?.name,
            username: user?.username,
            bio: user?.bio,
            location: user?.location,
            portfolioWebsite: user?.portfolioWebsite,
        };
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

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();
        const { searchQuery, filter, page = 1, pageSize = 15 } = params;

        const query: FilterQuery<typeof User> = {};
        const skipCount = (page - 1) * pageSize;

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        let sortOptions = {};

        switch (filter) {
            case "new_users":
                sortOptions = { joinedAt: -1 };
                break;
            case "old_users":
                sortOptions = { joinedAt: 1 };
                break;
            case "top_contributors":
                sortOptions = { reputation: -1 };
                break;
            default:
                break;
        }

        const users = await User.find(query)
            .skip(skipCount)
            .limit(pageSize)
            .sort(sortOptions)
            .lean<IUser[]>();

        const totalUsers = await User.countDocuments(query);

        const isNext = totalUsers > skipCount + users.length;

        return { users, isNext };
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
            pageSize = 15,
            filter,
            searchQuery,
        } = params;

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
            case "most_recent":
                sortOptions = { createdAt: -1 };
                break;
            case "oldest":
                sortOptions = { createdAt: 1 };
                break;
            case "most_voted":
                sortOptions = { upvotes: -1 };
                break;
            case "most_viewed":
                sortOptions = { views: -1 };
                break;
            case "most_answered":
                sortOptions = { answers: -1 };
                break;
            default:
                break;
        }

        const user = await User.findOne({ clerkId })
            .populate({
                path: "saved",
                match: query,
                options: {
                    sort: sortOptions,
                    populate: [
                        {
                            path: "author",
                            select: "_id clerkId username picture",
                        },
                        { path: "tags", select: "_id name" },
                    ],
                    skip: skipCount,
                    limit: pageSize,
                },
            })
            .lean<UserWithPopulatedQuestions>();

        if (!user) {
            throw new Error("User not found");
        }

        const savedQuestions = user.saved;

        const simpleUser = await User.findOne({ clerkId }).lean<IUser>();
        const totalQuestions = simpleUser!.saved.length;

        const isNext = totalQuestions > skipCount + savedQuestions.length;

        return { questions: savedQuestions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId }).lean<IUser>();

        if (!user) {
            throw new Error("User not found");
        }

        const totalQuestions = await Question.countDocuments({
            author: user._id,
        });
        const totalAnswers = await Answer.countDocuments({
            author: user._id,
        });

        return { user, totalAnswers, totalQuestions };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 15 } = params;

        const skipCount = (page - 1) * pageSize;

        const userQuestions = await Question.find({ author: userId })
            .skip(skipCount)
            .limit(pageSize)
            .sort({ views: -1, upvotes: -1 })
            .populate("tags", "_id name")
            .populate("author", "_id clerkId username picture")
            .lean<PopulatedQuestion[]>();

        const totalQuestions = await Question.countDocuments({
            author: userId,
        });

        const isNext = totalQuestions > skipCount + userQuestions.length;

        return { questions: userQuestions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 15 } = params;

        const skipCount = (page - 1) * pageSize;

        const userAnswers = await Answer.find({ author: userId })
            .skip(skipCount)
            .limit(pageSize)
            .sort({ upvotes: -1 })
            .populate("author", "_id clerkId username picture")
            .populate("question", "_id title")
            .lean<PopulatedAnswerWithQuestionTitle[]>();

        const totalAnswers = await Answer.countDocuments({
            author: userId,
        });

        const isNext = totalAnswers > skipCount + userAnswers.length;

        return { answers: userAnswers, isNext };
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
