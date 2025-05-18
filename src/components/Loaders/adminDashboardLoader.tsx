"use client";

const SkeletonBox = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const AdminDashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <SkeletonBox className="w-24 h-4 mb-2" />
            <SkeletonBox className="w-16 h-6 mb-3" />
            <SkeletonBox className="w-20 h-4" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i: number) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            <SkeletonBox className="w-32 h-4 mb-4" />
            <SkeletonBox className="w-full h-[250px]" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardSkeleton;
