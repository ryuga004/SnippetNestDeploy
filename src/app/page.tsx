"use client";
import AISection from "@/components/ai_Section";
import FeaturedSnippets from "@/components/featuredSnippet";
import Hero from "@/components/Hero";
import CodingOverview from "@/components/sections/codingOverview";
import SectionWrapper from "@/hoc/sectionWrapper";
import { Star } from "lucide-react";

const Home = () => {
  return (
    <div>
      <Hero />
      <SectionWrapper>
        <FeaturedSnippets />
      </SectionWrapper>

      <SectionWrapper>
        <AISection />
      </SectionWrapper>
      <SectionWrapper>
        <CodingOverview />
      </SectionWrapper>
      {/* Testimonials Section */}
      <SectionWrapper>
        <div className="container px-4 mx-auto mb-30">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-lg border bg-card text-card-foreground"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  The snippets are not only helpful but also incredibly easy to
                  integrate. Saved me hours of coding!
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10" />
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">
                      Web Developer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Home;
