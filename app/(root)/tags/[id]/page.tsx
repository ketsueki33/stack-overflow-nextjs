import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

const TagDetails = async ({ params, searchParams }: URLProps) => {
    console.log({ params, searchParams });

    const { questions, tagTitle } = await getQuestionByTagId({
        tagId: params.id,
        page: 1,
        searchQuery: searchParams.q,
    });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>
            <div className="mt-11 w-full">
                <LocalSearch
                    route="/collection"
                    iconPosition="left"
                    placeholder={`Search questions related to ${tagTitle}...`}
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ? (
                    questions.map((qn) => {
                        return <QuestionCard key={qn._id.toString()} qn={qn} />;
                    })
                ) : (
                    <NoResult
                        title="There are no questions related to this topic"
                        description="Be the first to break the silence! 🚀 Ask a Question and
                kickstart the discussion. your query could be the next big thing
                others learn from. Get involved! 💡"
                        linkTitle="Ask a Question"
                        linkTo="/ask-a-question"
                    />
                )}
            </div>
        </>
    );
};

export default TagDetails;
