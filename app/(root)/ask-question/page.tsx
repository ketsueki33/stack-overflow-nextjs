import Question from "@/components/forms/Question";
import { IUser } from "@/database/user.model";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ask Question",
};

const Page = async () => {
    const { userId } = auth();

    if (!userId) redirect("/sign-in");

    const mongoUser: IUser = await getUserById({ userId });

    return (
        <div>
            <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
            <div className="mt-9">
                <Question mongoUserId={mongoUser._id.toString()} />
            </div>
        </div>
    );
};

export default Page;
