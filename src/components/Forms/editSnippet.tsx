"use client";
import { Card, CardContent } from "@/components/ui/card";
import CenterEditModal from '@/hoc/modals/editModal';
import { showToast } from '@/lib';
import { UPDATE_SNIPPET } from "@/lib/services";
import { Snippet } from '@/lib/types';
import { useAppDispatch } from '@/redux/redux-hooks';
import { useMutation } from "@apollo/client";
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { editSnippet } from "@/redux/slice/snippetSlice";

interface SnippetEditFormProps {
    snippet: Snippet;
    handleClose: () => void;
}

const EditSnippet = ({ snippet, handleClose }: SnippetEditFormProps) => {
    const [formData, setFormData] = useState({
        title: snippet.title,
        description: snippet.description,
        language: snippet.language,
        tagValue: "",
        tags: [...snippet.tags],
        sourceCode: snippet.sourceCode,
    });
    const dispatch = useAppDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [updateSnippet] = useMutation(UPDATE_SNIPPET);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { tagValue, ...rest } = formData;
            console.log(tagValue);
            const res = await updateSnippet({
                variables: {
                    input: {
                        id: snippet.id,
                        ...rest
                    }
                }
            })
            if (res.data.updateSnippet.success) {
                dispatch(editSnippet({
                    id: snippet.id,
                    title: formData.title,
                    description: formData.description,
                    language: formData.language,
                    tags: formData.tags,
                    sourceCode: formData.sourceCode
                }))
                showToast("Snippet Updated Successfully", "success");
                handleClose();
            } else { console.log("Snippet update failed") };
        } catch (error) {
            console.error(error);
        } finally {
        }
    };
    const addTag = () => {
        if (formData.tagValue.trim() && !formData.tags.includes(formData.tagValue.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, prev.tagValue.trim()],
                tagValue: "",
            }));
        }

    };


    const removeTag = (tag: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((item) => item !== tag),
        }));
    };
    return (
        <CenterEditModal handleSubmit={handleSubmit} handleClose={handleClose}>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-6 text-left">
                Edit Snippet
            </h2>

            <Card className="bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-900  shadow-xl rounded-xl p-6 border border-gray-700">
                <ScrollArea className=' h-[50vh] min-w-[60vw]'>
                    <CardContent>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Section */}
                            <div className="space-y-5">
                                {/* Title */}
                                <div className="flex flex-col gap-3">
                                    <label className=" text-xs text-gray-300 transition-all">
                                        Title
                                    </label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="bg-gray-900 text-white border border-purple-500 focus:ring-2 focus:ring-purple-400 rounded-lg px-4 py-3 transition-all hover:border-purple-300"
                                        required
                                    />
                                </div>

                                {/* Language */}
                                <div className="flex flex-col gap-3">
                                    <label className=" text-xs text-gray-300 transition-all">
                                        Language
                                    </label>
                                    <Input
                                        name="language"
                                        value={formData.language}
                                        onChange={handleChange}
                                        className="bg-gray-900 text-white border border-blue-500 focus:ring-2 focus:ring-blue-400 rounded-lg px-4 py-3 transition-all hover:border-blue-300"
                                        required
                                    />
                                </div>

                                {/* Tags */}
                                <div className="flex flex-col gap-3">
                                    <label className=" text-xs text-gray-300 transition-all">
                                        Tags
                                    </label>
                                    <div>

                                        <div className='flex gap-2'>
                                            <Input
                                                name="tagValue"
                                                value={formData.tagValue}
                                                onChange={handleChange}
                                                className="bg-gray-900 text-white border border-green-500 focus:ring-2 focus:ring-green-400 rounded-lg px-4 py-3 transition-all hover:border-green-300"
                                            />
                                            <Button type="button" className='text-white' variant="default" onClick={addTag} >ADD</Button>
                                        </div>
                                        <div>
                                            {formData.tags.map(item => (
                                                <Badge className='cursor-pointer p-2' key={item} onClick={() => removeTag(item)}>{item}</Badge>
                                            ))}

                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-3">
                                    <label className=" text-xs text-gray-300 transition-all">
                                        Description
                                    </label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="bg-gray-900 text-white border border-yellow-500 focus:ring-2 focus:ring-yellow-400 rounded-lg px-4 py-3 transition-all hover:border-yellow-300"
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Section */}
                            <div className="flex flex-col gap-3">
                                <label className=" text-xs text-gray-300 transition-all">
                                    Source Code
                                </label>
                                <Textarea
                                    name="sourceCode"
                                    value={formData.sourceCode}
                                    onChange={handleChange}
                                    className="bg-gray-900 text-white font-mono border border-pink-500 focus:ring-2 focus:ring-pink-400 rounded-lg px-4 py-3 transition-all hover:border-pink-300 h-full resize-y"
                                    rows={10}
                                    required
                                />
                            </div>
                        </div>

                    </CardContent>
                </ScrollArea>
            </Card>
        </CenterEditModal >
    );
};

export default EditSnippet;
