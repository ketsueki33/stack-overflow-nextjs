import { PopulatedQuestion } from "@/types";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface Props {
    qn: PopulatedQuestion;
}
const QuestionCard = ({ qn }: Props) => {
    const timestamp = getTimestamp(qn.createdAt);
    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div className="">
                    <span className="subtle-regular text-dark400_light700 mb-2 line-clamp-1 flex sm:hidden">
                        {timestamp}
                    </span>
                    <Link href={`/question/${qn._id}`}>
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-3 flex-1">
                            {qn.title}
                        </h3>
                    </Link>
                </div>
                {/* TODO: If signed in add edit & delete actions */}
            </div>
            <div className="mt-3.5 flex flex-wrap gap-2">
                {qn.tags.map((tag) => (
                    <RenderTag
                        key={tag._id.toString()}
                        name={tag.name}
                        _id={tag._id}
                    />
                ))}
            </div>
            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgUrl={qn.author.picture}
                    alt="User"
                    value={qn.author.username}
                    title={"- asked " + timestamp}
                    href={`/profile/${qn.author._id}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                />
                <div className="flex gap-4">
                    <Metric
                        imgUrl="/assets/icons/like.svg"
                        alt="Upvotes"
                        value={formatNumber(qn.upvotes.length)}
                        title="Votes"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/message.svg"
                        alt="answers"
                        value={formatNumber(qn.answers.length)}
                        title="Answers"
                        textStyles="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="Views"
                        value={formatNumber(qn.views)}
                        title="Views"
                        textStyles="small-medium text-dark400_light800"
                    />
                </div>
            </div>
        </div>
    );
};
export default QuestionCard;
