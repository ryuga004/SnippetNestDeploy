"use client";

import EditSnippet from "@/components/Forms/editSnippet";
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
import { RefreshCcw, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export interface openEditModalProps {
  open: boolean;
  snippet?: Snippet;
}

export default function SnippetsPage() {
  const languages = ["JavaScript", "TypeScript", "Python", "C++", "Java"];
  const [openEditModal, setOpenEditModal] = useState<openEditModalProps>({
    open: false,
  });

  const snippetsData = useAppSelector((state) => state.snippets);
  const {
    filters,
    handleChange,
    resetFilters,
    filteredSnippets,
  } = useSnippetFilters(snippetsData?.snippets || []);

  if (snippetsData?.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SectionWrapper>
      <main className="min-h-screen py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col gap-3 max-w-md">
              <h1 className="text-3xl font-bold">Explore Snippets</h1>
              <p className="text-gray-600">
                Discover and search for code snippets across different
                languages.
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-white rounded-md relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search snippets..."
                  value={filters?.searchQuery || ""}
                  onChange={(e) => handleChange("searchQuery", e.target.value)}
                  className="pl-9"
                />
              </div>

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

          <div className="hidden md:flex items-center gap-4 mb-8">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
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

            <div>
              <label className="text-sm font-medium mb-2 block">Sort by</label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 bg-white p-6 rounded-lg">
            {!filteredSnippets ? (
              <>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : filteredSnippets.length > 0 ? (
              filteredSnippets.map((snippet: Snippet) => (
                <SnippetCard
                  key={snippet.id}
                  setOpenEditModal={setOpenEditModal}
                  snippet={snippet}
                />
              ))
            ) : (
              <>
                <p className="text-center col-span-full text-gray-500">
                  No snippets found.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      {openEditModal.open && (
        <EditSnippet
          snippet={openEditModal.snippet!}
          handleClose={() =>
            setOpenEditModal({
              open: false,
              snippet: undefined,
            })
          }
        />
      )}
    </SectionWrapper>
  );
}
