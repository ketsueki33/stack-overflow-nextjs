import ProfileForm from "@/components/forms/ProfileForm";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Edit Profile",
};
const EditProfile = async () => {
    const { userId } = auth();

    if (!userId) return null;

    const mongoUser = await getUserById({ userId });

    if (userId !== mongoUser.clerkId) throw new Error("Unauthorized"); // REVIEW:

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
            <div className="mt-9">
                <ProfileForm
                    clerkId={userId}
                    user={JSON.stringify(mongoUser)}
                />
            </div>
        </>
    );
};
export default EditProfile;
