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
    difficuly: "easy" | "medium" | "hard";
    topic: string[];
    testCases: TestCaseType[];
}

// Mock problem data
const mockProblem: CodingProblemType = {
    id: "1",
    title: "Factorial Calculator",
    description: "Write a function to calculate the factorial of a given number n. The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.",
    inputFormat: "A single integer n (0 ≤ n ≤ 20).",
    outputFormat: "The factorial of n.",
    exampleInput: "5",
    exampleOutput: "120",
    constraints: "0 ≤ n ≤ 20",
    difficuly: "easy",
    topic: ["math", "recursion"],
    testCases: [
        { input: "5\n", expectedOutput: "120", actualOutput: "" },
        { input: "3\n", expectedOutput: "6", actualOutput: "" },
        { input: "0\n", expectedOutput: "1", actualOutput: "" }
    ]
};

const languages = [
    { id: 54, name: "C++ (GCC 9.2.0)" },
    { id: 62, name: "Java (OpenJDK 13)" },
    { id: 71, name: "Python (3.8.1)" }
];

// Default code templates for different languages
const defaultCodeTemplates: Record<number, string> = {
    54: `#include <iostream>
using namespace std;

int factorial(int n) {
  // Your solution here
}

int main() {
  int n;
  cin >> n;
  cout << factorial(n) << endl;
  return 0;
}`,
    62: `import java.util.Scanner;

public class Main {
  public static int factorial(int n) {
    // Your solution here
  }
  
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);
    int n = scanner.nextInt();
    System.out.println(factorial(n));
    scanner.close();
  }
}`,
    71: `def factorial(n):
  # Your solution here
  pass

n = int(input())
print(factorial(n))
`
};

