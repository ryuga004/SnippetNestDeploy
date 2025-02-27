"use client";

import { Snippet } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface SnippetCardProps {
    snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
        >
            <Card className="overflow-hidden group border border-gray-700 shadow-md bg-gray-800 max-w-xl">
                <CardHeader className="p-4 flex flex-col">
                    <h3 className="font-semibold text-xl text-white">{snippet.title}</h3>
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
        </motion.div>
    );
}
