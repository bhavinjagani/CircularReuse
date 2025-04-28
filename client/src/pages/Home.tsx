import ImpactBanner from "@/components/ImpactBanner";
import FilterSidebar from "@/components/FilterSidebar";
import ItemsGrid from "@/components/ItemsGrid";
import LocalImpactMap from "@/components/LocalImpactMap";
import RepairTipsSection from "@/components/RepairTipsSection";
import CTASection from "@/components/CTASection";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

const Home = () => {
  const [location] = useLocation();
  
  // Parse query parameters
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.split('?')[1] || '');
    const params: Record<string, string | string[]> = {};
    
    // Handle multi-value params
    for (const [key, value] of searchParams.entries()) {
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    }
    
    return params;
  };
  
  const params = getQueryParams();

  // Count items by category and condition for the sidebar
  const { data: allItems } = useQuery({
    queryKey: ['/api/items'],
  });
  
  const getCounts = () => {
    if (!allItems) return { categories: {}, conditions: {} };
    
    const categoryCounts: Record<string, number> = {};
    const conditionCounts: Record<string, number> = {};
    
    allItems.forEach((item: any) => {
      // Count categories
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      
      // Count conditions
      conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1;
    });
    
    return { categories: categoryCounts, conditions: conditionCounts };
  };
  
  return (
    <main className="container mx-auto px-4 py-6">
      {/* Impact Banner */}
      <ImpactBanner />
      
      {/* Marketplace Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <FilterSidebar counts={getCounts()} />
        
        {/* Items Grid */}
        <ItemsGrid 
          title={params.search ? `Search Results for "${params.search}"` : "Featured Listings"}
        />
      </div>
      
      {/* Local Impact Map */}
      <LocalImpactMap />
      
      {/* Repair Tips Section */}
      <RepairTipsSection />
      
      {/* CTA Section */}
      <CTASection />
    </main>
  );
};

export default Home;
