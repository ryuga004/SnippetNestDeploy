"use client";
import { openEditModalProps } from "@/app/snippets/page";
import MovementWrapper from "@/hoc/Animation/movementWrapper";
import { Snippet } from "@/lib/types";
import { useAppSelector } from "@/redux/redux-hooks";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import GridLoader from "./Loaders/gridLoader";
import SnippetCard from "./template_card";
import { Button } from "./ui/button";

export const customLogic: number[] = [0, 1, 3, 2];
const FeaturedSnippets = () => {
  const [openEditModal, setOpenEditModal] = useState<openEditModalProps>({
    open: false,
  });

  const { snippets, loading } = useAppSelector((state) => state.snippets);
  const [featured_snippet, setFeaturedSnippets] = useState<Array<Snippet>>([]);

  useEffect(() => {
    setFeaturedSnippets(snippets.slice(0, 4));
  }, [snippets, loading]);

  const [startIndex, setStartIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (featured_snippet.length === 0) setStartIndex(0);
      else setStartIndex((prev) => (prev + 1) % featured_snippet.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featured_snippet.length]);

  if (loading) {
    console.log(openEditModal);
    console.log(hoveredIndex);
    return (
      <div>
        <GridLoader />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-[12px] h-full">
        <header className="flex min-w-full justify-between">
          <main className="flex flex-col gap-[12px]">
            <h2 className="text-3xl font-bold">Featured Snippets</h2>
            <p>Some of the best snippets.</p>
          </main>
          <aside>
            <Link href="/snippets">
              <Button variant="ghost">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </aside>
        </header>
        <MovementWrapper direction="up" triggerOnScroll={true}>
          <div className="flex gap-4 h-full w-full justify-between">
            <main className="col-span-2 items-center justify-start">
              <div className="grid grid-cols-2 ">
                {featured_snippet?.map((snippet: Snippet, index) => (
                  <SnippetCard
                    setOpenEditModal={setOpenEditModal}
                    key={snippet.id}
                    snippet={snippet}
                    hoveredIndex={customLogic[startIndex]}
                    setHoveredIndex={setHoveredIndex}
                    index={index}
                  />
                ))}
              </div>
            </main>
            <aside className="col-span-2 hidden lg:block h-[500px] w-[700px]">
              <Image
                // src="/images/featured_snippet.png"
                src="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Featured Snippet"
                width={400}
                height={400}
                className="hidden lg:block w-full h-full   object-cover rounded-lg"
              />
            </aside>
          </div>
        </MovementWrapper>
      </div>
    </>
  );
};

export default FeaturedSnippets;
