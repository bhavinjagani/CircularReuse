import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };
  
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Middle pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 2 && currentPage > 3) {
        pages.push("ellipsis-start");
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      } else {
        pages.push(i);
      }
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Remove duplicates
    return Array.from(new Set(pages));
  };
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-neutral-gray text-neutral-dark hover:text-primary"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-neutral-dark">
                ...
              </span>
            );
          }
          
          const pageNum = page as number;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              onClick={() => onPageChange(pageNum)}
              className={
                currentPage === pageNum 
                  ? "px-3 py-1 rounded-md bg-primary text-white font-medium h-auto min-w-[30px]" 
                  : "px-3 py-1 rounded-md bg-white border border-neutral-gray text-neutral-dark hover:text-primary h-auto min-w-[30px]"
              }
            >
              {pageNum}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-neutral-gray text-neutral-dark hover:text-primary"
        >
          <span className="sr-only">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
