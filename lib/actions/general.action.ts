"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const searchTypes = ["question", "answer", "tag", "answer"];

export async function globalSearch(params: SearchParams) {
    try {
        connectToDatabase();

        const { query, type } = params;
        const regexQuery = { $regex: query, $options: "i" };

        let results = [];

        const modelAndTypes = [
            { model: Question, searchField: "title", type: "question" },
            { model: User, searchField: "username", type: "user" },
            { model: Answer, searchField: "content", type: "answer" },
            { model: Tag, searchField: "name", type: "tag" },
        ];

        if (!type || !searchTypes.includes(type)) {
            // search everything

            for (const { model, searchField, type } of modelAndTypes) {
                const queryResults = await model
                    .find({
                        [searchField]: regexQuery,
                    })
                    .limit(2);

                // console.log({ type, queryResults });

                results.push(
                    ...queryResults.map((item) => ({
                        title:
                            type === "answer"
                                ? `Answer containing ${query}`
                                : type === "tag"
                                  ? item[searchField].toUpperCase()
                                  : item[searchField],
                        type,
                        id:
                            type === "user"
                                ? item.clerkId
                                : type === "answer"
                                  ? item.question
                                  : item._id,
                    })),
                );
            }
        } else {
            // search specific model
            const modelInfo = modelAndTypes.find((item) => item.type === type);

            if (!modelInfo) {
                throw new Error("invalid search type");
            }
            const queryResults = await modelInfo.model
                .find({
                    [modelInfo.searchField]: regexQuery,
                })
                .limit(8);

            results = queryResults.map((item) => ({
                title:
                    type === "answer"
                        ? `Answer containing ${query}`
                        : type === "tag"
                          ? item[modelInfo.searchField].toUpperCase()
                          : item[modelInfo.searchField],
                type,
                id:
                    type === "user"
                        ? item.clerkId
                        : type === "answer"
                          ? item.question
                          : item._id,
            }));
        }
        return JSON.stringify(results);
    } catch (error) {
        console.log(error);
        throw error;
    }
}
