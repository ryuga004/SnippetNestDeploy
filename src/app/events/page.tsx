"use client";
import ContestCard from "@/components/cards/contestCard";
import GridLoader from "@/components/Loaders/gridLoader";
import SectionWrapper from "@/hoc/sectionWrapper";
import { ContestType } from "@/lib/types";
import { getContests } from "@/server/scrapper";
import { useEffect, useState } from "react";

const Event = () => {
  const [recentContest, setRecentContest] = useState<ContestType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchContests = async () => {
      const contests = await getContests();
      setRecentContest(contests || []);
      setLoading(false);
    };
    fetchContests();
  }, []);
  if (loading) {
    return (
      <SectionWrapper>
        <GridLoader />
      </SectionWrapper>
    );
  }
  return (
    <SectionWrapper>
      <div className="grid grid-cols-3 gap-3">
        {recentContest?.map((c: ContestType) => (
          <ContestCard key={c.id} contest={c} />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Event;
