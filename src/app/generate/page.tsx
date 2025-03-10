"use client";

import CodeEditor from "@/components/codeEditor";
import CodePreview from "@/components/codePreview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/hoc/sectionWrapper";
import { showToast } from "@/lib";
import { GeneratedCodeType, Snippet } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { addSnippet } from "@/redux/slice/snippetSlice";
import { motion } from "framer-motion";
import { Clipboard, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
export default function AIGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<GeneratedCodeType | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const { user, isLoggedIn } = useAppSelector(state => state.user);
    const interval = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + Math.ceil((100 - prev) / 10);
        });
    }, 300);
    const handleGenerate = async () => {
        if (!isLoggedIn) {
            showToast("To Use This Feature You Must Login First", "info");
            return;
        }
        setIsGenerating(true);
        // setGeneratedCode("");
        setProgress(0);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ prompt }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json(); // Get response as a string
            extractAndSetGeneratedCode(data.snippet, setGeneratedCode);
            // const data = await response.json();
            // console.log("DATA", data);
            // if (data.snippet) {
            //     const extractedCode = extractCodeBlock(data.snippet);
            //     setGeneratedCode(extractedCode || "No valid code found.");
            //     setTimeout(() => {
            //         scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            //     }, 100);
            // } else {
            //     setGeneratedCode("No code generated.");
            // }
        } catch (error) {
            console.error("Error fetching AI snippet:", error);
            // setGeneratedCode("Error generating code.");
        } finally {
            setIsGenerating(false);
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
                setIsGenerating(false);
            }, 500);
        }
    };
    const extractAndSetGeneratedCode = (responseString: string, setGeneratedCode: (code: GeneratedCodeType | null) => void) => {
        try {
            const jsonMatch = responseString.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error("No valid JSON found in response.");
                setGeneratedCode(null);
                return;
            }

            const data = JSON.parse(jsonMatch[0]);
            if (data?.title && data?.description && data?.language && data?.sourceCode) {
                setGeneratedCode({
                    title: data.title,
                    description: data.description,
                    language: data.language.toLowerCase(),
                    sourceCode: extractCodeBlock(data.sourceCode),
                });
            } else {
                console.error("Invalid response format");
                setGeneratedCode(null);
            }
        } catch (error) {
            console.error("Error parsing generated code:", error);
            setGeneratedCode(null);
        }
    };

    const extractCodeBlock = (text: string) => {
        const codeMatch = text.match(/```(?:tsx|jsx|javascript|html|css|.*)?\n([\s\S]*?)\n```/);
        return codeMatch ? codeMatch[1].trim() : text.trim();
    };

    const copyToClipboard = () => {
        if (!generatedCode) return;
        navigator.clipboard.writeText(generatedCode.sourceCode);
        toast.success("Code copied to clipboard!");
    };

    const dispatch = useAppDispatch();
    const snippets = useAppSelector(state => state.snippets.snippets)
    const handleMakeSnippetSubmit = () => {
        if (!generatedCode) {
            return;
        }
        console.log("generatedCode", generatedCode);
        const snippetNew: Snippet = {
            id: crypto.randomUUID(),
            title: generatedCode?.title,
            description: generatedCode?.description,
            language: generatedCode?.language,
            sourceCode: generatedCode?.sourceCode,
            tags: ["AI Generated"],
            author: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
            }
        }
        if (snippetNew) {
            if (snippets.some(snippet => snippet.sourceCode === snippetNew.sourceCode)) {
                alert("SNIPPET ALREADY EXISTS");
            } else
                dispatch(addSnippet(snippetNew));
        }
        // if(snippets.filter)
        //     const isDuplicate = snippets.some(snippet => snippet.sourceCode === snippetNew.sourceCode);

        // if (isDuplicate) {
        //     console.log("This snippet already exists!");
        // } else {
        //     snippets.push(snippetNew);
        //     console.log("Snippet added successfully.");
        // }
    }
    return (
        <SectionWrapper>
            <div className="bg-gray-800 mx-16 p-12 rounded-lg shadow-xl">
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center flex flex-col items-center gap-4 mb-12"
                >
                    {/* Animated AI GIF */}
                    <motion.img
                        src="/chatBot.gif"
                        alt="AI Bot"
                        className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg"
                        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />

                    {/* AI Generator Title */}
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-400 drop-shadow-xl">
                        AI Snippet Generator
                    </h1>

                    {/* Subheading with a subtle fade-in effect */}
                    <motion.p
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mt-2 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                    >
                        Describe your dream website, and let AI create it for you!
                    </motion.p>
                </motion.div>


                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-3xl mx-auto"
                >
                    <Card className="p-8 bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm font-semibold mb-2 block text-gray-400">
                                    Describe your website
                                </label>
                                <Textarea
                                    placeholder="E.g., A sleek portfolio for a photographer with a gallery grid..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="h-32 bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all shadow-lg"
                                />
                            </div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
                                    size="lg"
                                    onClick={handleGenerate}
                                    disabled={!prompt || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                            Generating... {progress}%
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Generate ✨
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {generatedCode && (

                <motion.div
                    ref={scrollRef}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mx-16 p-12 rounded-lg shadow-xl bg-gray-800 mt-3"
                >
                    <header className="bg-white rounded-lg p-4 my-4">
                        <h2 className="text-2xl font-bold">{generatedCode.title}</h2>
                        <p>{generatedCode.description}</p>
                    </header>
                    <div>
                        <Card className="p-6 bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold text-blue-400">Generated Code</h2>
                                <div className="flex gap-3">
                                    <Button className="bg-orange-400 hover:bg-orange-500" variant="outline" onClick={handleMakeSnippetSubmit} >Make a Snippet</Button>
                                    <Button variant="outline">
                                        {generatedCode.language.toUpperCase()}
                                    </Button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={copyToClipboard}
                                        className="text-gray-400 hover:text-white transition-all flex items-center"
                                    >
                                        <Clipboard className="w-5 h-5 mr-2" />
                                        Copy
                                    </motion.button>
                                </div>
                            </div>
                            {generatedCode.language === 'react' ? <CodePreview code={generatedCode?.sourceCode} /> : <CodeEditor sourceCode={generatedCode?.sourceCode} />}
                        </Card>
                    </div>

                </motion.div>
            )}
        </SectionWrapper>
    );
}
