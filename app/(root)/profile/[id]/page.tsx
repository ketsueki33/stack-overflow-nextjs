import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonthYear } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import { CalendarDays, LinkIcon, MapPin } from "lucide-react";
import Stats from "@/components/shared/Stats";
import QuestionsTab from "@/components/shared/QuestionsTab";
import AnswersTab from "@/components/shared/AnswersTab";

const ProfilePage = async ({ params, searchParams }: URLProps) => {
    const { userId: clerkId } = auth();
    const { user, totalAnswers, totalQuestions } = await getUserInfo({
        userId: params.id,
    });

    return (
        <>
            <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
                <div className="flex flex-col items-start gap-5 lg:flex-row">
                    <Image
                        src={user.picture}
                        alt="profile picture"
                        width={140}
                        height={140}
                        className="rounded-full object-cover"
                    />
                    <div className="mt-3">
                        <h2 className="h2-bold text-dark100_light900">
                            {user.name}
                        </h2>
                        <p className="paragraph-semibold mt-2 text-primary-500">
                            @{user.username}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
                            {user.portfolioWebsite && (
                                <ProfileLink
                                    Icon={LinkIcon}
                                    href={user.portfolioWebsite}
                                    title="Portfolio"
                                />
                            )}
                            {user.location && (
                                <ProfileLink
                                    Icon={MapPin}
                                    title={user.location}
                                />
                            )}
                            <ProfileLink
                                Icon={CalendarDays}
                                title={"Joined " + getMonthYear(user.joinedAt)}
                            />
                        </div>
                        {user.bio && (
                            <p className="paragraph-regular text-dark400_light800 mt-8 max-w-prose text-pretty">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
                    <SignedIn>
                        {clerkId === user.clerkId && (
                            <Link href={"/profile/edit"}>
                                <Button variant="secondary">
                                    Edit Profile
                                </Button>
                            </Link>
                        )}
                    </SignedIn>
                </div>
            </div>

            <Stats
                totalAnswers={totalAnswers}
                totalQuestions={totalQuestions}
            />

            <div className="mt-10 flex gap-10">
                <Tabs defaultValue="top-posts" className="w-full">
                    <TabsList>
                        <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
                        <TabsTrigger value="top-answers">
                            Top Answers
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-posts">
                        <QuestionsTab
                            // searchParams={searchParams}
                            userId={user._id.toString()}
                            clerkId={clerkId}
                        />
                    </TabsContent>
                    <TabsContent value="top-answers">
                        <AnswersTab
                            // searchParams={searchParams}
                            userId={user._id.toString()}
                            clerkId={clerkId}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};
export default ProfilePage;
