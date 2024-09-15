import { BADGE_CRITERIA } from "@/constants";
import { IAnswer } from "@/database/answer.model";
import { IQuestion } from "@/database/question.model";
import { ITags } from "@/database/tag.model";
import { IUser } from "@/database/user.model";

export type Mode = "dark" | "light" | "system";

export interface SidebarLink {
    imgURL: string;
    route: string;
    label: string;
}

export interface Job {
    id?: string;
    employer_name?: string;
    employer_logo?: string | undefined;
    employer_website?: string;
    job_employment_type?: string;
    job_title?: string;
    job_description?: string;
    job_apply_link?: string;
    job_city?: string;
    job_state?: string;
    job_country?: string;
}

export interface Country {
    name: {
        common: string;
    };
}

export interface ParamsProps {
    params: { id: string };
}

export interface SearchParamsProps {
    searchParams: { [key: string]: string | undefined };
}

export interface URLProps {
    params: { id: string };
    searchParams: { [key: string]: string | undefined };
}

export interface BadgeCounts {
    GOLD: number;
    SILVER: number;
    BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export interface PopulatedQuestion extends Omit<IQuestion, "author" | "tags"> {
    author: Pick<IUser, "_id" | "clerkId" | "username" | "picture">;
    tags: Pick<ITags, "_id" | "name">[];
}

export interface PopulatedAnswer extends Omit<IAnswer, "author"> {
    author: Pick<IUser, "_id" | "clerkId" | "username" | "picture">;
}

export interface UserWithPopulatedQuestions extends Omit<IUser, "saved"> {
    saved: PopulatedQuestion[];
}
