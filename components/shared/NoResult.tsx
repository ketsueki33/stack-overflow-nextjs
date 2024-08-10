"use client";

import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
    title: string;
    description: string;
    linkTo: string;
    linkTitle: string;
}

const NoResult = ({ title, description, linkTo, linkTitle }: Props) => {
    const { mode } = useTheme();

    return (
        <div className="mt-10 flex w-full flex-col items-center justify-center">
            <Image
                alt="No result illustration"
                src={`/assets/images/${mode === "light" ? "light" : "dark"}-illustration.png`}
                width={270}
                height={200}
            />
            <h2 className="h2-bold text-dark200_light900 mt-8 text-center">
                {title}
            </h2>
            <p className="body-regular text-dark500_light700 my-2.5 max-w-md text-center">
                {description}
            </p>
            <Link href={linkTo}>
                <Button className="mt-6" variant="orange">
                    {linkTitle}
                </Button>
            </Link>
        </div>
    );
};
export default NoResult;
