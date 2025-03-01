"use client";

import { Input } from "@/components/ui/input";
import SectionWrapper from "@/hoc/sectionWrapper";
import { problems } from "@/lib/codingProblemData";
import { CodingProblemType } from "@/lib/types";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProblemsPage() {

    const [filteredProblems, setFilteredProblems] = useState<CodingProblemType[]>(problems);
    const [searchValue, setSearchValue] = useState<string>("");
    const router = useRouter();
    useEffect(() => {
        const intervalId = setInterval(() => {
            setFilteredProblems(
                problems.filter((problem) =>
                    problem.title.toLowerCase().includes(searchValue) ||
                    problem.description.toLowerCase().includes(searchValue)
                )
            );
        }, 1000);

        return () => clearInterval(intervalId);
    }, [searchValue]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchValue(query);

    };

    if (!problems) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    return (
        <SectionWrapper>
            <main className="min-h-screen py-12">
                <div className="container px-4 mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex flex-col gap-3 max-w-md">
                            <h1 className="text-3xl font-bold">Explore Coding Problems</h1>
                            <p className="text-gray-600">
                                Discover and search for coding problems in different languages.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white rounded-md relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search problems..."
                                value={searchValue}
                                onChange={handleChange}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Problem Table */}
                    <div className="overflow-x-auto rounded-lg shadow-lg">
                        <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-gradient-to-r from-red-500 to-indigo-600 text-white text-left">
                                    <th className="px-6 py-3 text-sm font-semibold tracking-wide">S No.</th>
                                    <th className="px-6 py-3 text-sm font-semibold tracking-wide">Name</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {filteredProblems.length > 0 ? (
                                    filteredProblems.map((problem, index) => (
                                        <tr
                                            key={problem.id}
                                            className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                            onClick={() => router.push(`/problem/${problem.id}`)}
                                        >
                                            <td className="px-6 py-4 text-gray-700 text-sm">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium  hover:underline">
                                                {problem.title}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className="text-center text-gray-500 py-6 text-sm">
                                            No problems found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </SectionWrapper>
    );
}
