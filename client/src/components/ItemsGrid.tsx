import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ItemCard from "@/components/ItemCard";
import Pagination from "@/components/Pagination";
import MessageBox from "@/components/MessageBox";
import { Item } from "@shared/schema";

interface ItemsGridProps {
  title?: string;
  items?: Item[];
  isLoading?: boolean;
  error?: unknown;
}

const ItemsGrid = ({ title = "Featured Listings", items, isLoading: externalLoading, error: externalError }: ItemsGridProps) => {
  const [location] = useLocation();
  const [match, params] = useRoute("/:path");
  const [sortBy, setSortBy] = useState("newest");
  const [messageItem, setMessageItem] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Only fetch items if not provided as props
  const { data, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['/api/items', location],
    enabled: !items,
  });
  
  const isLoading = externalLoading || queryLoading;
  const error = externalError || queryError;
  const displayItems = items || data || [];
  
  // Sort items based on selected option
  const sortedItems = [...displayItems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "sustainable":
        return b.co2Saved - a.co2Saved;
      default:
        return 0;
    }
  });
  
  // Paginate items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleMessageOpen = (itemId: number) => {
    setMessageItem(itemId);
  };
  
  const handleMessageClose = () => {
    setMessageItem(null);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="md:w-3/4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="p-2 bg-neutral-gray bg-opacity-50">
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="md:w-3/4 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Items</h2>
        <p>There was a problem fetching the marketplace items. Please try again later.</p>
      </div>
    );
  }
  
  // If no items found
  if (sortedItems.length === 0) {
    return (
      <div className="md:w-3/4 bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">No Items Found</h2>
        <p className="mb-6">We couldn't find any items matching your criteria.</p>
        <div className="flex justify-center">
          <a href="/" className="btn-primary">View All Items</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="md:w-3/4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-header text-xl font-bold">{title}</h2>
        <div className="flex items-center">
          <span className="text-sm mr-2 hidden md:inline">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="sustainable">Most Sustainable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item}
            onMessage={handleMessageOpen}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {messageItem !== null && (
        <MessageBox 
          itemId={messageItem} 
          onClose={handleMessageClose} 
        />
      )}
    </div>
  );
};

export default ItemsGrid;
