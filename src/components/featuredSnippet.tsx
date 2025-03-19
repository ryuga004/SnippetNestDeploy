"use client";
import { Snippet } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import SnippetCard from "./template_card";
import { Button } from "./ui/button";
import Link from "next/link";
import MovementWrapper from "@/hoc/Animation/movementWrapper";
import { openEditModalProps } from "@/app/snippets/page";
import { useState } from "react";
import { useAppSelector } from "@/redux/redux-hooks";

const FeaturedSnippets = () => {
  const [openEditModal, setOpenEditModal] = useState<openEditModalProps>({
    open: false,
  });
  console.log(openEditModal);
  const { snippets, loading } = useAppSelector((state) => state.snippets);
  if (loading) {
    <div>Loading ....</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-[12px] h-[60vh]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.slice(0, 3)?.map((snippet: Snippet) => (
              <SnippetCard
                setOpenEditModal={setOpenEditModal}
                key={snippet.id}
                snippet={snippet}
              />
            ))}
          </div>
        </MovementWrapper>
      </div>
    </>
  );
};

export default FeaturedSnippets;
