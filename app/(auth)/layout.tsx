import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}
const layout = ({ children }: Props) => {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[url('/assets/images/auth-dark.png')] bg-cover bg-fixed">
            {children}
        </main>
    );
};

export default layout;
