"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import SectionWrapper from "@/hoc/sectionWrapper";
import { problems } from "@/lib/codingProblemData";
import { CodingProblemType } from "@/lib/types";
import { Editor } from "@monaco-editor/react";
import { useParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";




const languages = [
    { id: 54, name: "C++ (GCC 9.2.0)" },
    { id: 62, name: "Java (OpenJDK 13)" },
    { id: 71, name: "Python (3.8.1)" },
];

export default function ProblemInterface() {
    const { problem_id } = useParams();

    const [problem, setProblem] = useState<CodingProblemType>();
    const router = useRouter();
    useEffect(() => {
        const foundProblem = problems.find(problem => problem.id === problem_id);

        if (foundProblem) {
            setProblem(foundProblem);
        } else {

            alert("Problem Not Found. Returning to Home.");
            router.push("/");
        }
    }, [problem_id]);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState(languages[0].id);
    const [output, setOutput] = useState<JSX.Element[] | string>();
    const [testCases, setTestCases] = useState([
        { input: "5\n", expectedOutput: "120", actualOutput: "" },
        { input: "3\n", expectedOutput: "6", actualOutput: "" },
    ]);

    const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
    const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "default value";

    if (!RAPIDAPI_KEY) {
        console.error("NO JUDGE0 API KEY PRESENT");
    }

    const handleSubmit = async () => {
        setOutput("Running...");
        if (!language) {
            setOutput("Language is not set");
            return;
        }

        const submissions = await Promise.all(
            testCases.map(async (test) => {
                const submissionRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-RapidAPI-Key": RAPIDAPI_KEY,
                        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    },
                    body: JSON.stringify({
                        source_code: code,
                        language_id: language,
                        stdin: test.input,
                    }),
                });

                const { token } = await submissionRes.json();
                return { token, input: test.input, expected: test.expectedOutput };
            })
        );


        const results = await Promise.all(
            submissions.map(async ({ token, input, expected }) => {
                let resultData;
                do {
                    const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
                        method: "GET",
                        headers: {
                            "X-RapidAPI-Key": RAPIDAPI_KEY,
                            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                        },
                    });

                    resultData = await resultRes.json();

                    if (resultData.status.id > 2) break;
                    await new Promise((res) => setTimeout(res, 1000));
                } while (true);

                const actualOutput = resultData.stdout
                    ? resultData.stdout.trim()
                    : resultData.stderr
                        ? `Error: ${resultData.stderr.trim()}`
                        : `Error: ${resultData.compile_output || "Unknown error"}`;

                return { input, expected, actualOutput };
            })
        );


        setTestCases((prev) =>
            prev.map((test, i) => ({
                ...test,
                actualOutput: results[i].actualOutput,
            }))
        );


        // setOutput(
        //     results
        //         .map(
        //             (r) =>
        //                 `Input: ${r.input}\nExpected: ${r.expected}\nOutput: ${r.actualOutput}\nStatus: ${r.actualOutput === r.expected ? "✅ Passed" : "❌ Failed"
        //                 }\n`
        //         )
        //         .join("\n")
        // );
        setOutput(results.map((r, index) => (

            <li key={index}>
                <span>Test Case {index + 1}: </span>
                <button>{r.actualOutput === r.expected ? "Passed" : "Failed"}</button>
            </li>

        )))
    };

    return (
        <SectionWrapper>
            <div className="bg-gray-800 max-h-[85vh] p-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-white rounded-lg">
                {/* Sidebar */}
                <aside className="col-span-1 justify-between flex flex-col gap-4">
                    {/* Problem Card */}
                    <Card className=" p-4 rounded-xl shadow-lg">
                        <CardContent>
                            <h2 className="text-2xl font-bold text-orange-400">{problem?.title}</h2>
                            <p className=" mt-2">{problem?.description}</p>
                            <p className="mt-2"><strong>Input : </strong> {problem?.inputFormat}</p>
                            <p><strong>Output : </strong>{problem?.outputFormat}</p>
                            <p className="mt-2"><strong>Example : </strong></p>
                            <div className="bg-gray-300 p-3 rounded-md text-sm">
                                <p><strong>Input : </strong>{problem?.exampleInput}</p>
                                <p><strong>Output : </strong>{problem?.exampleOutput}</p>
                            </div>
                            <p><strong>Constraint : </strong>{problem?.constraints} </p>
                        </CardContent>
                    </Card>

                    {/* Output Card */}
                    <Card className=" p-1 rounded-xl shadow-lg">
                        <CardContent>
                            <h2 className=" pb-3 text-xl font-semibold text-green-400">Output</h2>
                            {output &&
                                <ul>
                                    {output}
                                </ul>
                            }
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Editor Section */}
                <main className="col-span-3 flex flex-col gap-4">
                    {/* Language Selector */}
                    <header className="flex justify-between items-center  h-[24px]">
                        <Select onValueChange={(val) => { console.log(val); setLanguage(54) }}>
                            <SelectTrigger className="w-48 bg-white text-black border-gray-600">
                                {languages.find((lang) => lang.id === language)?.name}
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-600">
                                {languages.map((lang) => (
                                    <SelectItem key={lang.id} value={lang.id.toString()} className="hover:bg-gray-700">
                                        {lang.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </header>

                    {/* Code Editor */}
                    <div className="flex-1">
                        <Editor
                            height="480px"
                            defaultLanguage="cpp"
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value || "")}
                            className="rounded-lg border border-gray-700"
                        />
                    </div>

                    {/* Buttons */}
                    <footer className="flex justify-end gap-3">
                        <Button className="bg-gray-600 hover:bg-gray-500 transition" onClick={handleSubmit}>Run Code</Button>
                        <Button className="bg-green-700 hover:bg-green-600 transition" onClick={handleSubmit}>Submit Code</Button>
                    </footer>
                </main>
            </div>

        </SectionWrapper>
    );
}
