"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib";
import { CREATE_SNIPPET } from "@/lib/services";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { addSnippet } from "@/redux/slice/snippetSlice";
import { useMutation } from "@apollo/client";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";


const languages = ["JavaScript", "TypeScript", "Python", "C++", "Java"];

interface FormDataType {
    title: string,
    description?: string,
    language: string,
    sourceCode: string,
    tags: string[],
}

export default function CreateSnippetForm({ handleClose }: { handleClose: () => void }) {

    const { user } = useAppSelector(state => state.user);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
    } = useForm<FormDataType>({
        defaultValues: {
            language: languages[0],
            tags: [],
            sourceCode: "",
            title: "",
            description: "",
        },
    });

    const [tagInput, setTagInput] = useState("");

    // Sync tags state with useForm
    const tags = watch("tags", []);

    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            const updatedTags = [...tags, tagInput];
            setValue("tags", updatedTags);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        const updatedTags = tags.filter((t) => t !== tag);
        setValue("tags", updatedTags);
    };
    const dispatch = useAppDispatch();

    const [createSnippet] = useMutation(CREATE_SNIPPET);

    const onSubmit = async (values: FormDataType) => {
        try {
            const res = await createSnippet({
                variables: {
                    input: values
                }
            })
            if (res.data.createSnippet.success) {
                const { description, ...rest } = values;
                dispatch(addSnippet({
                    id: res?.data?.createSnippet?.snippet?.id || crypto.randomUUID(),
                    ...rest,
                    description: description || "",
                    author: {
                        id: user.id,
                        username: user.username,
                        avatar: user.avatar
                    }
                }));
                showToast(res.data.createSnippet.message, "success");
                handleClose();
            } else {
                console.log("Cannot create a snippet ...");
            }
        } catch (error) {
            console.error(error);
        } finally {
        }
    };

    return (
        <Card className="w-[70vw] h-[75vh] py-3  shadow-lg">
            <CardContent className="h-full ">
                <h1 className="pb-1">Create Snippet</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full grid grid-cols-5 gap-3">
                    <main className="flex flex-col gap-3 col-span-2">
                        <Input placeholder="Title" {...register("title", { required: true })} />

                        <Textarea className="flex-1" placeholder="Description" {...register("description", { required: true })} />

                        {/* Language Selection */}
                        <Controller
                            control={control}
                            name="language"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((lang) => (
                                            <SelectItem key={lang} value={lang}>
                                                {lang}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {/* Tags Input */}
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Enter tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} className="flex items-center gap-2">
                                    {tag} <X size={14} onClick={() => removeTag(tag)} className="cursor-pointer" />
                                </Badge>
                            ))}
                        </div>

                        <Button type="submit" className="w-full bg-red-500 text-white">
                            Create Snippet
                        </Button>
                    </main>
                    <aside className="col-span-3 h-full">
                        {/* Source Code Editor */}
                        <Textarea placeholder="Write your code here..." {...register("sourceCode", { required: true })} className="font-mono h-full" />

                    </aside>
                </form>
            </CardContent>
        </Card>
    );
}
