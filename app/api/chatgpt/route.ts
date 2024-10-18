import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const POST = async (request: Request) => {
    const { tag } = await request.json();

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Give a brief description of ${tag} in about 30 words in the context of programming.`;

        const result = await model.generateContent(prompt);

        return NextResponse.json({ reply: result.response.text() });
    } catch (error) {
        return NextResponse.json({ error });
    }
};
