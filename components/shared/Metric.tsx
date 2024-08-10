import Image from "next/image";
import Link from "next/link";

interface Props {
    imgUrl: string;
    alt: string;
    value: number | string;
    title: string;
    textStyles?: string;
    href?: string;
    isAuthor?: boolean;
}

const Metric = ({
    imgUrl,
    alt,
    value,
    title,
    textStyles,
    href,
    isAuthor,
}: Props) => {
    const metricContent = (
        <>
            <Image
                src={imgUrl}
                alt={alt}
                height={16}
                width={16}
                className={`object-contain ${href ? "rounded-full" : ""}`}
            />
            <p className={textStyles}>
                {value}
                <span
                    className={`small-regular ${isAuthor ? "max-sm:hidden" : ""}`}
                >
                    {" " + title}
                </span>
            </p>
        </>
    );

    if (href)
        return (
            <Link className="flex-center gap-1.5" href={href}>
                {metricContent}
            </Link>
        );

    return <div className="flex-center flex-wrap gap-1.5">{metricContent}</div>;
};
export default Metric;
