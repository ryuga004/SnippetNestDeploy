"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { mockUser } from "@/lib/data";
import { Snippet } from "@/lib/types";
import { useAppDispatch } from "@/redux/redux-hooks";
import { addSnippet } from "@/redux/slice/snippetSlice";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";


const languages = ["JavaScript", "TypeScript", "Python", "C++", "Java"];

export default function CreateSnippetForm({ handleClose }: { handleClose: () => void }) {

    const currentUser = mockUser;
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
    } = useForm<Snippet>({
        defaultValues: {
            id: crypto.randomUUID(),
            language: languages[0],
            tags: [],
            author: {
                author_id: currentUser.id,
                username: currentUser.username,
                avatar: currentUser.avatar
            }
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
    const onSubmit = (data: Snippet) => {
        // console.log("Snippet Data:", data);
        dispatch(addSnippet(data));
        handleClose();
    };

    return (
        <Card className="w-full mx-auto  p-6 shadow-lg">
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input placeholder="Title" {...register("title", { required: true })} />

                    <Textarea placeholder="Description" {...register("description", { required: true })} />

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

                    {/* Source Code Editor */}
                    <Textarea placeholder="Write your code here..." {...register("source_code", { required: true })} className="font-mono" />

                    <Button type="submit" className="w-full">
                        Submit Snippet
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
