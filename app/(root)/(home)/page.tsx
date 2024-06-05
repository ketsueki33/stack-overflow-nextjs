import { SignedIn, UserButton } from "@clerk/nextjs";

const page = () => {
    return (
        <SignedIn>
            <UserButton />
        </SignedIn>
    );
};

export default page;
