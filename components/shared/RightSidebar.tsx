import { ChevronRight } from "lucide-react";
import Link from "next/link";
import RenderTag from "./RenderTag";
import { Types } from "mongoose";

const tempQuestions = [
    {
        _id: 1,
        title: "How to implement server-side rendering (SSR) for user profiles in Next.js Stack Overflow clone?",
    },
    {
        _id: 2,
        title: "Next.js Stack Overflow clone: Best practices for handling user authentication and authorization?",
    },
    {
        _id: 3,
        title: "Struggling with SEO in Next.js Stack Overflow clone - any suggestions?",
    },
    {
        _id: 4,
        title: "How to efficiently handle real-time updates (e.g., new answers) in Next.js Stack Overflow clone?",
    },
    {
        _id: 5,
        title: "Next.js Stack Overflow clone: What's the best approach for implementing voting functionality?",
    },
];

const tempTags = [
    {
        _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
        name: "React",
        totalQuestions: 5,
    },
    {
        _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
        name: "TypeScript",
        totalQuestions: 1,
    },
    {
        _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
        name: "Python",
        totalQuestions: 2,
    },
    {
        _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
        name: "Rust",
        totalQuestions: 3,
    },
    {
        _id: new Types.ObjectId("66c476c6645a75445905ba5d"),
        name: "Tailwind",
        totalQuestions: 8,
    },
];

const RightSidebar = () => {
    return (
        <section className="background-light900_dark200 light-border text-dark200_light900 sticky right-0 top-0 flex h-screen flex-col overflow-y-auto border-l p-5 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden max-lg:px-2 lg:w-[350px]">
            <div>
                <h3 className="h3-bold">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {tempQuestions.map((qn) => (
                        <Link
                            className="flex items-center justify-between gap-5"
                            href={`/questions/${qn._id}`}
                            key={qn._id}
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
                    {tempTags.map((tag) => (
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
