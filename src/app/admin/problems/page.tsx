"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import SectionWrapper from "@/hoc/sectionWrapper";
import { difficultyColors, showToast } from "@/lib";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { removeProblem } from "@/redux/slice/problemSlice";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProblemsPage() {
    const { problems } = useAppSelector(state => state.problems);
    const dispatch = useAppDispatch();
    const handleDelete = (id: string) => {
        if (!id) {
            console.log("there is no such problem :>");
            return;
        }
        dispatch(removeProblem(id));
        showToast("Problem Deleted Successfully", "success");
    }

    return (
        <SectionWrapper>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Coding Problems</h1>
                    <Link href="/admin/problems/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add New Problem
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Topics</TableHead>
                                <TableHead>Test Cases</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {problems.map((problem) => (
                                <TableRow key={problem.id}>
                                    <TableCell className="font-medium">{problem.title}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={difficultyColors[problem.difficulty]}
                                        >
                                            {problem.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {problem.topic.map((topic) => (
                                                <Badge key={topic} variant="outline">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>{problem.testCases.length} cases</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/problems/edit/${problem.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button onClick={() => { handleDelete(problem.id) }} variant="destructive" size="sm">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </SectionWrapper>
    );
}