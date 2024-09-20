import { ChevronRight } from "lucide-react";
import Link from "next/link";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getPopularTags } from "@/lib/actions/tag.action";
import console from "console";

const RightSidebar = async () => {
    const hotQuestions = await getHotQuestions();
    const popularTags = await getPopularTags();

    console.log({ popularTags });

    return (
        <section className="background-light900_dark200 light-border text-dark200_light900 sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-5 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden max-lg:px-2 lg:w-[350px]">
            <div>
                <h3 className="h3-bold">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map((qn) => (
                        <Link
                            className="flex items-center justify-between gap-5"
                            href={`/question /${qn._id}`}
                            key={qn._id.toString()}
                        >
                            <p className="body-regular">{qn.title}</p>
                            <ChevronRight className="min-w-4" size={16} />
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mt-16">
                <h3 className="h3-bold">Popular Tags</h3>
                <div className="mt-7 flex flex-wrap gap-3">
                    {popularTags.map((tag) => (
                        <RenderTag
                            _id={tag._id}
                            showCount
                            name={tag.name}
                            totalQuestions={tag.totalQuestions}
                            key={tag._id.toString()}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
export default RightSidebar;
