"use client";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import { SquarePen, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface Props {
    type: "answer" | "question";
    itemId: string;
    size?: number;
}

const EditDeleteAction = ({ type, itemId, size = 15 }: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/question/edit/${itemId}`);
    };

    const handleDelete = async () => {
        if (type === "question") {
            await deleteQuestion({ path: pathname, questionId: itemId });
        } else {
            await deleteAnswer({ path: pathname, answerId: itemId });
        }
    };

    return (
        <div className="flex items-center justify-end gap-3 max-sm:w-full">
            {type === "question" && (
                <SquarePen
                    size={size}
                    onClick={handleEdit}
                    className="cursor-pointer text-gray-500 hover:text-inherit"
                />
            )}
            <Dialog>
                <DialogTrigger asChild>
                    <Trash2
                        size={size}
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                    />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{`Are you sure you want to delete this ${type}?`}</DialogTitle>
                        <DialogDescription className="!mt-5">
                            {type === "question"
                                ? "This action cannot be undone. Deleting the question will remove it from the platform and prevent others from viewing or interacting with it."
                                : "This action cannot be undone. Deleting the answer will remove it from the question and prevent others from viewing or interacting with it."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                className="mr-5"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default EditDeleteAction;