function ProblemInterFace() {

    const [problem, setProblem] = useState<CodingProblemType>(mockProblem);
    const [language, setLanguage] = useState(languages[0].id);
    const [code, setCode] = useState(defaultCodeTemplates[languages[0].id]);
    const [output, setOutput] = useState<JSX.Element[] | string>();
    const [testCases, setTestCases] = useState(mockProblem.testCases);
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

    const handleRun = () => {
        setStatus('running');

        // Simulate API call to Judge0
        setTimeout(() => {
            // Mock results for demonstration
            const results = testCases.map((testCase, index) => {
                // Simulate different results for different test cases
                const passed = index !== 1; // Make the second test case fail for demonstration
                return {
                    input: testCase.input,
                    expected: testCase.expectedOutput,
                    actualOutput: passed ? testCase.expectedOutput : (parseInt(testCase.expectedOutput) - 1).toString()
                };
            });

            // Update test cases with results
            setTestCases(prev =>
                prev.map((test, i) => ({
                    ...test,
                    actualOutput: results[i].actualOutput
                }))
            );

            // Create output elements
            const outputElements = results.map((r, index) => (
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
            ));

            setOutput(outputElements);
            setStatus('success');
        }, 1500);
    };

    const handleSubmit = () => {
        setStatus('running');

        // Simulate code submission with all test cases
        setTimeout(() => {
            // For demonstration, show all test cases passed
            const allPassed = true;

            if (allPassed) {
                // setOutput(
                //     <div className="p-3 bg-green-500/10 border border-green-200 rounded-md">
                //         <div className="flex items-center gap-2 mb-2">
                //             <CheckCircleIcon className="h-5 w-5 text-green-500" />
                //             <span className="font-medium text-green-500">All Test Cases Passed!</span>
                //         </div>
                //         <div className="text-sm text-muted-foreground">
                //             <p>Runtime: 4ms (faster than 92% of submissions)</p>
                //             <p>Memory: 8.2MB (less than 87% of submissions)</p>
                //         </div>
                //     </div>
                // );
            } else {
                // setOutput(
                //     <div className="p-3 bg-red-500/10 border border-red-200 rounded-md">
                //         <div className="flex items-center gap-2 mb-2">
                //             <AlertCircleIcon className="h-5 w-5 text-red-500" />
                //             <span className="font-medium text-red-500">Some Test Cases Failed</span>
                //         </div>
                //         <div className="text-sm text-muted-foreground">
                //             <p>Please check your solution and try again.</p>
                //         </div>
                //     </div>
                // );
            }

            setStatus('success');
        }, 2000);
    };

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
                        <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
                            {problem.difficuly.toUpperCase()}
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
                                            <Badge className={`rounded-lg px-3 py-1 text-sm ${difficultyColors[problem.difficuly]}`}>
                                                {problem.difficuly.toUpperCase()}
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
                                            {code}
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
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import SectionWrapper from "@/hoc/sectionWrapper";
// import { problems } from "@/lib/codingProblemData";
// import { CodingProblemType } from "@/lib/types";
// import { Editor } from "@monaco-editor/react";
// import { BookOpenIcon, PlayIcon, SendIcon, TerminalIcon } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { JSX, useEffect, useState } from "react";



// const languages = [
//     { id: 54, name: "C++ (GCC 9.2.0)" },
//     { id: 62, name: "Java (OpenJDK 13)" },
//     { id: 71, name: "Python (3.8.1)" },
// ];

// export default function ProblemInterface() {
//     const { problem_id } = useParams();

//     const [problem, setProblem] = useState<CodingProblemType>();
//     const router = useRouter();
//     useEffect(() => {
//         const foundProblem = problems.find(problem => problem.id === problem_id);

//         if (foundProblem) {
//             setProblem(foundProblem);
//         } else {

//             alert("Problem Not Found. Returning to Home.");
//             router.push("/");
//         }
//     }, [problem_id]);
//     const [code, setCode] = useState("");
//     const [language, setLanguage] = useState(languages[0].id);
//     const [output, setOutput] = useState<JSX.Element[] | string>();
//     const [testCases, setTestCases] = useState([
//         { input: "5\n", expectedOutput: "120", actualOutput: "" },
//         { input: "3\n", expectedOutput: "6", actualOutput: "" },
//     ]);

//     const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
//     const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || "default value";

//     if (!RAPIDAPI_KEY) {
//         console.error("NO JUDGE0 API KEY PRESENT");
//     }

//     const handleSubmit = async () => {
//         setOutput("Running...");
//         if (!language) {
//             setOutput("Language is not set");
//             return;
//         }

//         const submissions = await Promise.all(
//             testCases.map(async (test) => {
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


//         setTestCases((prev) =>
//             prev.map((test, i) => ({
//                 ...test,
//                 actualOutput: results[i].actualOutput,
//             }))
//         );


//         // setOutput(
//         //     results
//         //         .map(
//         //             (r) =>
//         //                 `Input: ${r.input}\nExpected: ${r.expected}\nOutput: ${r.actualOutput}\nStatus: ${r.actualOutput === r.expected ? "✅ Passed" : "❌ Failed"
//         //                 }\n`
//         //         )
//         //         .join("\n")
//         // );
//         setOutput(results.map((r, index) => (

//             <li key={index}>
//                 <span>Test Case {index + 1}: </span>
//                 <button>{r.actualOutput === r.expected ? "Passed" : "Failed"}</button>
//             </li>

//         )))
//     };

//     return (
//         <SectionWrapper>
//             <div className="min-h-screen bg-background flex flex-col">
//                 <header className="border-b px-6 py-3 flex items-center justify-between bg-card">
//                     <div className="flex items-center gap-2">
//                         <BookOpenIcon className="h-6 w-6 text-primary" />
//                         <h1 className="text-xl font-semibold">CodeChallenge</h1>
//                     </div>
//                     {problem && (
//                         <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20 transition-colors">
//                             Problem #{problem.id}
//                         </Badge>
//                     )}
//                 </header>
//                 <div className="flex-1 overflow-hidden">
//                     <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
//                         <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-card p-4">
//                             {problem && (
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-foreground">{problem.title}</h2>
//                                     <p className="mt-2 text-foreground">{problem.description}</p>
//                                 </div>
//                             )}
//                         </ResizablePanel>
//                         <ResizableHandle withHandle />
//                         <ResizablePanel defaultSize={70} className="bg-background">
//                             <ResizablePanelGroup direction="vertical">
//                                 <ResizablePanel defaultSize={70} className="bg-card p-4">
//                                     <div className="flex justify-between items-center">
//                                         <Select value={language.toString()} onValueChange={(val) => setLanguage(Number(val))}>
//                                             <SelectTrigger className="w-48 bg-background">
//                                                 <SelectValue>{languages.find((lang) => lang.id === language)?.name}</SelectValue>
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {languages.map((lang) => (
//                                                     <SelectItem key={lang.id} value={lang.id.toString()}>
//                                                         {lang.name}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                         <div className="flex gap-2">
//                                             <Button variant="outline" size="sm" className="gap-1" onClick={handleSubmit}>
//                                                 <PlayIcon className="h-4 w-4" /> Run
//                                             </Button>
//                                             <Button size="sm" className="gap-1">
//                                                 <SendIcon className="h-4 w-4" /> Submit
//                                             </Button>
//                                         </div>
//                                     </div>
//                                     <Editor height="300px" theme="vs-dark" value={code} onChange={(val) => setCode(val || "")} />
//                                 </ResizablePanel>
//                                 <ResizableHandle withHandle />
//                                 <ResizablePanel defaultSize={30} className="bg-card p-4">
//                                     <div className="flex items-center gap-2">
//                                         <TerminalIcon className="h-4 w-4" />
//                                         <h2 className="font-medium">Console Output</h2>
//                                     </div>
//                                     <div className="mt-2 p-2 bg-muted rounded-md text-sm">
//                                         {status === "idle" ? "Run your code to see output here" : output}
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
