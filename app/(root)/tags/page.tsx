import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";
import { SearchParamsProps } from "@/types";

const Tags = async ({ searchParams }: SearchParamsProps) => {
    const results = await getAllTags({
        searchQuery: searchParams.q,
        filter: searchParams.filter,
        page: searchParams.page ? +searchParams.page : 1,
    });

    const isSearching = Boolean(searchParams.q || searchParams.filter);

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Tags</h1>
            <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                <LocalSearch
                    route="/tags"
                    iconPosition="left"
                    placeholder="Search for tags..."
                />
                <Filter
                    filters={TagFilters}
                    customClasses="min-h-[40px] sm:min-w-[170px]"
                />
            </div>
            <section className="mt-12 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 min-[1100px]:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
                {results.tags.length > 0 ? (
                    results.tags.map((tag) => (
                        <TagCard key={tag._id.toString()} tag={tag} />
                    ))
                ) : (
                    <div className="col-span-full">
                        <NoResult
                            title={
                                isSearching
                                    ? "No tags found..."
                                    : "No tags yet..."
                            }
                            description={
                                isSearching
                                    ? "Your search returned no results. Please try adjusting your search terms or filters."
                                    : "Ask a Question to start discussion on your desired topic"
                            }
                            linkTitle={
                                isSearching ? undefined : "Ask a Question"
                            }
                            linkTo={isSearching ? undefined : "/ask-a-question"}
                        />
                    </div>
                )}
            </section>
            <Pagination
                pageNumber={searchParams?.page ? +searchParams.page : 1}
                isNext={results.isNext}
            />
        </>
    );
};

export default Tags;
