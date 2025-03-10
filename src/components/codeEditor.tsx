"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPID_JUDGE0_API_KEY!;

const defaultCode = `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!";
    return 0;
}`;

const languageMap: Record<string, number> = {
    "c++": 54,
    "c": 50,
    "java": 62,
    "python": 71,
    "javascript": 63,
    "go": 60,
    "rust": 73,
    "swift": 83,
    "kotlin": 78,
};
interface CodeEditorProps {
    sourceCode?: string,
}
export default function CodeEditor({ sourceCode }: CodeEditorProps) {
    // console.log(sourceCode)
    const [code, setCode] = useState<string>(sourceCode ? sourceCode : defaultCode);
    const [output, setOutput] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [language, setLanguage] = useState("c++");

    const runCode = async () => {
        setIsRunning(true);
        setOutput(null);
        toast.info("Compiling your code...");
        if (!RAPIDAPI_KEY) {
            setOutput("NO API KEY");
            setIsRunning(false);
            return;
        }
        try {
            if (!languageMap[language]) {
                toast.error("Unsupported language!");
                return;
            }

            // Step 1: Submit Code
            const submissionRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                },
                body: JSON.stringify({
                    sourceCode: code,
                    language_id: languageMap[language],
                    stdin: "",
                }),
            });

            const { token } = await submissionRes.json();

            // Step 2: Poll for Result
            let outputData;
            while (true) {
                const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
                    method: "GET",
                    headers: {
                        "X-RapidAPI-Key": RAPIDAPI_KEY,
                        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    },
                });

                const resultData = await resultRes.json();

                if (resultData.status.id > 2) {
                    outputData = resultData.stdout || resultData.stderr || resultData.compile_output;
                    break;
                }
                await new Promise((res) => setTimeout(res, 1000));
            }

            setOutput(outputData || "No output.");
        } catch (error) {
            console.error("Execution error:", error);
            setOutput("Error running code.");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="p-4 max-w-5xl mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-blue-400 text-center">
                Online Code Editor
            </h1>

            {/* Two-Section Layout */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Section - Code Editor */}
                <div className="w-full md:w-2/3 bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <label className="text-sm font-semibold text-gray-300 mb-2 block">
                        Select Language:
                    </label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 mb-2"
                    >
                        {Object.keys(languageMap).map((lang) => (
                            <option key={lang} value={lang}>
                                {lang.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <Editor
                        height="300px"
                        defaultLanguage="cpp"
                        value={code}
                        theme="vs-dark"
                        onChange={(value) => setCode(value || "")}
                        className="rounded-md border border-gray-700"
                    />
                </div>

                {/* Right Section - Output & Run Button */}
                <div className="w-full md:w-1/3 bg-gray-800 p-4 rounded-lg border border-gray-700 flex flex-col justify-between">
                    <Button
                        onClick={runCode}
                        className="bg-blue-600 hover:bg-blue-700 transition-all px-4 py-2 rounded-lg font-semibold w-full mb-3"
                        disabled={isRunning}
                    >
                        {isRunning ? "Running..." : "Run Code"}
                    </Button>

                    <h2 className="text-lg font-semibold text-green-400">Output:</h2>
                    <div className="mt-2 p-2 bg-gray-900 rounded-lg h-40 overflow-auto border border-gray-600 text-gray-300 text-sm">
                        {output !== null ? <pre>{output}</pre> : <span className="text-gray-500">No output yet.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
