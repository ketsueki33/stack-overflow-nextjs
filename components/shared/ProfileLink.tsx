import { LucideIcon } from "lucide-react";

interface Props {
    Icon: LucideIcon;
    title: string;
    href?: string;
}

const ProfileLink = ({ Icon, title, href }: Props) => {
    return (
        <div className="flex-center gap-1">
            <Icon size={20} />
            {href ? (
                <a
                    className="paragraph-medium text-blue-500"
                    href={href}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {title}
                </a>
            ) : (
                <p className="paragraph-medium text-dark400_light700">
                    {title}
                </p>
            )}
        </div>
    );
};
export default ProfileLink;
