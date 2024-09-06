"use client";

import { AnswerSchema } from "@/lib/validation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@/context/ThemeProvider";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

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
    userId: string;
    questionId: string;
}

export const Answer = ({ questionId, userId }: Props) => {
    const path = usePathname();

    const editorRef = useRef(null);
    const { mode } = useTheme();
    const editorKey = `editor-${mode}`;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: {
            answer: "",
        },
    });

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
        setIsSubmitting(true);

        try {
            await createAnswer({
                content: values.answer,
                author: JSON.parse(userId),
                path,
                question: JSON.parse(questionId),
            });

            form.reset();

            if (editorRef.current) {
                const editor = editorRef.current as any;

                editor.setContent("");
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="mt-6 flex w-full flex-col gap-10"
                onSubmit={form.handleSubmit(handleCreateAnswer)}
            >
                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem className="flex w-full flex-col gap-3">
                            <FormLabel className="paragraph-semibold text-dark400_light800">
                                Write your answer here
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="orange"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
