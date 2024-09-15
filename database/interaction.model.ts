import { models, model, Schema, Types } from "mongoose";

export interface IInteractions {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    action: string;
    question: Types.ObjectId;
    answer: Types.ObjectId;
    tags: Types.ObjectId[];
    createdAt: Date;
}

const InteractionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question" },
    answer: { type: Schema.Types.ObjectId, ref: "Question" },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    createdAt: { type: Date, default: Date.now },
});

const Interaction =
    models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
 