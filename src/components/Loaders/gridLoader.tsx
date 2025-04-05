import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const GridLoader: React.FC = ({
  row = 2,
  col = 3,
}: {
  row?: number;
  col?: number;
}) => {
  return (
    <div
      className={` h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${col} gap-4 p-4`}
    >
      {Array.from({ length: row * col }, (_, index) => (
        <Skeleton key={index} className="h-[40vh] w-full rounded-md" />
      ))}
    </div>
  );
};

export default GridLoader;
