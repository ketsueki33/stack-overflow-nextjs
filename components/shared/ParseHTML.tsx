"use client";

import parse from "html-react-parser";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { useEffect } from "react";

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
    data: string;
}

export const ParseHTML = ({ data }: Props) => {
    useEffect(() => {
        Prism.highlightAll();
        document.querySelectorAll("pre")!.forEach((pre) => {
            pre.classList.add("!rounded-lg");
        });
    }, []);

    return (
        <>
            <div>{parse(data)}</div>
        </>
    );
};
