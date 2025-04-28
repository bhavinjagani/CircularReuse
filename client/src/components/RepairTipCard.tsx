import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Eye } from "lucide-react";
import { getUserInitials, getRepairDifficultyDisplay } from "@/lib/utils";
import { RepairTip } from "@shared/schema";

interface RepairTipCardProps {
  tip: RepairTip;
}

const RepairTipCard = ({ tip }: RepairTipCardProps) => {
  // In a real app, these would be fetched
  const author = `User ${tip.userId}`;
  const isRepairHero = tip.userId % 2 === 0; // Just for demo
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition duration-200">
      <div className="relative">
        <Link href={`/repair-guides/${tip.id}`}>
          <img 
            src={tip.imageUrl} 
            alt={tip.title} 
            className="w-full h-48 object-cover cursor-pointer"
          />
        </Link>
        <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
          {tip.category}
        </div>
      </div>
      
      <CardContent className="p-4">
        <Link href={`/repair-guides/${tip.id}`}>
          <h3 className="font-header font-semibold text-lg mb-2 cursor-pointer hover:text-primary">
            {tip.title}
          </h3>
        </Link>
        
        <p className="text-sm text-neutral-dark mb-3 line-clamp-2">
          {tip.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-secondary">
            <Avatar className="h-4 w-4 mr-1">
              <AvatarFallback className="text-[10px]">{getUserInitials(author)}</AvatarFallback>
            </Avatar>
            <span>By {author}</span>
            {isRepairHero && (
              <div className="ml-1 badge-repair-hero">
                <Star className="h-3 w-3 mr-1" />
                <span>Repair Hero</span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-accent flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{tip.views} views</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-neutral-gray bg-opacity-50 px-4 py-2 flex justify-between">
        <div className="flex items-center text-xs">
          <span className="font-medium">Difficulty:</span>
          <div className="ml-2 flex space-x-[2px]">
            {(() => {
              const { filled, empty } = getRepairDifficultyDisplay(tip.difficulty || 0);
              return (
                <>
                  {[...Array(filled)].map((_, i) => (
                    <span key={`filled-${i}`} className="text-primary">●</span>
                  ))}
                  {[...Array(empty)].map((_, i) => (
                    <span key={`empty-${i}`} className="text-neutral-gray">●</span>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
        
        <Link href={`/repair-guides/${tip.id}`}>
          <button className="text-primary hover:text-primary-dark font-medium text-sm">
            View Guide
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RepairTipCard;
