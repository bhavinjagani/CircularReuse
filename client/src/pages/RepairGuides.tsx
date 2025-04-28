import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RepairTipCard from "@/components/RepairTipCard";
import { itemCategories } from "@shared/schema";
import { 
  Search, 
  BookOpen, 
  Wrench, 
  PlusCircle, 
  ArrowUpDown,
  Loader2,
  AlertCircle
} from "lucide-react";

const RepairGuides = () => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  
  // Fetch repair tips
  const { data: repairTips, isLoading, error } = useQuery({
    queryKey: ['/api/repair-tips'],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would query the API with search params
    console.log("Searching for:", searchQuery);
  };
  
  // Filter and sort tips
  const filterAndSortTips = () => {
    if (!repairTips) return [];
    
    let filtered = [...repairTips];
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(tip => tip.category === categoryFilter);
    }
    
    // Apply difficulty filter
    if (difficultyFilter) {
      const difficulty = parseInt(difficultyFilter);
      filtered = filtered.filter(tip => tip.difficulty === difficulty);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tip => 
          tip.title.toLowerCase().includes(query) || 
          tip.content.toLowerCase().includes(query)
      );
    }
    
    // Sort results
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        case "oldest":
          return new Date(a.created).getTime() - new Date(b.created).getTime();
        case "popular":
          return b.views - a.views;
        case "difficulty-asc":
          return a.difficulty - b.difficulty;
        case "difficulty-desc":
          return b.difficulty - a.difficulty;
        default:
          return 0;
      }
    });
  };
  
  const filteredTips = repairTips ? filterAndSortTips() : [];
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p>Loading repair guides...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Repair Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the repair guides. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-header font-bold text-primary-dark mb-2">
            DIY Repair Guides
          </h1>
          <p className="text-muted-foreground">
            Learn how to repair and extend the life of your items with community-contributed guides
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filter Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search guides..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                
                {/* Category filter */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Category
                  </label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {itemCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Difficulty filter */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Difficulty
                  </label>
                  <Select
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Difficulty</SelectItem>
                      <SelectItem value="1">Level 1 - Beginner</SelectItem>
                      <SelectItem value="2">Level 2 - Easy</SelectItem>
                      <SelectItem value="3">Level 3 - Intermediate</SelectItem>
                      <SelectItem value="4">Level 4 - Advanced</SelectItem>
                      <SelectItem value="5">Level 5 - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Sort order */}
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Sort By
                  </label>
                  <Select
                    value={sortOrder}
                    onValueChange={setSortOrder}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="difficulty-asc">Easiest First</SelectItem>
                      <SelectItem value="difficulty-desc">Hardest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary-dark mt-2">
                  <Wrench className="h-4 w-4 mr-2" />
                  Create Repair Guide
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Guides</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="beginner">For Beginners</TabsTrigger>
                </TabsList>
                
                <Select
                  value={sortOrder}
                  onValueChange={setSortOrder}
                >
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="difficulty-asc">Easiest First</SelectItem>
                    <SelectItem value="difficulty-desc">Hardest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <TabsContent value="all">
                {filteredTips.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center py-12">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Repair Guides Found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery || categoryFilter || difficultyFilter
                          ? "Try adjusting your filters to see more results."
                          : "Be the first to create a repair guide for the community!"}
                      </p>
                      <Button className="bg-primary hover:bg-primary-dark">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create Repair Guide
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTips.map(tip => (
                      <RepairTipCard key={tip.id} tip={tip} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTips
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 6)
                    .map(tip => (
                      <RepairTipCard key={tip.id} tip={tip} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTips
                    .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
                    .slice(0, 6)
                    .map(tip => (
                      <RepairTipCard key={tip.id} tip={tip} />
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="beginner">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTips
                    .filter(tip => tip.difficulty <= 2)
                    .slice(0, 6)
                    .map(tip => (
                      <RepairTipCard key={tip.id} tip={tip} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Featured category sections */}
        <div className="mt-12">
          <h2 className="text-xl font-header font-bold mb-6">Popular Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-1">Electronics</h3>
                  <p className="text-sm text-muted-foreground">
                    Repair common electronic devices
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-medium mb-1">Furniture</h3>
                  <p className="text-sm text-muted-foreground">
                    Restore and fix wooden furniture
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-medium mb-1">Bicycles</h3>
                  <p className="text-sm text-muted-foreground">
                    Maintenance and repair for bikes
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="group cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3 group-hover:bg-success/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-medium mb-1">Clothing</h3>
                  <p className="text-sm text-muted-foreground">
                    Fix and upcycle clothing items
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairGuides;
