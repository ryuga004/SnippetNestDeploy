import { Snippet } from "@/lib/types";
import { useState } from "react";

interface FilterOptions {
  searchQuery: string;
  tag: string;
  sortBy: string;
  language: string;
  author: string;
}

export default function useSnippetFilters(snippets: Snippet[]) {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    tag: "",
    sortBy: "",
    language: "",
    author: "",
  });

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      tag: "",
      sortBy: "",
      language: "",
      author: "",
    });
  };
  const handleChange = (key: keyof FilterOptions, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredSnippets = snippets
    .filter((snippet) => {
      const queryRegex = new RegExp(filters.searchQuery, "i");
      const languageRegex = new RegExp(
        `^${filters.language.replace(/\+/g, "\\+")}$`,
        "i"
      );

      return (
        (filters.searchQuery === "" ||
          queryRegex.test(snippet.title) ||
          queryRegex.test(snippet.description)) &&
        (filters.language === "" || languageRegex.test(snippet.language)) &&
        (filters.tag === "" || snippet.tags.includes(filters.tag)) &&
        (filters.author === "" || snippet.author.username === filters.author)
      );
    })
    .sort((a, b) => {
      if (filters.sortBy === "newest") {
        return b.id.localeCompare(a.id);
      } else if (filters.sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      }
      return 0;
    });

  return { filters, handleChange, resetFilters, filteredSnippets };
}

// INGINITE SCROLL
// import { Snippet } from "@/lib/types";
// import { useState, useEffect, useRef, useCallback } from "react";

// interface FilterOptions {
//     searchQuery: string;
//     tag: string;
//     sortBy: string;
//     language: string;
//     author: string;
// }

// export default function useSnippetFilters(snippets: Snippet[], pageSize = 6) {
//     const [filters, setFilters] = useState<FilterOptions>({
//         searchQuery: "",
//         tag: "",
//         sortBy: "",
//         language: "",
//         author: "",
//     });

//     const [page, setPage] = useState(1);
//     const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
//     const [hasMore, setHasMore] = useState(true);
//     const handleChange = (key: keyof FilterOptions, value: string) => {
//         setFilters((prevFilters) => ({
//             ...prevFilters,
//             [key]: value,
//         }));
//     };
//     useEffect(() => {
//         // Reset pagination when filters change
//         setPage(1);
//         setFilteredSnippets([]);
//         setHasMore(true);
//     }, [filters]);

//     useEffect(() => {
//         const loadSnippets = () => {
//             const newFiltered = snippets
//                 .filter((snippet) => {
//                     return (
//                         (filters.searchQuery === "" ||
//                             snippet.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
//                             snippet.description.toLowerCase().includes(filters.searchQuery.toLowerCase())) &&
//                         (filters.language === "" || snippet.language === filters.language) &&
//                         (filters.tag === "" || snippet.tags.includes(filters.tag)) &&
//                         (filters.author === "" || snippet.author.username === filters.author)
//                     );
//                 })
//                 .sort((a, b) => {
//                     if (filters.sortBy === "newest") {
//                         return b.id.localeCompare(a.id);
//                     } else if (filters.sortBy === "oldest") {
//                         return a.id.localeCompare(b.id);
//                     }
//                     return 0;
//                 });

//             const newSnippets = newFiltered.slice(0, page * pageSize);
//             setFilteredSnippets(newSnippets);

//             if (newSnippets.length >= newFiltered.length) {
//                 setHasMore(false); // No more items to load
//             }
//         };

//         loadSnippets();
//     }, [snippets, filters, page]);

//     const loadMore = () => {
//         if (hasMore) {
//             setPage((prev) => prev + 1);
//         }
//     };

//     const resetFilters = () => {
//         setFilters({
//             searchQuery: "",
//             tag: "",
//             sortBy: "",
//             language: "",
//             author: "",
//         });
//     };

//     return { filters, handleChange, resetFilters, filteredSnippets, hasMore, loadMore };
// }
