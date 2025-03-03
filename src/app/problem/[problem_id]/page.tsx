"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SectionWrapper from '@/hoc/sectionWrapper';
import { difficultyColors } from '@/lib';
import { problems } from '@/lib/codingProblemData';
import { Editor } from '@monaco-editor/react';
import { AlertCircleIcon, BookOpenIcon, CheckCircleIcon, CodeIcon, PlayIcon, SendIcon, TerminalIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';
import './styles.css';


interface TestCaseType {
    input: string;
    expectedOutput: string;
    actualOutput?: string;
}

interface CodingProblemType {
    id: string;
    title: string;
    description: string;
    inputFormat: string;
    outputFormat: string;
    exampleInput: string;
    exampleOutput: string;
    constraints: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string[];
    testCases: TestCaseType[];
}



const languages = [
    { id: 54, name: "C++" },
    { id: 62, name: "Java" },
    { id: 71, name: "Python" }
];

// Default code templates for different languages
const defaultCodeTemplates: Record<number, string> = {
    54: `#include <bits/stdc++.h>
using namespace std;

int main() {
  
  return 0;
}`,
    62: `import java.util.Scanner;

public class Main {
  
  
  public static void main(String[] args) {
    
   
  }
}`,
    71: `def factorial(n):
  # Your solution here
  pass


`
};
const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_API_RAPID_JUDGE0_API_KEY!;

function ProblemInterFace() {

    const [problem, setProblem] = useState<CodingProblemType>();
    const [language, setLanguage] = useState(languages[0].id);
    const [code, setCode] = useState(defaultCodeTemplates[languages[0].id]);
    const [output, setOutput] = useState<JSX.Element | string | undefined>(undefined);

    const [testCases, setTestCases] = useState<TestCaseType[]>([]);
    const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
    const [activeTab, setActiveTab] = useState('description');
    const { problem_id } = useParams();

    const router = useRouter();
    useEffect(() => {
        const foundProblem = problems.find(problem => problem.id === problem_id);

        if (foundProblem) {
            setProblem(foundProblem);
            setTestCases(foundProblem.testCases)
        } else {

            alert("Problem Not Found. Returning to Home.");
            router.push("/");
        }
    }, [problem_id]);

    useEffect(() => {
        setCode(defaultCodeTemplates[language] || '');
    }, [language]);

    const handleRun = async () => {
        console.log(code);
        setStatus('running');
        setOutput(undefined);

        if (!RAPIDAPI_KEY) {
            console.error("NO JUDGE0 API KEY PRESENT");
            setOutput(
                <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircleIcon className="h-5 w-5 text-red-500" />
                        <span className="font-medium text-red-500">API Key Missing</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>Judge0 API key is not configured. Please add it to your environment variables.</p>
                    </div>
                </div>
            );
            setStatus("error");
            return;
        }

        try {
            // Only run the first two test cases
            const RunTesCases = testCases.slice(0, 2);


            const submissions = await Promise.all(
                RunTesCases.map(async (test) => {
                    console.log("TEST", test);

                    try {
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

                        if (!submissionRes.ok) {
                            throw new Error(`API responded with status: ${submissionRes.status}`);
                        }

                        const data = await submissionRes.json();
                        if (!data || !data.token) {
                            throw new Error("Invalid response from Judge0 API");
                        }

                        return { token: data.token, input: test.input, expected: test.expectedOutput };
                    } catch (error) {
                        console.error("Submission error:", error);
                        return { error: true, input: test.input, expected: test.expectedOutput };
                    }
                })
            );

            // Filter out submissions with errors
            const validSubmissions = submissions.filter(sub => !sub.error);

            if (validSubmissions.length === 0) {
                throw new Error("All submissions failed");
            }

            const results = await Promise.all(
                validSubmissions.map(async ({ token, input, expected }) => {
                    let resultData;
                    let attempts = 0;
                    const maxAttempts = 5;

                    do {
                        try {
                            const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
                                method: "GET",
                                headers: {
                                    "X-RapidAPI-Key": RAPIDAPI_KEY,
                                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                                },
                            });

                            if (!resultRes.ok) {
                                throw new Error(`API responded with status: ${resultRes.status}`);
                            }

                            resultData = await resultRes.json();

                            if (resultData.status && resultData.status.id > 2) break;

                            attempts++;
                            if (attempts >= maxAttempts) {
                                throw new Error("Maximum polling attempts reached");
                            }

                            await new Promise((res) => setTimeout(res, 1000));
                        } catch (error) {
                            console.error("Error polling for results:", error);
                            resultData = { error: true };
                            break;
                        }
                    } while (true);

                    const actualOutput = resultData.error
                        ? "Error: Failed to retrieve results"
                        : resultData.stdout
                            ? resultData.stdout.trim()
                            : resultData.stderr
                                ? `Error: ${resultData.stderr.trim()}`
                                : `Error: ${resultData.compile_output || "Unknown error"}`;

                    return { input, expected, actualOutput };
                })
            );

            // Update test cases with results
            const updatedTestCases = [...testCases];
            results.forEach((result, i) => {
                if (i < updatedTestCases.length) {
                    updatedTestCases[i] = {
                        ...updatedTestCases[i],
                        actualOutput: result.actualOutput
                    };
                }
            });
            setTestCases(updatedTestCases);

            // Create output elements
            const outputElements = (
                <div className="space-y-4">
                    {results.map((r, index) => (
                        <div key={index} className="mb-3 p-3 border rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Test Case {index + 1}:</span>
                                <Badge
                                    variant={r.actualOutput === r.expected ? "outline" : "outline"}
                                    className={r.actualOutput === r.expected
                                        ? "bg-green-500/10 text-green-500 border-green-200"
                                        : "bg-red-500/10 text-red-500 border-red-200"}
                                >
                                    {r.actualOutput === r.expected ? "Passed" : "Failed"}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Input:</div>
                                    <pre className="bg-muted/50 p-1 rounded mt-1">{r.input.trim()}</pre>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Expected Output:</div>
                                    <pre className="bg-muted/50 p-1 rounded mt-1">{r.expected}</pre>
                                </div>
                                {r.actualOutput && (
                                    <div className="col-span-2">
                                        <div className="text-muted-foreground">Your Output:</div>
                                        <pre className={`p-1 rounded mt-1 ${r.actualOutput === r.expected
                                            ? "bg-green-500/10"
                                            : "bg-red-500/10"}`}>{r.actualOutput}</pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            );

            setOutput(outputElements);
            setStatus('success');

        } catch (error) {
            console.error("Error running code:", error);
            setOutput(
                <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircleIcon className="h-5 w-5 text-red-500" />
                        <span className="font-medium text-red-500">Execution Error</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>There was an error executing your code. Please try again later.</p>
                        <pre className="mt-2 p-2 bg-muted rounded-md">{error instanceof Error ? error.message : "Unknown error"}</pre>
                    </div>
                </div>
            );
            setStatus('error');
        }
    };

    const handleSubmit = () => {
        setStatus('running');

        // Simulate code submission with all test cases
        setTimeout(() => {
            // For demonstration, show all test cases passed
            const allPassed = false;

            const successOutput = (
                <div className="p-3 bg-green-500/10 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        <span className="font-medium text-green-500">All Test Cases Passed!</span>
                    </div>
                </div>
            );

            const failureOutput = (
                <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircleIcon className="h-5 w-5 text-red-500" />
                        <span className="font-medium text-red-500">Some Test Cases Failed</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <p>Please check your solution and try again.</p>
                    </div>
                </div>
            );
            setOutput(allPassed ? successOutput : failureOutput);

            setStatus('success');
        }, 2000);
    };
    if (!problem) {
        return <div>No problem found ..</div>
    }
    return (
        <SectionWrapper>
            <div className="min-h-screen rounded-lg shadow-xl bg-background flex flex-col">
                {/* Header */}
                <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
                    <div className="flex items-center gap-2">
                        <CodeIcon className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-semibold">CodeChallenge</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
                            Problem #{problem.id}
                        </Badge>
                        <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficulty]}`}>
                            {problem.difficulty.toUpperCase()}
                        </Badge>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
                        {/* Left Panel (Problem Statement) */}
                        <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-card">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                                <div className="px-4 pt-4 border-b">
                                    <TabsList className="w-full grid grid-cols-2">
                                        <TabsTrigger value="description" className="flex items-center gap-1">
                                            <BookOpenIcon className="h-4 w-4" />
                                            <span>Description</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="submissions" className="flex items-center gap-1">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            <span>Submissions</span>
                                        </TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="description" className="flex-1 overflow-auto p-4 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficulty]}`}>
                                                {problem.difficulty.toUpperCase()}
                                            </Badge>
                                            {problem.topic.map(topic => (
                                                <Badge key={topic} variant="outline" className="capitalize">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="prose prose-sm max-w-none text-foreground">
                                            <p>{problem.description}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">Input Format:</h3>
                                            <p className="text-sm">{problem.inputFormat}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">Output Format:</h3>
                                            <p className="text-sm">{problem.outputFormat}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">Example:</h3>
                                            <div className="bg-muted p-3 rounded-md space-y-2">
                                                <div>
                                                    <span className="font-medium">Input:</span>
                                                    <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleInput}</pre>
                                                </div>
                                                <div>
                                                    <span className="font-medium">Output:</span>
                                                    <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleOutput}</pre>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-foreground">Constraints:</h3>
                                            <pre className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{problem.constraints}</pre>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Your Submissions</h3>
                                        <div className="space-y-2">
                                            {[
                                                { id: 1, status: 'Accepted', runtime: '4ms', memory: '8.2MB', language: 'C++', date: '2 hours ago' },
                                                { id: 2, status: 'Wrong Answer', runtime: '7ms', memory: '9.1MB', language: 'Python', date: '1 day ago' }
                                            ].map(submission => (
                                                <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                                                    <div className="flex items-center gap-2">
                                                        {submission.status === 'Accepted' ? (
                                                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                                        ) : (
                                                            <AlertCircleIcon className="h-5 w-5 text-red-500" />
                                                        )}
                                                        <span className={submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
                                                            {submission.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span>{submission.runtime}</span>
                                                        <span>{submission.memory}</span>
                                                        <span>{submission.language}</span>
                                                        <span>{submission.date}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>

                        <ResizableHandle withHandle />

                        {/* Right Panel (Editor & Output) */}
                        <ResizablePanel defaultSize={70} className="bg-background">
                            <ResizablePanelGroup direction="vertical">
                                {/* Code Editor */}
                                <ResizablePanel defaultSize={70} className="bg-card">
                                    <div className="p-4 border-b flex items-center justify-between">
                                        <Select value={language.toString()} onValueChange={(val) => setLanguage(Number(val))}>
                                            <SelectTrigger className="w-48 bg-background">
                                                <SelectValue>
                                                    {languages.find((lang) => lang.id === language)?.name}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languages.map((lang) => (
                                                    <SelectItem key={lang.id} value={lang.id.toString()}>
                                                        {lang.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1"
                                                onClick={handleRun}
                                                disabled={status === 'running'}
                                            >
                                                <PlayIcon className="h-4 w-4" />
                                                Run
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="gap-1"
                                                onClick={handleSubmit}
                                                disabled={status === 'running'}
                                            >
                                                <SendIcon className="h-4 w-4" />
                                                Submit
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4 h-[calc(100%-57px)]">
                                        <div
                                            className="w-full h-full border rounded-md overflow-hidden"
                                            style={{
                                                fontFamily: 'monospace',
                                                fontSize: '14px',
                                                padding: '12px',
                                                backgroundColor: '#f8f9fa',
                                                color: '#212529',
                                                whiteSpace: 'pre',
                                                overflowY: 'auto'
                                            }}
                                        >
                                            <Editor
                                                height="100%"
                                                defaultLanguage="cpp"
                                                value={code}
                                                theme="vs-dark"
                                                onChange={(value) => setCode(value || "")}
                                                className="rounded-md border border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </ResizablePanel>

                                <ResizableHandle withHandle />

                                {/* Output Panel */}
                                <ResizablePanel defaultSize={30} className="bg-card">
                                    <div className="p-4 border-b flex items-center gap-2">
                                        <TerminalIcon className="h-4 w-4" />
                                        <h2 className="font-medium">Console Output</h2>
                                        {status === 'running' && (
                                            <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-200">
                                                Running...
                                            </Badge>
                                        )}
                                        {status === 'success' && (
                                            <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-200">
                                                Success
                                            </Badge>
                                        )}
                                        {status === 'error' && (
                                            <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-200">
                                                Error
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="p-4 h-[calc(100%-57px)] overflow-auto">
                                        {status === 'idle' ? (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <p>Run your code to see the output here</p>
                                            </div>
                                        ) : status === 'running' ? (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                <p>Running your code...</p>
                                            </div>
                                        ) : (
                                            <div>{output}</div>
                                        )}
                                    </div>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </SectionWrapper>
    );
}

export default ProblemInterFace;




// "use client";
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import SectionWrapper from '@/hoc/sectionWrapper';
// import { difficultyColors } from '@/lib';
// import { problems } from '@/lib/codingProblemData';
// import { Editor } from '@monaco-editor/react';
// import { AlertCircleIcon, BookOpenIcon, CheckCircleIcon, CodeIcon, PlayIcon, SendIcon, TerminalIcon } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { JSX, useEffect, useState } from 'react';
// import './styles.css';


// interface TestCaseType {
//     input: string;
//     expectedOutput: string;
//     actualOutput?: string;
// }

// interface CodingProblemType {
//     id: string;
//     title: string;
//     description: string;
//     inputFormat: string;
//     outputFormat: string;
//     exampleInput: string;
//     exampleOutput: string;
//     constraints: string;
//     difficuly: "easy" | "medium" | "hard";
//     topic: string[];
//     testCases: TestCaseType[];
// }



// const languages = [
//     { id: 54, name: "C++ (GCC 9.2.0)" },
//     { id: 62, name: "Java (OpenJDK 13)" },
//     { id: 71, name: "Python (3.8.1)" }
// ];

// // Default code templates for different languages
// const defaultCodeTemplates: Record<number, string> = {
//     54: `#include <iostream>
// using namespace std;

// int main() {

//   return 0;
// }`,
//     62: `import java.util.Scanner;

// public class Main {


//   public static void main(String[] args) {


//   }
// }`,
//     71: `def factorial(n):
//   # Your solution here
//   pass


// `
// };
// const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
// const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY!;

// function ProblemInterFace() {

//     const [problem, setProblem] = useState<CodingProblemType>();
//     const [language, setLanguage] = useState(languages[0].id);
//     const [code, setCode] = useState(defaultCodeTemplates[languages[0].id]);
//     const [output, setOutput] = useState<JSX.Element | string | undefined>(undefined);

//     const [testCases, setTestCases] = useState<TestCaseType[]>([]);
//     const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
//     const [activeTab, setActiveTab] = useState('description');
//     const { problem_id } = useParams();

//     const router = useRouter();
//     useEffect(() => {
//         const foundProblem = problems.find(problem => problem.id === problem_id);

//         if (foundProblem) {
//             setProblem(foundProblem);
//             setTestCases(foundProblem.testCases)
//         } else {

//             alert("Problem Not Found. Returning to Home.");
//             router.push("/");
//         }
//     }, [problem_id]);

//     useEffect(() => {
//         setCode(defaultCodeTemplates[language] || '');
//     }, [language]);

//     const handleRun = async () => {

//         console.log(code);
//         setStatus('running');
//         if (!RAPIDAPI_KEY) {
//             console.error("NO JUDGE0 API KEY PRESENT");
//             setStatus("error");
//             return;
//         }
//         const RunTesCases = testCases.slice(0, 2);


//         const submissions = await Promise.all(
//             RunTesCases.map(async (test) => {
//                 console.log("TEST", test);

//                 const submissionRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false`, {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                         "X-RapidAPI-Key": RAPIDAPI_KEY,
//                         "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//                     },
//                     body: JSON.stringify({
//                         source_code: code,
//                         language_id: language,
//                         stdin: test.input,
//                     }),
//                 });

//                 const { token } = await submissionRes.json();
//                 return { token, input: test.input, expected: test.expectedOutput };
//             })
//         );
//         const results = await Promise.all(
//             submissions.map(async ({ token, input, expected }) => {
//                 let resultData;
//                 do {
//                     const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
//                         method: "GET",
//                         headers: {
//                             "X-RapidAPI-Key": RAPIDAPI_KEY,
//                             "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//                         },
//                     });

//                     resultData = await resultRes.json();

//                     if (resultData.status.id > 2) break;
//                     await new Promise((res) => setTimeout(res, 1000));
//                 } while (true);

//                 const actualOutput = resultData.stdout
//                     ? resultData.stdout.trim()
//                     : resultData.stderr
//                         ? `Error: ${resultData.stderr.trim()}`
//                         : `Error: ${resultData.compile_output || "Unknown error"}`;

//                 return { input, expected, actualOutput };
//             })
//         );

//         // Update test cases with results
//         setTestCases(prev =>
//             prev.map((test, i) => ({
//                 ...test,
//                 actualOutput: results[i].actualOutput
//             }))
//         );

//         // Create output elements
//         const outputElements = results.map((r, index) => (
//             <div key={index} className="mb-3 p-3 border rounded-md">
//                 <div className="flex items-center justify-between mb-2">
//                     <span className="font-medium">Test Case {index + 1}:</span>
//                     <Badge
//                         variant={r.actualOutput === r.expected ? "outline" : "outline"}
//                         className={r.actualOutput === r.expected
//                             ? "bg-green-500/10 text-green-500 border-green-200"
//                             : "bg-red-500/10 text-red-500 border-red-200"}
//                     >
//                         {r.actualOutput === r.expected ? "Passed" : "Failed"}
//                     </Badge>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                     <div>
//                         <div className="text-muted-foreground">Input:</div>
//                         <pre className="bg-muted/50 p-1 rounded mt-1">{r.input.trim()}</pre>
//                     </div>
//                     <div>
//                         <div className="text-muted-foreground">Expected Output:</div>
//                         <pre className="bg-muted/50 p-1 rounded mt-1">{r.expected}</pre>
//                     </div>
//                     {r.actualOutput && (
//                         <div className="col-span-2">
//                             <div className="text-muted-foreground">Your Output:</div>
//                             <pre className={`p-1 rounded mt-1 ${r.actualOutput === r.expected
//                                 ? "bg-green-500/10"
//                                 : "bg-red-500/10"}`}>{r.actualOutput}</pre>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         ));
//         if (!outputElements) {
//             setOutput(outputElements);
//             setStatus('success');
//         } else {
//             alert("output elements are undefined");
//             setStatus('error');
//         }

//     };

//     const handleSubmit = () => {
//         setStatus('running');

//         // Simulate code submission with all test cases
//         setTimeout(() => {
//             // For demonstration, show all test cases passed
//             const allPassed = false;

//             const successOutput = (
//                 <div className="p-3 bg-green-500/10 border border-green-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <CheckCircleIcon className="h-5 w-5 text-green-500" />
//                         <span className="font-medium text-green-500">All Test Cases Passed!</span>
//                     </div>
//                 </div>
//             );

//             const failureOutput = (
//                 <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                         <span className="font-medium text-red-500">Some Test Cases Failed</span>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         <p>Please check your solution and try again.</p>
//                     </div>
//                 </div>
//             );
//             setOutput(allPassed ? successOutput : failureOutput);

//             setStatus('success');
//         }, 2000);
//     };
//     if (!problem) {
//         return <div>No problem found ..</div>
//     }
//     return (
//         <SectionWrapper>
//             <div className="min-h-screen rounded-lg shadow-xl bg-background flex flex-col">
//                 {/* Header */}
//                 <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
//                     <div className="flex items-center gap-2">
//                         <CodeIcon className="h-6 w-6 text-primary" />
//                         <h1 className="text-xl font-semibold">CodeChallenge</h1>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
//                             Problem #{problem.id}
//                         </Badge>
//                         <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
//                             {problem.difficuly.toUpperCase()}
//                         </Badge>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <div className="flex-1 overflow-hidden">
//                     <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
//                         {/* Left Panel (Problem Statement) */}
//                         <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-card">
//                             <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
//                                 <div className="px-4 pt-4 border-b">
//                                     <TabsList className="w-full grid grid-cols-2">
//                                         <TabsTrigger value="description" className="flex items-center gap-1">
//                                             <BookOpenIcon className="h-4 w-4" />
//                                             <span>Description</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger value="submissions" className="flex items-center gap-1">
//                                             <CheckCircleIcon className="h-4 w-4" />
//                                             <span>Submissions</span>
//                                         </TabsTrigger>
//                                     </TabsList>
//                                 </div>

//                                 <TabsContent value="description" className="flex-1 overflow-auto p-4 space-y-4">
//                                     <div>
//                                         <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
//                                         <div className="mt-1 flex items-center gap-2">
//                                             <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
//                                                 {problem.difficuly.toUpperCase()}
//                                             </Badge>
//                                             {problem.topic.map(topic => (
//                                                 <Badge key={topic} variant="outline" className="capitalize">
//                                                     {topic}
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <Separator />

//                                     <div className="space-y-4">
//                                         <div className="prose prose-sm max-w-none text-foreground">
//                                             <p>{problem.description}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Input Format:</h3>
//                                             <p className="text-sm">{problem.inputFormat}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Output Format:</h3>
//                                             <p className="text-sm">{problem.outputFormat}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Example:</h3>
//                                             <div className="bg-muted p-3 rounded-md space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input:</span>
//                                                     <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleInput}</pre>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output:</span>
//                                                     <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleOutput}</pre>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Constraints:</h3>
//                                             <pre className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{problem.constraints}</pre>
//                                         </div>
//                                     </div>
//                                 </TabsContent>

//                                 <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
//                                     <div className="space-y-4">
//                                         <h3 className="text-lg font-semibold">Your Submissions</h3>
//                                         <div className="space-y-2">
//                                             {[
//                                                 { id: 1, status: 'Accepted', runtime: '4ms', memory: '8.2MB', language: 'C++', date: '2 hours ago' },
//                                                 { id: 2, status: 'Wrong Answer', runtime: '7ms', memory: '9.1MB', language: 'Python', date: '1 day ago' }
//                                             ].map(submission => (
//                                                 <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
//                                                     <div className="flex items-center gap-2">
//                                                         {submission.status === 'Accepted' ? (
//                                                             <CheckCircleIcon className="h-5 w-5 text-green-500" />
//                                                         ) : (
//                                                             <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                                                         )}
//                                                         <span className={submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
//                                                             {submission.status}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                                         <span>{submission.runtime}</span>
//                                                         <span>{submission.memory}</span>
//                                                         <span>{submission.language}</span>
//                                                         <span>{submission.date}</span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </TabsContent>
//                             </Tabs>
//                         </ResizablePanel>

//                         <ResizableHandle withHandle />

//                         {/* Right Panel (Editor & Output) */}
//                         <ResizablePanel defaultSize={70} className="bg-background">
//                             <ResizablePanelGroup direction="vertical">
//                                 {/* Code Editor */}
//                                 <ResizablePanel defaultSize={70} className="bg-card">
//                                     <div className="p-4 border-b flex items-center justify-between">
//                                         <Select value={language.toString()} onValueChange={(val) => setLanguage(Number(val))}>
//                                             <SelectTrigger className="w-48 bg-background">
//                                                 <SelectValue>
//                                                     {languages.find((lang) => lang.id === language)?.name}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {languages.map((lang) => (
//                                                     <SelectItem key={lang.id} value={lang.id.toString()}>
//                                                         {lang.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>

//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="gap-1"
//                                                 onClick={handleRun}
//                                                 disabled={status === 'running'}
//                                             >
//                                                 <PlayIcon className="h-4 w-4" />
//                                                 Run
//                                             </Button>
//                                             <Button
//                                                 size="sm"
//                                                 className="gap-1"
//                                                 onClick={handleSubmit}
//                                                 disabled={status === 'running'}
//                                             >
//                                                 <SendIcon className="h-4 w-4" />
//                                                 Submit
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     <div className="p-4 h-[calc(100%-57px)]">
//                                         <div
//                                             className="w-full h-full border rounded-md overflow-hidden"
//                                             style={{
//                                                 fontFamily: 'monospace',
//                                                 fontSize: '14px',
//                                                 padding: '12px',
//                                                 backgroundColor: '#f8f9fa',
//                                                 color: '#212529',
//                                                 whiteSpace: 'pre',
//                                                 overflowY: 'auto'
//                                             }}
//                                         >
//                                             <Editor
//                                                 height="100%"
//                                                 defaultLanguage="cpp"
//                                                 value={code}
//                                                 theme="vs-dark"
//                                                 onChange={(value) => setCode(value || "")}
//                                                 className="rounded-md border border-gray-700"
//                                             />
//                                         </div>
//                                     </div>
//                                 </ResizablePanel>

//                                 <ResizableHandle withHandle />

//                                 {/* Output Panel */}
//                                 <ResizablePanel defaultSize={30} className="bg-card">
//                                     <div className="p-4 border-b flex items-center gap-2">
//                                         <TerminalIcon className="h-4 w-4" />
//                                         <h2 className="font-medium">Console Output</h2>
//                                         {status === 'running' && (
//                                             <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-200">
//                                                 Running...
//                                             </Badge>
//                                         )}
//                                         {status === 'success' && (
//                                             <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-200">
//                                                 Success
//                                             </Badge>
//                                         )}
//                                         {status === 'error' && (
//                                             <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-200">
//                                                 Error
//                                             </Badge>
//                                         )}
//                                     </div>

//                                     <div className="p-4 h-[calc(100%-57px)] overflow-auto">
//                                         {status === 'idle' ? (
//                                             <div className="flex items-center justify-center h-full text-muted-foreground">
//                                                 <p>Run your code to see the output here</p>
//                                             </div>
//                                         ) : status === 'running' ? (
//                                             <div className="flex items-center justify-center h-full text-muted-foreground">
//                                                 <p>Running your code...</p>
//                                             </div>
//                                         ) : (
//                                             <div>{output}</div>
//                                         )}
//                                     </div>
//                                 </ResizablePanel>
//                             </ResizablePanelGroup>
//                         </ResizablePanel>
//                     </ResizablePanelGroup>
//                 </div>
//             </div>
//         </SectionWrapper>
//     );
// }

// export default ProblemInterFace;
// "use client";
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import SectionWrapper from '@/hoc/sectionWrapper';
// import { difficultyColors } from '@/lib';
// import { problems } from '@/lib/codingProblemData';
// import { Editor } from '@monaco-editor/react';
// import { AlertCircleIcon, BookOpenIcon, CheckCircleIcon, CodeIcon, PlayIcon, SendIcon, TerminalIcon } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import { JSX, useEffect, useState } from 'react';
// import './styles.css';


// interface TestCaseType {
//     input: string;
//     expectedOutput: string;
//     actualOutput?: string;
// }

// interface CodingProblemType {
//     id: string;
//     title: string;
//     description: string;
//     inputFormat: string;
//     outputFormat: string;
//     exampleInput: string;
//     exampleOutput: string;
//     constraints: string;
//     difficuly: "easy" | "medium" | "hard";
//     topic: string[];
//     testCases: TestCaseType[];
// }



// const languages = [
//     { id: 54, name: "C++ (GCC 9.2.0)" },
//     { id: 62, name: "Java (OpenJDK 13)" },
//     { id: 71, name: "Python (3.8.1)" }
// ];

// // Default code templates for different languages
// const defaultCodeTemplates: Record<number, string> = {
//     54: `#include <iostream>
// using namespace std;

// int main() {

//   return 0;
// }`,
//     62: `import java.util.Scanner;

// public class Main {


//   public static void main(String[] args) {


//   }
// }`,
//     71: `def factorial(n):
//   # Your solution here
//   pass


// `
// };
// const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
// const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY!;

// function ProblemInterFace() {

//     const [problem, setProblem] = useState<CodingProblemType>();
//     const [language, setLanguage] = useState(languages[0].id);
//     const [code, setCode] = useState(defaultCodeTemplates[languages[0].id]);
//     const [output, setOutput] = useState<JSX.Element | string | undefined>(undefined);

//     const [testCases, setTestCases] = useState<TestCaseType[]>([]);
//     const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
//     const [activeTab, setActiveTab] = useState('description');
//     const { problem_id } = useParams();

//     const router = useRouter();
//     useEffect(() => {
//         const foundProblem = problems.find(problem => problem.id === problem_id);

//         if (foundProblem) {
//             setProblem(foundProblem);
//             setTestCases(foundProblem.testCases)
//         } else {

//             alert("Problem Not Found. Returning to Home.");
//             router.push("/");
//         }
//     }, [problem_id]);

//     useEffect(() => {
//         setCode(defaultCodeTemplates[language] || '');
//     }, [language]);

//     const handleRun = async () => {
//         console.log(code);
//         setStatus('running');
//         setOutput(undefined);

//         if (!RAPIDAPI_KEY) {
//             console.error("NO JUDGE0 API KEY PRESENT");
//             setOutput(
//                 <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                         <span className="font-medium text-red-500">API Key Missing</span>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         <p>Judge0 API key is not configured. Please add it to your environment variables.</p>
//                     </div>
//                 </div>
//             );
//             setStatus("error");
//             return;
//         }

//         try {
//             // Only run the first two test cases
//             const RunTesCases = testCases.slice(0, 2);

//             const submissions = await Promise.all(
//                 RunTesCases.map(async (test) => {
//                     console.log("TEST", test);

//                     try {
//                         const submissionRes = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false`, {
//                             method: "POST",
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 "X-RapidAPI-Key": RAPIDAPI_KEY,
//                                 "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//                             },
//                             body: JSON.stringify({
//                                 source_code: code,
//                                 language_id: language,
//                                 stdin: test.input,
//                             }),
//                         });

//                         if (!submissionRes.ok) {
//                             throw new Error(`API responded with status: ${submissionRes.status}`);
//                         }

//                         const data = await submissionRes.json();
//                         if (!data || !data.token) {
//                             throw new Error("Invalid response from Judge0 API");
//                         }

//                         return { token: data.token, input: test.input, expected: test.expectedOutput };
//                     } catch (error) {
//                         console.error("Submission error:", error);
//                         return { error: true, input: test.input, expected: test.expectedOutput };
//                     }
//                 })
//             );

//             // Filter out submissions with errors
//             const validSubmissions = submissions.filter(sub => !sub.error);

//             if (validSubmissions.length === 0) {
//                 throw new Error("All submissions failed");
//             }

//             const results = await Promise.all(
//                 validSubmissions.map(async ({ token, input, expected }) => {
//                     let resultData;
//                     let attempts = 0;
//                     const maxAttempts = 5;

//                     do {
//                         try {
//                             const resultRes = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
//                                 method: "GET",
//                                 headers: {
//                                     "X-RapidAPI-Key": RAPIDAPI_KEY,
//                                     "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//                                 },
//                             });

//                             if (!resultRes.ok) {
//                                 throw new Error(`API responded with status: ${resultRes.status}`);
//                             }

//                             resultData = await resultRes.json();

//                             if (resultData.status && resultData.status.id > 2) break;

//                             attempts++;
//                             if (attempts >= maxAttempts) {
//                                 throw new Error("Maximum polling attempts reached");
//                             }

//                             await new Promise((res) => setTimeout(res, 1000));
//                         } catch (error) {
//                             console.error("Error polling for results:", error);
//                             resultData = { error: true };
//                             break;
//                         }
//                     } while (true);

//                     const actualOutput = resultData.error
//                         ? "Error: Failed to retrieve results"
//                         : resultData.stdout
//                             ? resultData.stdout.trim()
//                             : resultData.stderr
//                                 ? `Error: ${resultData.stderr.trim()}`
//                                 : `Error: ${resultData.compile_output || "Unknown error"}`;

//                     return { input, expected, actualOutput };
//                 })
//             );

//             // Update test cases with results
//             const updatedTestCases = [...testCases];
//             results.forEach((result, i) => {
//                 if (i < updatedTestCases.length) {
//                     updatedTestCases[i] = {
//                         ...updatedTestCases[i],
//                         actualOutput: result.actualOutput
//                     };
//                 }
//             });
//             setTestCases(updatedTestCases);

//             // Create output elements
//             const outputElements = (
//                 <div className="space-y-4">
//                     {results.map((r, index) => (
//                         <div key={index} className="mb-3 p-3 border rounded-md">
//                             <div className="flex items-center justify-between mb-2">
//                                 <span className="font-medium">Test Case {index + 1}:</span>
//                                 <Badge
//                                     variant={r.actualOutput === r.expected ? "outline" : "outline"}
//                                     className={r.actualOutput === r.expected
//                                         ? "bg-green-500/10 text-green-500 border-green-200"
//                                         : "bg-red-500/10 text-red-500 border-red-200"}
//                                 >
//                                     {r.actualOutput === r.expected ? "Passed" : "Failed"}
//                                 </Badge>
//                             </div>
//                             <div className="grid grid-cols-2 gap-2 text-sm">
//                                 <div>
//                                     <div className="text-muted-foreground">Input:</div>
//                                     <pre className="bg-muted/50 p-1 rounded mt-1">{r.input.trim()}</pre>
//                                 </div>
//                                 <div>
//                                     <div className="text-muted-foreground">Expected Output:</div>
//                                     <pre className="bg-muted/50 p-1 rounded mt-1">{r.expected}</pre>
//                                 </div>
//                                 {r.actualOutput && (
//                                     <div className="col-span-2">
//                                         <div className="text-muted-foreground">Your Output:</div>
//                                         <pre className={`p-1 rounded mt-1 ${r.actualOutput === r.expected
//                                             ? "bg-green-500/10"
//                                             : "bg-red-500/10"}`}>{r.actualOutput}</pre>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             );

//             setOutput(outputElements);
//             setStatus('success');

//         } catch (error) {
//             console.error("Error running code:", error);
//             setOutput(
//                 <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                         <span className="font-medium text-red-500">Execution Error</span>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         <p>There was an error executing your code. Please try again later.</p>
//                         <pre className="mt-2 p-2 bg-muted rounded-md">{error instanceof Error ? error.message : "Unknown error"}</pre>
//                     </div>
//                 </div>
//             );
//             setStatus('error');
//         }
//     };

//     const handleSubmit = () => {
//         setStatus('running');

//         // Simulate code submission with all test cases
//         setTimeout(() => {
//             // For demonstration, show all test cases passed
//             const allPassed = false;

//             const successOutput = (
//                 <div className="p-3 bg-green-500/10 border border-green-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <CheckCircleIcon className="h-5 w-5 text-green-500" />
//                         <span className="font-medium text-green-500">All Test Cases Passed!</span>
//                     </div>
//                 </div>
//             );

//             const failureOutput = (
//                 <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
//                     <div className="flex items-center gap-2 mb-2">
//                         <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                         <span className="font-medium text-red-500">Some Test Cases Failed</span>
//                     </div>
//                     <div className="text-sm text-muted-foreground">
//                         <p>Please check your solution and try again.</p>
//                     </div>
//                 </div>
//             );
//             setOutput(allPassed ? successOutput : failureOutput);

//             setStatus('success');
//         }, 2000);
//     };
//     if (!problem) {
//         return <div>No problem found ..</div>
//     }
//     return (
//         <SectionWrapper>
//             <div className="min-h-screen rounded-lg shadow-xl bg-background flex flex-col">
//                 {/* Header */}
//                 <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
//                     <div className="flex items-center gap-2">
//                         <CodeIcon className="h-6 w-6 text-primary" />
//                         <h1 className="text-xl font-semibold">CodeChallenge</h1>
//                     </div>
//                     <div className="flex items-center gap-4">
//                         <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
//                             Problem #{problem.id}
//                         </Badge>
//                         <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
//                             {problem.difficuly.toUpperCase()}
//                         </Badge>
//                     </div>
//                 </header>

//                 {/* Main Content */}
//                 <div className="flex-1 overflow-hidden">
//                     <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
//                         {/* Left Panel (Problem Statement) */}
//                         <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-card">
//                             <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
//                                 <div className="px-4 pt-4 border-b">
//                                     <TabsList className="w-full grid grid-cols-2">
//                                         <TabsTrigger value="description" className="flex items-center gap-1">
//                                             <BookOpenIcon className="h-4 w-4" />
//                                             <span>Description</span>
//                                         </TabsTrigger>
//                                         <TabsTrigger value="submissions" className="flex items-center gap-1">
//                                             <CheckCircleIcon className="h-4 w-4" />
//                                             <span>Submissions</span>
//                                         </TabsTrigger>
//                                     </TabsList>
//                                 </div>

//                                 <TabsContent value="description" className="flex-1 overflow-auto p-4 space-y-4">
//                                     <div>
//                                         <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
//                                         <div className="mt-1 flex items-center gap-2">
//                                             <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
//                                                 {problem.difficuly.toUpperCase()}
//                                             </Badge>
//                                             {problem.topic.map(topic => (
//                                                 <Badge key={topic} variant="outline" className="capitalize">
//                                                     {topic}
//                                                 </Badge>
//                                             ))}
//                                         </div>
//                                     </div>

//                                     <Separator />

//                                     <div className="space-y-4">
//                                         <div className="prose prose-sm max-w-none text-foreground">
//                                             <p>{problem.description}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Input Format:</h3>
//                                             <p className="text-sm">{problem.inputFormat}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Output Format:</h3>
//                                             <p className="text-sm">{problem.outputFormat}</p>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Example:</h3>
//                                             <div className="bg-muted p-3 rounded-md space-y-2">
//                                                 <div>
//                                                     <span className="font-medium">Input:</span>
//                                                     <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleInput}</pre>
//                                                 </div>
//                                                 <div>
//                                                     <span className="font-medium">Output:</span>
//                                                     <pre className="mt-1 text-sm bg-muted/50 p-2 rounded">{problem.exampleOutput}</pre>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <h3 className="font-semibold text-foreground">Constraints:</h3>
//                                             <pre className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{problem.constraints}</pre>
//                                         </div>
//                                     </div>
//                                 </TabsContent>

//                                 <TabsContent value="submissions" className="flex-1 overflow-auto p-4">
//                                     <div className="space-y-4">
//                                         <h3 className="text-lg font-semibold">Your Submissions</h3>
//                                         <div className="space-y-2">
//                                             {[
//                                                 { id: 1, status: 'Accepted', runtime: '4ms', memory: '8.2MB', language: 'C++', date: '2 hours ago' },
//                                                 { id: 2, status: 'Wrong Answer', runtime: '7ms', memory: '9.1MB', language: 'Python', date: '1 day ago' }
//                                             ].map(submission => (
//                                                 <div key={submission.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
//                                                     <div className="flex items-center gap-2">
//                                                         {submission.status === 'Accepted' ? (
//                                                             <CheckCircleIcon className="h-5 w-5 text-green-500" />
//                                                         ) : (
//                                                             <AlertCircleIcon className="h-5 w-5 text-red-500" />
//                                                         )}
//                                                         <span className={submission.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
//                                                             {submission.status}
//                                                         </span>
//                                                     </div>
//                                                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                                                         <span>{submission.runtime}</span>
//                                                         <span>{submission.memory}</span>
//                                                         <span>{submission.language}</span>
//                                                         <span>{submission.date}</span>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 </TabsContent>
//                             </Tabs>
//                         </ResizablePanel>

//                         <ResizableHandle withHandle />

//                         {/* Right Panel (Editor & Output) */}
//                         <ResizablePanel defaultSize={70} className="bg-background">
//                             <ResizablePanelGroup direction="vertical">
//                                 {/* Code Editor */}
//                                 <ResizablePanel defaultSize={70} className="bg-card">
//                                     <div className="p-4 border-b flex items-center justify-between">
//                                         <Select value={language.toString()} onValueChange={(val) => setLanguage(Number(val))}>
//                                             <SelectTrigger className="w-48 bg-background">
//                                                 <SelectValue>
//                                                     {languages.find((lang) => lang.id === language)?.name}
//                                                 </SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {languages.map((lang) => (
//                                                     <SelectItem key={lang.id} value={lang.id.toString()}>
//                                                         {lang.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>

//                                         <div className="flex items-center gap-2">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="gap-1"
//                                                 onClick={handleRun}
//                                                 disabled={status === 'running'}
//                                             >
//                                                 <PlayIcon className="h-4 w-4" />
//                                                 Run
//                                             </Button>
//                                             <Button
//                                                 size="sm"
//                                                 className="gap-1"
//                                                 onClick={handleSubmit}
//                                                 disabled={status === 'running'}
//                                             >
//                                                 <SendIcon className="h-4 w-4" />
//                                                 Submit
//                                             </Button>
//                                         </div>
//                                     </div>

//                                     <div className="p-4 h-[calc(100%-57px)]">
//                                         <div
//                                             className="w-full h-full border rounded-md overflow-hidden"
//                                             style={{
//                                                 fontFamily: 'monospace',
//                                                 fontSize: '14px',
//                                                 padding: '12px',
//                                                 backgroundColor: '#f8f9fa',
//                                                 color: '#212529',
//                                                 whiteSpace: 'pre',
//                                                 overflowY: 'auto'
//                                             }}
//                                         >
//                                             <Editor
//                                                 height="100%"
//                                                 defaultLanguage="cpp"
//                                                 value={code}
//                                                 theme="vs-dark"
//                                                 onChange={(value) => setCode(value || "")}
//                                                 className="rounded-md border border-gray-700"
//                                             />
//                                         </div>
//                                     </div>
//                                 </ResizablePanel>

//                                 <ResizableHandle withHandle />

//                                 {/* Output Panel */}
//                                 <ResizablePanel defaultSize={30} className="bg-card">
//                                     <div className="p-4 border-b flex items-center gap-2">
//                                         <TerminalIcon className="h-4 w-4" />
//                                         <h2 className="font-medium">Console Output</h2>
//                                         {status === 'running' && (
//                                             <Badge variant="outline" className="ml-2 bg-blue-500/10 text-blue-500 border-blue-200">
//                                                 Running...
//                                             </Badge>
//                                         )}
//                                         {status === 'success' && (
//                                             <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-500 border-green-200">
//                                                 Success
//                                             </Badge>
//                                         )}
//                                         {status === 'error' && (
//                                             <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-200">
//                                                 Error
//                                             </Badge>
//                                         )}
//                                     </div>

//                                     <div className="p-4 h-[calc(100%-57px)] overflow-auto">
//                                         {status === 'idle' ? (
//                                             <div className="flex items-center justify-center h-full text-muted-foreground">
//                                                 <p>Run your code to see the output here</p>
//                                             </div>
//                                         ) : status === 'running' ? (
//                                             <div className="flex items-center justify-center h-full text-muted-foreground">
//                                                 <p>Running your code...</p>
//                                             </div>
//                                         ) : (
//                                             <div>{output}</div>
//                                         )}
//                                     </div>
//                                 </ResizablePanel>
//                             </ResizablePanelGroup>
//                         </ResizablePanel>
//                     </ResizablePanelGroup>
//                 </div>
//             </div>
//         </SectionWrapper>
//     );
// }

// export default ProblemInterFace;
