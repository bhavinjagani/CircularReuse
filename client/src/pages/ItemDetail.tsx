import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import MessageBox from "@/components/MessageBox";
import { Item } from "@shared/schema";
import { 
  formatPrice, 
  formatCO2, 
  formatDistance, 
  getConditionBadgeClass, 
  getUserInitials 
} from "@/lib/utils";
import { 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Star, 
  MapPin, 
  Leaf, 
  Calendar, 
  Info, 
  Bolt, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ItemDetail = () => {
  const [, params] = useRoute("/item/:id");
  const [, navigate] = useLocation();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  
  const itemId = params?.id ? parseInt(params.id) : 0;
  
  const { data: item, isLoading, error } = useQuery({
    queryKey: [`/api/items/${itemId}`],
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="h-6 w-6 mr-2" />
              Error Loading Item
            </CardTitle>
            <CardDescription>
              We couldn't find this item or an error occurred while loading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>The item you're looking for might have been removed or doesn't exist.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  const handleMessage = () => {
    setShowMessageBox(true);
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Item removed from your saved items" : "Item saved to your collection",
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      }).catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      duration: 2000,
    });
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Dummy data for now - in a real app, these would be fetched
  const sellerName = `User ${item.userId}`;
  const isRepairHero = item.userId % 2 === 0; // Just for demo
  
  const conditionClass = getConditionBadgeClass(item.condition);
  
  // Generate repair tips based on category and condition
  const getRepairTips = () => {
    if (item.condition !== "Repairable") return null;
    
    const tips = {
      Electronics: "Check for loose connections and damaged capacitors. Test power circuits with a multimeter. Parts for this model can be found online at electronics repair sites.",
      Furniture: "Sand rough edges, tighten loose joints with wood glue, and apply a fresh coat of varnish. You may need to replace the supporting brackets underneath.",
      Clothing: "This fabric can be patched with similar material. The seams need reinforcement and buttons need replacement. Consider taking to a local tailor.",
      Kitchen: "The heating element is likely the issue. Descale with vinegar solution and check electrical connections. Replacement parts are affordable online.",
      Bolt: "Lubricate moving parts with a silicon-based lubricant. The handle needs re-wrapping and blades need sharpening. Simple maintenance will restore functionality.",
      Sports: "Replace the worn grips with new ones, check for air leaks, and tighten any loose components. Clean thoroughly before repair.",
      Toys: "Check the batteries and connections. Circuit boards may need cleaning with isopropyl alcohol. Missing parts can be 3D printed or replaced.",
      Books: "Reinforce the damaged binding with book glue. Gently clean the cover with appropriate cleaner. Missing pages can be found in other copies.",
      Automotive: "Check fluid levels, replace the air filter, and clean electrical connections. Lubricating moving parts could resolve sticking issues.",
      Other: "This item requires thorough cleaning first. Identify broken components and research specific repair techniques online. Join a repair cafe for assistance."
    };
    
    return tips[item.category as keyof typeof tips] || null;
  };
  
  const repairTips = getRepairTips();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div>
            <div className="relative">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full rounded-lg object-cover aspect-square"
              />
              <div className={`absolute top-4 right-4 ${conditionClass} px-3 py-1.5 text-sm font-medium`}>
                {item.condition}
              </div>
              <div className="absolute bottom-4 left-4 flex items-center bg-black bg-opacity-60 text-white text-xs px-3 py-1.5 rounded-full">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>{formatDistance(item.distance)}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 inline mr-1.5" />
                Listed on {formatDate(item.created)}
              </p>
            </div>
          </div>
          
          {/* Right Column - Details */}
          <div>
            <h1 className="text-2xl md:text-3xl font-header font-bold text-primary-dark mb-2">
              {item.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <p className="text-2xl font-bold text-primary mr-4">
                {formatPrice(item.price)}
              </p>
              <div className="flex items-center text-success text-sm">
                <Leaf className="h-4 w-4 mr-1.5" />
                <span>{formatCO2(item.co2Saved)} CO₂ saved</span>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback>{getUserInitials(sellerName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Listed by {sellerName}</p>
                {isRepairHero && (
                  <div className="badge-repair-hero text-xs mt-0.5">
                    <Star className="h-3 w-3 mr-1" />
                    <span>Repair Hero</span>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="description" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                {repairTips && (
                  <TabsTrigger value="repair">Repair Tips</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="description" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardContent className="pt-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{item.category}</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Condition:</span>
                        <span className="font-medium">{item.condition}</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{item.location}</span>
                      </li>
                      <Separator />
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{item.weight} g</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {repairTips && (
                <TabsContent value="repair" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Bolt className="h-4 w-4 mr-2 text-warning" />
                        Repair Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{repairTips}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                className="flex-1 min-w-[120px] bg-primary hover:bg-primary-dark"
                onClick={handleMessage}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Seller
              </Button>
              
              <Button 
                variant="outline"
                className="flex-1 min-w-[120px] border-secondary text-secondary hover:bg-secondary hover:text-white"
                onClick={handleSave}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-secondary" : ""}`} />
                {isSaved ? "Saved" : "Save Item"}
              </Button>
              
              <Button 
                variant="outline"
                className="flex-1 min-w-[120px] border-accent text-accent hover:bg-accent hover:text-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-neutral-gray/30 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-secondary mr-3 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Remember to meet in a public place for transactions. Inspect the item thoroughly before purchasing.
                  By buying second-hand, you're helping reduce waste and preserving valuable resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showMessageBox && (
        <MessageBox 
          itemId={item.id} 
          onClose={() => setShowMessageBox(false)}
        />
      )}
    </div>
  );
};

export default ItemDetail;
