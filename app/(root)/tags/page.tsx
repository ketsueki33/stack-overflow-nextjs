import TagCard from "@/components/cards/TagCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/search/LocalSearch";
import { TagFilters } from "@/constants/filters";
import { getAllTags } from "@/lib/actions/tag.action";

const Tags = async () => {
    const results = await getAllTags({});

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Users</h1>
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
                        <TagCard key={tag._id} tag={tag} />
                        // <UserCard key={tag._id} user={tag} />
                    ))
                ) : (
                    <NoResult
                        title="No tags yet..."
                        description="Ask a Question to start discussion on your desired topic"
                        linkTitle="Ask a Question"
                        linkTo="/ask-question"
                    />
                )}
            </section>
        </>
    );
};

export default Tags;
