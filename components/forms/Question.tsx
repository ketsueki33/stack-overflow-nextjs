"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { QuestionsSchema } from "@/lib/validation";

import { Editor } from "@tinymce/tinymce-react";
import React, { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    mongoUserId: string;
    purpose?: "edit" | "post";
}

const Question = ({ mongoUserId, purpose = "post" }: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editorRef = useRef(null);
    const { mode } = useTheme();
    const editorKey = `editor-${mode}`;

    const router = useRouter();
    const pathname = usePathname();

    const form = useForm<z.infer<typeof QuestionsSchema>>({
        resolver: zodResolver(QuestionsSchema),
        defaultValues: {
            title: "",
            explanation: "",
            tags: [],
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
        setIsSubmitting(true);
        console.log(values);
        console.log("trigger");

        try {
            await createQuestion({
                title: values.title,
                content: values.explanation,
                tags: values.tags,
                author: JSON.parse(mongoUserId),
                path: pathname,
            });

            router.push("/");
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        field: any,
    ) => {
        if (e.key === "Enter" && field.name === "tags") {
            e.preventDefault();

            const tagInput = e.target as HTMLInputElement;
            const tagValue = tagInput.value.trim().toLowerCase();

            if (tagValue !== "") {
                if (tagValue.length > 15) {
                    return form.setError("tags", {
                        type: "required",
                        message: "Tag must be less than 15 characters.",
                    });
                }
                if (!field.value.includes(tagValue as never)) {
                    form.setValue("tags", [...field.value, tagValue]);
                    tagInput.value = "";
                    form.clearErrors("tags");
                }
            } else {
                form.trigger();
            }
        }
    };

    const handleTagRemove = (tag: string, field: any) => {
        const newTags = field.value.filter((t: string) => t !== tag);

        form.setValue("tags", newTags);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Question Title
                                <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="!mt-3.5">
                                <Input
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Be specific and imagine you&#39;re asking a
                                question to another person.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Explain your question
                                <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="!mt-3.5">
                                <Editor
                                    ref={editorRef}
                                    key={editorKey}
                                    apiKey={
                                        process.env
                                            .NEXT_PUBLIC_TINY_EDITOR_API_KEY
                                    }
                                    onInit={(evt, editor) =>
                                        // @ts-ignore
                                        (editorRef.current = editor)
                                    }
                                    onBlur={field.onBlur}
                                    onEditorChange={(content) =>
                                        field.onChange(content)
                                    }
                                    initialValue=""
                                    init={{
                                        height: 360,
                                        skin:
                                            mode === "dark"
                                                ? "oxide-dark"
                                                : "oxide",
                                        content_css:
                                            mode === "dark"
                                                ? "dark"
                                                : "default",
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "anchor",
                                            "autolink",
                                            "image",
                                            "link",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "codesample",
                                            "fullscreen",
                                            "help",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                        ],
                                        toolbar:
                                            "undo redo | blocks | " +
                                            "codesample | bold italic forecolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist | " +
                                            "removeformat",
                                        content_style:
                                            "body { font-family:!Inter; font-size:16px ;}",
                                    }}
                                />
                            </FormControl>
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Introduce the problem and expand on what you put
                                in the title. Minimum 20 characters.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Tags
                                <span className="text-primary-500">*</span>{" "}
                            </FormLabel>
                            <FormControl className="!mt-3.5">
                                <Input
                                    onKeyDown={(e) =>
                                        handleInputKeyDown(e, field)
                                    }
                                    className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[40px] border"
                                />
                            </FormControl>
                            {field.value.length > 0 && (
                                <div className="!mt-4 flex gap-2.5">
                                    {field.value.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="small-medium flex-center px-3 py-1 uppercase"
                                        >
                                            {tag}
                                            <Image
                                                src="/assets/icons/close.svg"
                                                alt="Delete Tag"
                                                width={12}
                                                height={12}
                                                className="ml-1 cursor-pointer object-contain invert-0 dark:invert"
                                                onClick={() =>
                                                    handleTagRemove(tag, field)
                                                }
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <FormDescription className="body-regular mt-2.5 text-light-500">
                                Add up to 3 tags to describe what your question
                                is about. You need to press enter to add a tag.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    className="w-fit"
                    type="submit"
                    variant={"orange"}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? purpose === "edit"
                            ? "Editing..."
                            : "Posting..."
                        : purpose === "edit"
                          ? "Edit Question"
                          : "Post Question"}
                </Button>
            </form>
        </Form>
    );
};
export default Question;
