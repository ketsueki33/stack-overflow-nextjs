import Link from "next/link";
import { ITags } from "@/database/tag.model";
import { Badge } from "../ui/badge";

interface Props {
    tag: ITags;
}

const TagCard = async ({ tag }: Props) => {
    return (
        <Link
            href={`/tags/${tag._id}`}
            className="shadow-light100_darknone mx-auto w-full max-w-[350px]"
        >
            <div className="background-light900_dark200 light-border flex size-full flex-col items-start justify-start rounded-2xl border p-6">
                <div className="flex w-full items-center justify-between">
                    <h3 className="h3-bold line-clamp-1 break-all">
                        {tag.name.toUpperCase()}
                    </h3>
                    <Badge variant="outline">
                        <span className="paragraph-semibold text-primary-500">
                            {tag.questions.length}
                        </span>
                        &nbsp; Qns
                    </Badge>
                </div>
                <p className="body-regular mt-4 text-justify">
                    {tag.description.length > 2 ? (
                        tag.description
                    ) : (
                        <p className="text-gray-500">
                            Description not added yet
                        </p>
                    )}
                </p>
            </div>
        </Link>
    );
};
export default TagCard;
