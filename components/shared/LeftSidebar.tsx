"use client";

import { sidebarLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { LogIn, UserPlus } from "lucide-react";

const LeftSidebar = () => {
    const pathname = usePathname();
    return (
        <section className="background-light900_dark200 light-border sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-5 pt-36 shadow-light-300 dark:shadow-none max-lg:px-2 max-sm:hidden lg:w-[266px]">
            <div className="flex flex-1 flex-col gap-6">
                {sidebarLinks.map((item) => {
                    const isActive =
                        (pathname.includes(item.route) &&
                            item.route.length > 1) ||
                        pathname === item.route;

                    // TODO: special routing for Profile page
                    return (
                        <Link
                            key={item.route}
                            href={item.route}
                            className={`${
                                isActive
                                    ? "primary-gradient remove-gradient-on-hover text-light-900 hover:bg-primary-500"
                                    : "text-dark300_light900 hover:bg-slate-200 dark:hover:bg-slate-800"
                            } flex items-center justify-center gap-4 rounded-lg bg-transparent p-4 lg:justify-start`}
                        >
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                className={isActive ? "" : "invert-colors"}
                            />
                            <p
                                className={`${
                                    isActive ? "body-semibold" : "body-medium"
                                } max-lg:hidden`}
                            >
                                {item.label}
                            </p>
                        </Link>
                    );
                })}
            </div>
            <SignedOut>
                <div className="mb-6 flex flex-col gap-3">
                    <Link href="/sign-in">
                        <Button className="btn-secondary small-bold min-h-[41px] w-full rounded-lg px-4 py-3 text-primary-300">
                            <LogIn size={20} />
                            <span className="ml-2 max-lg:hidden">Sign In</span>
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button
                            variant="orange"
                            className="small-bold my-3 min-h-[41px] w-full rounded-lg px-4"
                        >
                            <UserPlus size={20} />
                            <span className="ml-2 max-lg:hidden">Sign Up</span>
                        </Button>
                    </Link>
                </div>
            </SignedOut>
        </section>
    );
};
export default LeftSidebar;
