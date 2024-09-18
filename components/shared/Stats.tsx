import Image from "next/image";

interface Props {
    totalQuestions: number;
    totalAnswers: number;
}

interface StatCardsProps {
    imgUrl: string;
    value: number;
    title: string;
}
const StatsCard = ({ imgUrl, value, title }: StatCardsProps) => {
    return (
        <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <Image src={imgUrl} alt={title} width={40} height={40} />
            <div className="w-[102px]">
                <p className="h3-semibold text-primary-500">{value}</p>
                <p className="body-medium text-dark400_light700">
                    {title}
                    {value !== 1 && "s"}
                </p>
            </div>
        </div>
    );
};

const Stats = ({ totalAnswers, totalQuestions }: Props) => {
    return (
        <div className="mt-10">
            <h4 className="h3-semibold text-dark200_light900">Stats</h4>
            <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
                    <div className="flex-1">
                        <p className="h3-semibold text-primary-500">
                            {totalQuestions}
                        </p>
                        <p className="body-medium text-dark400_light700">
                            Question{totalQuestions !== 1 && "s"}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="h3-semibold text-primary-500">
                            {totalAnswers}
                        </p>
                        <p className="body-medium text-dark400_light700">
                            Answer{totalAnswers !== 1 && "s"}
                        </p>
                    </div>
                </div>
                <StatsCard
                    imgUrl="/assets/icons/gold-medal.svg"
                    value={0}
                    title="Gold Badge"
                />
                <StatsCard
                    imgUrl="/assets/icons/silver-medal.svg"
                    value={1}
                    title="Silver Badge"
                />
                <StatsCard
                    imgUrl="/assets/icons/bronze-medal.svg"
                    value={0}
                    title="Bronze Badge"
                />
            </div>
        </div>
    );
};
export default Stats;
