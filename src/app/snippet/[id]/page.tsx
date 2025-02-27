"use client";

import CodeEditor from "@/components/codeEditor";
import CodePreview from "@/components/codePreview";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/hoc/sectionWrapper";

import { Snippet } from "@/lib/types";
import { useAppSelector } from "@/redux/redux-hooks";
import { Check, Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TemplateDetail = () => {
    const [copied, setCopied] = useState(false);
    const [snippet, setSnippet] = useState<Snippet | null>(null);
    const { id } = useParams();
    const snippets = useAppSelector(state => state.snippets.snippets);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const snip = snippets.find((item) => item.id === id);
        if (snip) {
            setLoading(false);
        }
        setSnippet(snip || null);
    }, [id, snippets]);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!snippet) return <div className="text-center text-2xl font-semibold text-red-500">Snippet Not Found</div>;
    if (loading) return <Loader />
    return (
        <SectionWrapper>


            <header className="mt-12 bg-white p-8 rounded-3xl shadow-lg">
                <h1 className="text-5xl font-extrabold drop-shadow-lg">{snippet.title}</h1>
                <p className="mt-4 text-lg opacity-90">{snippet.description}</p>

                <ul className="mt-6 flex flex-wrap gap-3">
                    {snippet.tags.map((tag, index) => (
                        <li key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
                            {tag}
                        </li>
                    ))}
                </ul>
            </header>

            <div className="mt-12 relative bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-semibold flex items-center space-x-2">
                    <Copy size={28} /> <span>Snippet</span>
                </h2>
                <Button variant="ghost"
                    onClick={() => copyToClipboard(snippet.source_code)}
                    className="absolute top-4 right-4 px-4 py-2 bg-gray-500 hover:bg-gray-200 text-white rounded-lg flex items-center space-x-2 shadow-md"

                >

                    {copied ? <Check size={20} /> : <Copy size={20} />} <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <div className="mt-6 relative">


                    {snippet.language !== 'react' ? <CodeEditor sourceCode={snippet.source_code} /> : <CodePreview code={snippet.source_code} />}


                </div>
            </div>
        </SectionWrapper>
    );
};

export default TemplateDetail;
