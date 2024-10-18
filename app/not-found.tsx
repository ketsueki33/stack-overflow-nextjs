import NoResult from "@/components/shared/NoResult";

export default function NotFound() {
    return (
        <main className="background-light850_dark100 flex h-screen justify-center">
            <NoResult
                title="Page Not Found"
                description="Could not find the requested resource"
                linkTitle="Go to Home"
                linkTo="/"
            />
        </main>
    );
}
