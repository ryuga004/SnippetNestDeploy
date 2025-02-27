import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINIA_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 500,
    responseMimeType: "text/plain",
};

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // const result = await model.generateContent(prompt);

        // const chatSession = model.startChat({
        //     generationConfig,
        //     history: [],
        // });
        const query = `Generate a Code based on this description. If the language is not mentioned, then create a React component based on the description. The output should be strictly in this format:
            "title": "string",
            "description": "string",
            "language": "string",
            "source_code": "string"
        prompt: ${prompt}`;
        const result = await model.generateContent(query);

        const generatedCode = result.response.text();

        return NextResponse.json({ snippet: generatedCode });
    } catch (error) {
        console.error("Error generating template:", error);
        return NextResponse.json({ error: "Failed to generate template" }, { status: 500 });
    }
}
