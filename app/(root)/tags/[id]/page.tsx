import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import { Metadata, ResolvingMetadata } from "next";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { getQuestionByTagId } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";

export async function generateMetadata(
    { params }: URLProps,
    _parent: ResolvingMetadata,
): Promise<Metadata> {
    const { tagTitle } = await getQuestionByTagId({
        tagId: params.id,
    });
    return {
        title: tagTitle,
    };
}

const TagDetails = async ({ params, searchParams }: URLProps) => {

    const { questions, tagTitle, isNext } = await getQuestionByTagId({
        tagId: params.id,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
    });

    const isSearching = Boolean(searchParams.q || searchParams.filter);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{tagTitle}</h1>
            <div className="mt-11 w-full">
                <LocalSearch
                    route={`/tags/${params.id}`}
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
                        title={
                            isSearching
                                ? "No questions found..."
                                : "There are no questions related to this topic"
                        }
                        description={
                            isSearching
                                ? "Your search returned no results. Please try adjusting your search terms or filters."
                                : "Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. your query could be the next big thing others learn from. Get involved! 💡"
                        }
                        linkTitle={isSearching ? undefined : "Ask a Question"}
                        linkTo={isSearching ? undefined : "/ask-a-question"}
                    />
                )}
            </div>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={isNext}
            />
        </>
    );
};

export default TagDetails;
