"use client";

import { openEditModalProps } from "@/app/snippets/page";
import { Snippet } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { removeSnippet } from "@/redux/slice/snippetSlice";
import { motion } from "framer-motion";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface SnippetCardProps {
    snippet: Snippet;
    setOpenEditModal: Dispatch<SetStateAction<openEditModalProps>>;
}

export default function SnippetCard({ snippet, setOpenEditModal }: SnippetCardProps) {
    const { isLoggedIn, user } = useAppSelector(state => state.user);
    const [owner, setOwner] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (isLoggedIn && user) {
            setOwner((snippet.author.id === user.id));
        }
    }, [isLoggedIn, user])
    const handleDeleteSnippet = () => {
        dispatch(removeSnippet(snippet.id));
        toast.success(`Snippet "${snippet.title}" deleted`, {
            id: `delete-${snippet.id}`,
            closeButton: true,
        });
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
        >

            <Card className="overflow-hidden group border border-gray-700 shadow-md bg-gray-800 max-w-xl">
                <CardHeader className="p-4 flex flex-col">
                    <div className="flex justify-between">
                        <h3 className="font-semibold text-xl text-white">{snippet.title}</h3>
                        {owner &&

                            <Popover>
                                <PopoverTrigger className="focus:outline-none">
                                    <EllipsisVertical className="text-white w-5 h-5 cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent className="w-25 absolute right-0 bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md p-2">
                                    <button onClick={() => setOpenEditModal({
                                        open: true,
                                        snippet: snippet,
                                    })} className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md">Edit</button>
                                    <button onClick={handleDeleteSnippet} className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md">Delete</button>
                                </PopoverContent>
                            </Popover>

                        }
                    </div>
                    <p className="text-md text-gray-200">{snippet.description}</p>
                </CardHeader>

                <CardContent className="p-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 h-[40px]">
                        {snippet.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-sm">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                </CardContent>

                <CardFooter className=" p-4 flex bg-black justify-between items-center">
                    {/* Author */}
                    <div className="flex items-center gap-3 bg-black">
                        <Image
                            src={snippet.author.avatar}
                            alt={snippet.author.username}
                            height={25}
                            width={25}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-200">
                            by {snippet.author.username}
                        </span>
                    </div>


                    {/* View Snippet */}
                    <Link href={`/snippet/${snippet.id}`}>
                        <Button variant="outline" >
                            View Snippet
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div >
    );
}
