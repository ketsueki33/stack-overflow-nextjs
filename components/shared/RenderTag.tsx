import Link from "next/link";
import { Badge } from "../ui/badge";
import { Types } from "mongoose";

interface Props {
    _id: Types.ObjectId;
    name: string;
    showCount?: boolean;
    totalQuestions?: number;
}

const RenderTag = ({ _id, name, showCount = false, totalQuestions }: Props) => {
    return (
        <Link href={`/tags/${_id.toString()}`}>
            <Badge
                variant="secondary"
                className="small-medium px-3 py-1 uppercase"
            >
                {name}
                {showCount && (
                    <div className="text-light400_light500">
                        <span className="mx-1">|</span>
                        {totalQuestions}
                    </div>
                )}
            </Badge>
        </Link>
    );
};
export default RenderTag;
