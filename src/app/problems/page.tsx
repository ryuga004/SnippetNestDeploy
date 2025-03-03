"use client";
import { ProblemsTable } from "@/components/Tables/problemTable";
import SectionWrapper from "@/hoc/sectionWrapper";
import { problems } from "@/lib/codingProblemData";

export default function ProblemsPage() {


    if (!problems) {
        return <div className="text-center text-lg font-semibold">Loading...</div>;
    }

    return (
        <SectionWrapper>
            <main className="min-h-screen py-12">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex flex-col gap-3 max-w-md">
                            <h1 className="text-3xl font-bold">Explore Coding Problems</h1>
                            <p className="text-gray-600">
                                Discover and search for coding problems in different languages.
                            </p>
                        </div>


                    </div>

                    <ProblemsTable problems={problems} />

                </div>
            </main>
        </SectionWrapper>
    );
}
