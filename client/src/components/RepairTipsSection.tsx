import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import RepairTipCard from "@/components/RepairTipCard";
import { Skeleton } from "@/components/ui/skeleton";

const RepairTipsSection = () => {
  const { data: tips, isLoading, error } = useQuery({
    queryKey: ['/api/repair-tips'],
  });
  
  // Take only the first 3 tips for display
  const displayTips = tips ? tips.slice(0, 3) : [];
  
  // Loading state
  if (isLoading) {
    return (
      <section className="bg-neutral-gray bg-opacity-30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-3" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="p-2 bg-neutral-gray bg-opacity-50">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Skeleton className="h-10 w-48 mx-auto" />
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (error) {
    return (
      <section className="bg-neutral-gray bg-opacity-30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-header text-2xl font-bold text-primary-dark">DIY Repair Tips</h2>
            <p className="text-red-500 mt-2">Failed to load repair guides. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }
  
  // If no tips are available yet
  if (!displayTips.length) {
    return (
      <section className="bg-neutral-gray bg-opacity-30 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-header text-2xl font-bold text-primary-dark">DIY Repair Tips</h2>
            <p className="text-secondary max-w-xl mx-auto">
              Learn how to extend the life of your items with our community-contributed repair guides
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md mx-auto">
            <p className="mb-4">No repair guides available yet.</p>
            <Button className="bg-primary hover:bg-primary-dark">
              <Link href="/repair-guides/create">Create the First Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="bg-neutral-gray bg-opacity-30 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-header text-2xl font-bold text-primary-dark">DIY Repair Tips</h2>
          <p className="text-secondary max-w-xl mx-auto">
            Learn how to extend the life of your items with our community-contributed repair guides
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTips.map(tip => (
            <RepairTipCard key={tip.id} tip={tip} />
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/repair-guides">
            <Button className="bg-primary hover:bg-primary-dark">
              Browse All Repair Guides
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RepairTipsSection;
