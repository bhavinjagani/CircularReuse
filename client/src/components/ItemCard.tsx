import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Star, 
  MapPin,
  User,
  Leaf
} from "lucide-react";
import { formatPrice, formatCO2, formatDistance, getConditionBadgeClass, getUserInitials } from "@/lib/utils";
import { Item } from "@shared/schema";

interface ItemCardProps {
  item: Item;
  onMessage?: (itemId: number) => void;
}

const ItemCard = ({ item, onMessage }: ItemCardProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  
  const handleMessage = () => {
    if (onMessage) {
      onMessage(item.id);
    } else {
      setLocation(`/item/${item.id}`);
    }
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Item removed from favorites" : "Item saved to favorites",
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: `/item/${item.id}`,
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.origin + `/item/${item.id}`);
    toast({
      title: "Link copied to clipboard",
      duration: 2000,
    });
  };
  
  // Dummy data for now - in a real app we'd fetch this
  const sellerName = "User " + item.userId;
  const isRepairHero = item.userId % 2 === 0; // Just for demo
  
  const conditionClass = getConditionBadgeClass(item.condition);
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition duration-200">
      <div className="relative">
        <Link href={`/item/${item.id}`}>
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-48 object-cover cursor-pointer"
          />
        </Link>
        <div className={`absolute top-2 right-2 ${conditionClass}`}>
          {item.condition}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{formatDistance(item.distance)}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <Link href={`/item/${item.id}`}>
            <h3 className="font-header font-semibold text-lg mb-1 cursor-pointer hover:text-primary">
              {item.title}
            </h3>
          </Link>
          <span className="font-bold text-primary">{formatPrice(item.price)}</span>
        </div>
        
        <p className="text-sm text-neutral-dark mb-3 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-secondary">
            <User className="h-3 w-3 mr-1" />
            <span>Listed by {sellerName}</span>
            {isRepairHero && (
              <div className="ml-1 badge-repair-hero">
                <Star className="h-3 w-3 mr-1" />
                <span>Repair Hero</span>
              </div>
            )}
          </div>
          
          <div className="text-xs flex items-center text-success">
            <Leaf className="h-3 w-3 mr-1" />
            <span>{formatCO2(item.co2Saved)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-neutral-gray bg-opacity-50 px-4 py-2 flex justify-between">
        <button 
          onClick={handleMessage}
          className="text-primary hover:text-primary-dark font-medium text-sm flex items-center"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </button>
        
        <button 
          onClick={handleSave}
          className="text-secondary hover:text-secondary-dark font-medium text-sm flex items-center"
        >
          <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-secondary' : ''}`} />
          {isSaved ? 'Saved' : 'Save'}
        </button>
        
        <button 
          onClick={handleShare}
          className="text-accent hover:text-accent-dark font-medium text-sm flex items-center"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
