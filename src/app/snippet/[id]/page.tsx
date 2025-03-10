"use client";

import { openEditModalProps } from "@/app/snippets/page";
import CodeEditor from "@/components/codeEditor";
import EditSnippet from "@/components/Forms/editSnippet";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import SectionWrapper from "@/hoc/sectionWrapper";
import { showToast } from "@/lib";
import { DELETE_SNIPPET } from "@/lib/services";

import { Snippet } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { removeSnippet } from "@/redux/slice/snippetSlice";
import { useMutation } from "@apollo/client";
import { Check, Copy, Pen, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TemplateDetail = () => {
    const [copied, setCopied] = useState(false);
    const [snippet, setSnippet] = useState<Snippet>();
    const { id } = useParams();
    const snippets = useAppSelector(state => state.snippets.snippets);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openEditModal, setOpenEditModal] = useState<openEditModalProps>({
        open: false,
    });
    const [deleteSnippet] = useMutation(DELETE_SNIPPET);
    useEffect(() => {
        if (!id || snippets.length === 0) return;
        const snip = snippets.find((item) => item.id === id);
        // console.log(id);
        if (snip) {
            setLoading(false);
        }
        setSnippet(snip);
    }, [id, snippets, snippet]);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleDeleteSnippet = async () => {
        if (!snippet) return;
        try {
            await deleteSnippet({ variables: { deleteSnippetId: snippet.id } }).then(() => {
                showToast('Snippet deleted successfully', 'success');
                dispatch(removeSnippet(snippet.id));
                router.push("/snippets");
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            console.error(error);
        }
    }
    if (!snippet) return <div className="text-center text-2xl font-semibold text-red-500">Snippet Not Found</div>;
    if (loading) return <Loader />
    return (
        <SectionWrapper>


            <header className="mt-12 bg-white p-8 rounded-3xl shadow-lg">
                <h1 className="text-5xl font-extrabold drop-shadow-lg">{snippet.title}</h1>
                <p className="mt-4 text-lg opacity-90">{snippet.description}</p>

                <div className="flex justify-between">
                    <ul className="mt-6 flex flex-wrap gap-3">
                        {snippet.tags.map((tag, index) => (
                            <li key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md text-sm font-medium">
                                {tag}
                            </li>
                        ))}
                    </ul>
                    {(user?.id === snippet.author.id) && <ul className="mt-6 flex flex-wrap gap-3">
                        <li><Button variant="outline" onClick={() => setOpenEditModal({
                            open: true,
                            snippet: snippet
                        })} className="bg-pink-500 text-white hover:bg-pink-600 ">Edit<Pen color="white" /></Button></li>
                        <li><Button variant="destructive" onClick={handleDeleteSnippet}>Delete<Trash2 /></Button></li>
                    </ul>}
                </div>
            </header>

            <div className="mt-12 relative bg-gray-900 text-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-semibold flex items-center space-x-2">
                    <Copy size={28} /> <span>Snippet</span>
                </h2>
                <Button variant="ghost"
                    onClick={() => copyToClipboard(snippet.sourceCode)}
                    className="absolute top-4 right-4 px-4 py-2 bg-gray-500 hover:bg-gray-200 text-white rounded-lg flex items-center space-x-2 shadow-md"

                >

                    {copied ? <Check size={20} /> : <Copy size={20} />} <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <div className="mt-6 relative">


                    <CodeEditor sourceCode={snippet.sourceCode} />


                </div>
            </div>
            {openEditModal.open && <EditSnippet snippet={openEditModal.snippet!} handleClose={() => setOpenEditModal({
                open: false,
                snippet: undefined
            })} />}
        </SectionWrapper>
    );
};

export default TemplateDetail;
