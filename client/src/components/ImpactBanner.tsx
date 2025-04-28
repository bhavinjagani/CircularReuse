import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ImpactBannerProps {
  co2Saved?: number;
  activeListings?: number;
  repairHeroes?: number;
}

const ImpactBanner = ({ co2Saved, activeListings, repairHeroes }: ImpactBannerProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/stats'],
    enabled: !co2Saved && !activeListings && !repairHeroes,
  });
  
  const stats = {
    co2Saved: co2Saved || data?.co2Saved || 0,
    activeListings: activeListings || data?.activeListings || 0,
    repairHeroes: repairHeroes || data?.repairHeroes || 0,
  };
  
  const formatCO2 = (kg: number) => {
    return kg < 1 ? `${Math.round(kg * 1000)} g` : `${kg} kg`;
  };
  
  return (
    <section className="bg-gradient-to-r from-primary to-primary-light rounded-lg shadow-md p-4 mb-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="font-header text-xl font-bold">Community Impact</h2>
          <p className="opacity-90">Together we're making a difference!</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[120px]">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-20 bg-white/30 mb-1 mx-auto" />
                <Skeleton className="h-4 w-16 bg-white/30 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCO2(stats.co2Saved)}</div>
                <div className="text-sm">CO₂ Saved</div>
              </>
            )}
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[120px]">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-20 bg-white/30 mb-1 mx-auto" />
                <Skeleton className="h-4 w-16 bg-white/30 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activeListings}</div>
                <div className="text-sm">Active Listings</div>
              </>
            )}
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center min-w-[120px]">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-20 bg-white/30 mb-1 mx-auto" />
                <Skeleton className="h-4 w-16 bg-white/30 mx-auto" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.repairHeroes}</div>
                <div className="text-sm">Repair Heroes</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactBanner;
