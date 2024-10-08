import { BADGE_CRITERIA } from "@/constants";
import { IUser } from "@/database/user.model";
import { Types } from "mongoose";

export interface CreateAnswerParams {
    content: string;
    author: Types.ObjectId | string; // User ID
    question: Types.ObjectId | string; // Question ID
    path: string;
}

export interface GetAnswersParams {
    questionId: Types.ObjectId | string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
}

export interface AnswerVoteParams {
    answerId: string;
    userId: string;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    path: string;
}

export interface DeleteAnswerParams {
    answerId: string;
    path: string;
}

export interface SearchParams {
    query: string | null;
    type?: string | null;
}

export interface RecommendedParams {
    userId: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
}

export interface ViewQuestionParams {
    questionId: string;
    userId: string | undefined;
}

export interface JobFilterParams {
    query: string;
    page: string;
}

export interface GetQuestionsParams {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    filter?: string;
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
    author: string;
    path: string;
}

export interface GetQuestionByIdParams {
    questionId: string;
}

export interface QuestionVoteParams {
    questionId: string;
    userId: string;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    path: string;
}

export interface DeleteQuestionParams {
    questionId: string;
    path: string;
}

export interface EditQuestionParams {
    questionId: string;
    title: string;
    content: string;
}

export interface GetAllTagsParams {
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
    tagId: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
    userId: Types.ObjectId;
    limit?: number;
}

export interface CreateUserParams {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface GetUserByIdParams {
    userId: string;
}

export interface GetAllUsersParams {
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
    clerkId: string;
    updateData: Partial<IUser>;
    path: string;
    fromClerk: boolean;
}

export interface ToggleSaveQuestionParams {
    userId: string;
    questionId: string;
    path: string;
}

export interface GetSavedQuestionsParams {
    clerkId: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string;
}

export interface GetUserStatsParams {
    userId: string;
    page?: number;
    pageSize?: number;
}

export interface DeleteUserParams {
    clerkId: string;
}

export interface UrlQueryParams {
    params: string;
    key: string;
    value: string | null;
}

export interface RemoveUrlQueryParams {
    params: string;
    keys: string[];
}

export interface BadgeParam {
    criteria: {
        type: keyof typeof BADGE_CRITERIA;
        count: number;
    }[];
}
