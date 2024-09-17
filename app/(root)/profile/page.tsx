import NoResult from "@/components/shared/NoResult";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const RedirectToProfile = () => {
    const { userId } = auth();

    if (userId) redirect(`/profile/${userId}`);

    return (
        <NoResult
            title="Sign In to Access Your Profile"
            description="Sign in to fully participate in our community. As a logged-in user, you can ask and answer questions, save your favorite content, vote on questions and answers, earn reputation points, and follow topics and users."
            linkTitle="Sign In"
            linkTo="/sign-in"
        />
    );
};
export default RedirectToProfile;
