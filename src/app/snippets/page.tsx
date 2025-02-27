"use client";

import SnippetCard from "@/components/template_card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import SectionWrapper from "@/hoc/sectionWrapper";
import useSnippetFilters from "@/hooks/useSnippetFilter";
import { Snippet } from "@/lib/types";
import { useAppSelector } from "@/redux/redux-hooks";
import { Search, SlidersHorizontal, RefreshCcw } from "lucide-react";

export default function SnippetsPage() {
    const languages = ["JavaScript", "TypeScript", "Python", "C++", "Java"];

    // Retrieve snippets from Redux store
    const snippetsData = useAppSelector((state) => state.snippets);
    const { filters, handleChange, resetFilters, filteredSnippets } = useSnippetFilters(snippetsData?.snippets || []);

    // Show loading if snippets are still being fetched
    if (snippetsData?.loading) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    // Initialize filters

    return (
        <SectionWrapper>
            <main className="min-h-screen py-12">
                <div className="container px-4 mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex flex-col gap-3 max-w-md">
                            <h1 className="text-3xl font-bold">Explore Snippets</h1>
                            <p className="text-gray-600">
                                Discover and search for code snippets across different languages.
                            </p>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="bg-white rounded-md relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search snippets..."
                                    value={filters?.searchQuery || ""}
                                    onChange={(e) => handleChange("searchQuery", e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Mobile Filters (Sheet) */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="md:hidden">
                                        <SlidersHorizontal className="w-4 h-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="flex flex-col gap-4 mt-4">
                                        {/* Language Filter */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Language
                                            </label>
                                            <Select
                                                value={filters?.language || ""}
                                                onValueChange={(lang) => handleChange("language", lang)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((lang) => (
                                                        <SelectItem key={lang} value={lang}>
                                                            {lang}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Sort By Filter */}
                                        <div>
                                            <label className="text-sm font-medium mb-2 block">
                                                Sort by
                                            </label>
                                            <Select
                                                value={filters?.sortBy || ""}
                                                onValueChange={(val) => handleChange("sortBy", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sort by" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="newest">Newest</SelectItem>
                                                    <SelectItem value="oldest">Oldest</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Reset Filters Button */}
                                        <Button
                                            variant="destructive"
                                            onClick={resetFilters}
                                            className="mt-2"
                                        >
                                            <RefreshCcw className="w-4 h-4 mr-2" />
                                            Reset Filters
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {/* Filters (ALWAYS VISIBLE on Larger Screens) */}
                    <div className="hidden md:flex items-center gap-4 mb-8">
                        {/* Language Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Language
                            </label>
                            <Select
                                value={filters?.language || ""}
                                onValueChange={(lang) => handleChange("language", lang)}
                            >
                                <SelectTrigger className="w-40 bg-white">
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
                        </div>

                        {/* Sort By Filter */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Sort by
                            </label>
                            <Select
                                value={filters?.sortBy || ""}
                                onValueChange={(val) => handleChange("sortBy", val)}
                            >
                                <SelectTrigger className="w-40 bg-white">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest</SelectItem>
                                    <SelectItem value="oldest">Oldest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reset Filters Button (Desktop) */}
                        <div>
                            <Button
                                variant="destructive"
                                onClick={resetFilters}
                                className="mt-8 "
                            >
                                <RefreshCcw className="w-4 h-4 mr-2" />
                                Reset Filters
                            </Button>
                        </div>
                    </div>

                    {/* Snippets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white p-6 rounded-lg">
                        {filteredSnippets.length > 0 ? (
                            filteredSnippets.map((snippet: Snippet) => (
                                <SnippetCard key={snippet.id} snippet={snippet} />
                            ))
                        ) : (
                            <p className="text-center col-span-full text-gray-500">
                                No snippets found.
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </SectionWrapper>
    );
}
