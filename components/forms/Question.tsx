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
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { Types } from "mongoose";

require("prismjs/components/prism-python");
require("prismjs/components/prism-java");
require("prismjs/components/prism-c");
require("prismjs/components/prism-cpp");
require("prismjs/components/prism-csharp");
require("prismjs/components/prism-aspnet");
require("prismjs/components/prism-sass");
require("prismjs/components/prism-jsx");
require("prismjs/components/prism-tsx");
require("prismjs/components/prism-typescript");
require("prismjs/components/prism-solidity");
require("prismjs/components/prism-json");
require("prismjs/components/prism-dart");
require("prismjs/components/prism-ruby");
require("prismjs/components/prism-rust");
require("prismjs/components/prism-r");
require("prismjs/components/prism-kotlin");
require("prismjs/components/prism-go");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-sql");
require("prismjs/components/prism-mongodb");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-css");

interface Props {
    mongoUserId: Types.ObjectId;
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
                author: mongoUserId,
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

    useEffect(() => {
        Prism.highlightAll();
    }, []);

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
                                        codesample_languages: [
                                            {
                                                text: "ASP.NET (C#)",
                                                value: "aspnet",
                                            },
                                            { text: "Bash", value: "bash" },
                                            { text: "C", value: "c" },
                                            { text: "C#", value: "csharp" },
                                            { text: "C++", value: "cpp" },
                                            { text: "CSS", value: "css" },
                                            { text: "Dart", value: "dart" },
                                            { text: "Go", value: "go" },
                                            {
                                                text: "HTML/XML",
                                                value: "markup",
                                            },
                                            { text: "Java", value: "java" },
                                            {
                                                text: "JavaScript",
                                                value: "javascript",
                                            },
                                            {
                                                text: "JSX (React)",
                                                value: "jsx",
                                            },
                                            { text: "JSON", value: "json" },
                                            { text: "Kotlin", value: "kotlin" },
                                            {
                                                text: "MongoDB",
                                                value: "mongodb",
                                            },
                                            { text: "PHP", value: "php" },
                                            { text: "Python", value: "python" },
                                            { text: "R", value: "r" },
                                            { text: "Ruby", value: "ruby" },
                                            { text: "Rust", value: "rust" },
                                            { text: "Sass", value: "sass" },
                                            {
                                                text: "Solidity",
                                                value: "solidity",
                                            },
                                            { text: "SQL", value: "sql" },
                                            {
                                                text: "TSX (React)",
                                                value: "tsx",
                                            },
                                            {
                                                text: "TypeScript",
                                                value: "typescript",
                                            },
                                        ],
                                        toolbar:
                                            "undo redo | blocks | " +
                                            "codesample | bold italic forecolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist | " +
                                            "removeformat",
                                        codesample_global_prismjs: true,
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
                            <FormDescription className="body-regular !mt-3 text-light-500">
                                Add up to 3 tags to describe what your question
                                is about.
                                <span className="font-bold text-primary-500">
                                    You need to press enter to add a tag.
                                </span>
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
