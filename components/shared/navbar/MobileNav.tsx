"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { SignedOut } from "@clerk/nextjs";
import { LogIn, Menu, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavContent = () => {
    const pathname = usePathname();
    return (
        <section className="flex h-full flex-col gap-6 pt-16">
            {sidebarLinks.map((item) => {
                const isActive =
                    (pathname.includes(item.route) && item.route.length > 1) ||
                    pathname === item.route;
                return (
                    <SheetClose asChild key={item.route}>
                        <Link
                            href={item.route}
                            className={`${
                                isActive
                                    ? "primary-gradient  remove-gradient-on-hover text-light-900 hover:bg-primary-500"
                                    : "text-dark300_light900  hover:bg-slate-200 dark:hover:bg-slate-800"
                            } flex items-center justify-start gap-4 rounded-lg bg-transparent p-4`}
                        >
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                className={isActive ? "" : "invert-colors"}
                            />
                            <p className={isActive ? "body-semibold" : "body-medium"}>
                                {item.label}
                            </p>
                        </Link>
                    </SheetClose>
                );
            })}
        </section>
    );
};

const MobileNav = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden">
                    <Image
                        src="/assets/icons/hamburger.svg"
                        alt="Menu"
                        height={36}
                        width={36}
                        className="invert-colors size-6"
                    />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="background-light900_dark200 border-none">
                <Link href="/" className="flex items-center gap-1">
                    <Image
                        src="/assets/images/site-logo.svg"
                        width={23}
                        height={23}
                        alt="CodeOverflow"
                    />
                    <p className="h2-bold font-grotesk text-dark-100 dark:text-light-900 ">
                        Code
                        <span className="text-primary-500">Overflow</span>
                    </p>
                </Link>
                <div className="flex h-full flex-col justify-between">
                    <NavContent />
                    <SignedOut>
                        <div className="mb-6 flex flex-col gap-3">
                            <SheetClose asChild>
                                <Link href="/sign-in">
                                    <Button className=" btn-secondary small-bold min-h-[41px] w-full rounded-lg px-4 py-3 text-primary-300">
                                        <LogIn className="mr-2" size={20} />
                                        Sign In
                                    </Button>
                                </Link>
                            </SheetClose>
                            <SheetClose asChild>
                                <Link href="/sign-up">
                                    <Button
                                        variant="orange"
                                        className=" small-bold my-3 min-h-[41px] w-full rounded-lg px-4"
                                    >
                                        <UserPlus className="mr-2" size={20} />
                                        Sign Up
                                    </Button>
                                </Link>
                            </SheetClose>
                        </div>
                    </SignedOut>
                </div>
            </SheetContent>
        </Sheet>
    );
};
export default MobileNav;

<Menu />;
