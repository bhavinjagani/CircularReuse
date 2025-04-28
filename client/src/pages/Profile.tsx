import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Avatar, 
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import ItemCard from "@/components/ItemCard";
import { 
  User, 
  Star,
  Leaf,
  Package,
  Award,
  Settings,
  MessageSquare,
  Heart,
  Archive,
  ShoppingBag,
  ExternalLink,
  Loader2
} from "lucide-react";
import { getUserInitials } from "@/lib/utils";
import { Item } from "@shared/schema";

// Demo user ID for showcase
const DEMO_USER_ID = 1;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${DEMO_USER_ID}`],
  });
  
  // Fetch user's items
  const { data: userItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/items'],
    select: (items: Item[]) => items.filter(item => item.userId === DEMO_USER_ID)
  });
  
  if (userLoading || itemsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Use default values if data isn't available yet
  const user = userData || {
    id: DEMO_USER_ID,
    username: "demo_user",
    isRepairHero: true,
    co2Saved: 37500,
    itemsListed: 12
  };
  
  const items = userItems || [];
  
  // Calculate sustainability level based on CO2 saved
  const getSustainabilityLevel = (co2Saved: number) => {
    if (co2Saved >= 100000) return "Master";
    if (co2Saved >= 50000) return "Expert";
    if (co2Saved >= 10000) return "Advanced";
    if (co2Saved >= 1000) return "Intermediate";
    return "Beginner";
  };
  
  const sustainabilityLevel = getSustainabilityLevel(user.co2Saved);
  
  // Calculate progress to next level
  const getNextLevelProgress = (co2Saved: number) => {
    if (co2Saved >= 100000) return 100; // Max level
    if (co2Saved >= 50000) return Math.min(((co2Saved - 50000) / 50000) * 100, 99);
    if (co2Saved >= 10000) return Math.min(((co2Saved - 10000) / 40000) * 100, 99);
    if (co2Saved >= 1000) return Math.min(((co2Saved - 1000) / 9000) * 100, 99);
    return Math.min((co2Saved / 1000) * 100, 99);
  };
  
  const nextLevelProgress = getNextLevelProgress(user.co2Saved);
  
  // Calculate next level
  const getNextLevel = (level: string) => {
    if (level === "Master") return "Master"; // Already max level
    if (level === "Expert") return "Master";
    if (level === "Advanced") return "Expert";
    if (level === "Intermediate") return "Advanced";
    return "Intermediate";
  };
  
  const nextLevel = getNextLevel(sustainabilityLevel);
  
  // Format CO2 saved
  const formatCO2 = (grams: number) => {
    if (grams >= 1000000) {
      return `${(grams / 1000000).toFixed(1)} tons`;
    }
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} kg`;
    }
    return `${grams} g`;
  };
  
  // Demo achievements
  const achievements = [
    { name: "First Listing", description: "Listed your first item", completed: true },
    { name: "Eco Starter", description: "Saved 1kg of CO2", completed: true },
    { name: "Repair Hero", description: "Helped repair 5 items", completed: user.isRepairHero },
    { name: "Circular Champion", description: "Listed 10 items", completed: user.itemsListed >= 10 },
    { name: "CO2 Warrior", description: "Saved 50kg of CO2", completed: user.co2Saved >= 50000 },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div>
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl">
                      {getUserInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mb-1">{user.username}</h2>
                  
                  <div className="flex items-center mb-4">
                    {user.isRepairHero && (
                      <Badge variant="outline" className="bg-warning text-white font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Repair Hero
                      </Badge>
                    )}
                  </div>
                  
                  <div className="w-full space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Sustainability Level</span>
                        <span className="text-sm text-muted-foreground">{sustainabilityLevel}</span>
                      </div>
                      <Progress value={nextLevelProgress} className="h-2" />
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {nextLevelProgress.toFixed(0)}% to {nextLevel}
                        </span>
                        <span className="text-xs text-success flex items-center">
                          <Leaf className="h-3 w-3 mr-1" />
                          {formatCO2(user.co2Saved)} saved
                        </span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{user.itemsListed}</p>
                        <p className="text-xs text-muted-foreground">Items Listed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {user.isRepairHero ? (user.itemsListed >= 10 ? 5 : 3) : 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Items Repaired</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-center">
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your circular economy milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                        achievement.completed 
                          ? 'bg-success text-white' 
                          : 'bg-neutral-gray/40 text-muted-foreground'
                      }`}>
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{achievement.name}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium mb-1">Active Listings</p>
                          <p className="text-2xl font-bold">{items.length}</p>
                        </div>
                        <Package className="h-10 w-10 text-primary/50" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium mb-1">Saved Items</p>
                          <p className="text-2xl font-bold">7</p>
                        </div>
                        <Heart className="h-10 w-10 text-primary/50" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium mb-1">Unread Messages</p>
                          <p className="text-2xl font-bold">3</p>
                        </div>
                        <MessageSquare className="h-10 w-10 text-primary/50" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <h3 className="text-lg font-bold mb-4">Recent Listings</h3>
                
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Items Listed Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start listing your items to contribute to the circular economy
                      </p>
                      <Button className="bg-primary hover:bg-primary-dark">
                        List Your First Item
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.slice(0, 4).map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
                
                {items.length > 4 && (
                  <div className="text-center mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("listings")}
                    >
                      View All Listings
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="listings" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Your Listings</h3>
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Package className="h-4 w-4 mr-2" />
                    Add New Listing
                  </Button>
                </div>
                
                {items.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Items Listed Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start listing your items to contribute to the circular economy
                      </p>
                      <Button className="bg-primary hover:bg-primary-dark">
                        List Your First Item
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map(item => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="saved" className="mt-6">
                <Card>
                  <CardContent className="pt-6 text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Saved Items Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Save items you're interested in to view them later
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveTab("overview")}
                    >
                      Browse Marketplace
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="impact" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>CO₂ Impact</CardTitle>
                      <CardDescription>
                        Your contribution to reducing carbon emissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Leaf className="h-16 w-16 text-success mr-4" />
                        <div>
                          <p className="text-3xl font-bold">{formatCO2(user.co2Saved)}</p>
                          <p className="text-sm text-muted-foreground">CO₂ saved</p>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm mb-2">That's equivalent to:</p>
                        <ul className="space-y-1 text-sm">
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                            {(user.co2Saved / 1000 / 120).toFixed(1)} trees planted
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                            {(user.co2Saved / 1000 / 2.3).toFixed(1)} kilometers not driven in a car
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                            {(user.co2Saved / 1000 / 1.5).toFixed(1)} smartphone charging cycles
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Conservation</CardTitle>
                      <CardDescription>
                        Materials and resources you've helped conserve
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <Archive className="h-4 w-4 text-primary" />
                            </div>
                            <span>Waste Diverted</span>
                          </div>
                          <span className="font-medium">{(user.itemsListed * 1.5).toFixed(1)} kg</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <ShoppingBag className="h-4 w-4 text-primary" />
                            </div>
                            <span>New Products Avoided</span>
                          </div>
                          <span className="font-medium">{user.itemsListed}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <span>Community Ranking</span>
                          </div>
                          <span className="font-medium">Top 15%</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full mt-6">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Detailed Impact Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Impact Badges</CardTitle>
                    <CardDescription>
                      Earn badges by making a positive environmental impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-success/20 mx-auto mb-2 flex items-center justify-center">
                          <Leaf className="h-6 w-6 text-success" />
                        </div>
                        <p className="font-medium text-sm">Eco Starter</p>
                        <p className="text-xs text-muted-foreground">Unlocked</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-warning/20 mx-auto mb-2 flex items-center justify-center">
                          <Star className="h-6 w-6 text-warning" />
                        </div>
                        <p className="font-medium text-sm">Repair Hero</p>
                        <p className="text-xs text-muted-foreground">
                          {user.isRepairHero ? "Unlocked" : "Locked"}
                        </p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-accent/20 mx-auto mb-2 flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-accent" />
                        </div>
                        <p className="font-medium text-sm">Community Guide</p>
                        <p className="text-xs text-muted-foreground">Locked</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto mb-2 flex items-center justify-center">
                          <Award className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-sm">Circular Champion</p>
                        <p className="text-xs text-muted-foreground">
                          {user.itemsListed >= 10 ? "Unlocked" : "Locked"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
