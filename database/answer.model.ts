import { Schema, models, model, Types } from "mongoose";

export interface IAnswer {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    question: Types.ObjectId;
    content: string;
    upvotes: Types.ObjectId[];
    downvotes: Types.ObjectId[];
    createdAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
});

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
