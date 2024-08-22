import { IUser } from "@/database/user.model";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import { Badge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";

interface Props {
    user: IUser;
}

const UserCard = async ({ user }: Props) => {
    const interactedTags = await getTopInteractedTags({ userId: user._id });
    return (
        <Link
            href={`/profile/${user.clerkId}`}
            className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]"
        >
            <div className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
                <Image
                    src={user.picture}
                    alt="User profile picture"
                    width={100}
                    height={100}
                    className="rounded-full"
                />
                <div className="mt-4 text-center">
                    <h3 className="h3-bold text-dark200_light900 line-clamp-1">
                        {user.name}
                    </h3>
                    <p className="body-semibold mt-2 text-primary-500">
                        @{user.username}
                    </p>
                </div>
                <div className="mt-5">
                    {interactedTags.length > 0 ? (
                        <div className="flex items-center gap-2">
                            {interactedTags.map((tag) => (
                                <RenderTag
                                    key={tag._id}
                                    _id={tag._id}
                                    name={tag.name}
                                />
                            ))}
                        </div>
                    ) : (
                        <Badge>No Tags Yet</Badge>
                    )}
                </div>
            </div>
        </Link>
    );
};
export default UserCard;
