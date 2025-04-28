import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Map as MapIcon,
  Leaf,
  Handshake,
  Bolt,
  Info,
  HelpCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Item } from "@shared/schema";

const ImpactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [timeFrame, setTimeFrame] = useState("30");
  const [view, setView] = useState("map");
  
  // Fetch items for map
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['/api/items'],
  });
  
  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Generate markers from items
  const getMarkers = () => {
    if (!items) return [];
    
    // In a real app, these would be real coordinates from the items
    // Here we're generating random points around a center location
    const centerLat = 40.7128; // New York latitude
    const centerLng = -74.0060; // New York longitude
    
    return items.map((item: Item) => ({
      id: item.id,
      title: item.title,
      condition: item.condition,
      lat: centerLat + (Math.random() * 0.1 - 0.05),
      lng: centerLng + (Math.random() * 0.1 - 0.05),
    }));
  };
  
  const markers = getMarkers();
  
  // In a real app, we would initialize a mapping library like Leaflet here
  useEffect(() => {
    if (typeof window !== 'undefined' && mapContainerRef.current && markers.length > 0 && view === "map") {
      // This is a placeholder for a real mapping implementation
      // In a real app, this would initialize a map like:
      //
      // if (!mapInstanceRef.current) {
      //   mapInstanceRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 12);
      //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstanceRef.current);
      // }
      //
      // markers.forEach(marker => {
      //   const color = marker.condition === "Ready-to-Use" ? "green" : 
      //                 marker.condition === "Repairable" ? "orange" : "red";
      //   
      //   L.circleMarker([marker.lat, marker.lng], { 
      //     color, 
      //     fillColor: color,
      //     fillOpacity: 0.8,
      //     radius: 8
      //   })
      //   .addTo(mapInstanceRef.current)
      //   .bindPopup(`<b>${marker.title}</b><br>${marker.condition}`);
      // });
    }
  }, [markers, view]);
  
  // Format stats
  const formatNumber = (num: number = 0) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Use stats from query or fallbacks
  const impactStats = {
    exchanges: stats?.exchanges || 87,
    repaired: stats?.repaired || 43,
    co2Saved: stats?.co2Saved || 238,
    users: stats?.users || 125,
    itemsListed: stats?.activeListings || 43,
    repairHeroes: stats?.repairHeroes || 12,
  };
  
  // Stats data for different time periods
  const getTimeFrameStats = (period: string) => {
    const multiplier = period === "7" ? 0.3 : 
                      period === "30" ? 1 : 
                      period === "90" ? 2.5 : 4;
    
    return {
      exchanges: Math.floor(impactStats.exchanges * multiplier),
      repaired: Math.floor(impactStats.repaired * multiplier),
      co2Saved: Math.floor(impactStats.co2Saved * multiplier),
    };
  };
  
  const timeFrameStats = getTimeFrameStats(timeFrame);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p>Loading impact data...</p>
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
              Error Loading Impact Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the impact data. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="font-header text-2xl font-bold text-primary-dark">Local Impact Map</h1>
            <p className="text-secondary">See where items are being reused and repaired in your community</p>
          </div>
          <div className="mt-2 md:mt-0 flex space-x-2">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Past 7 days</SelectItem>
                <SelectItem value="30">Past 30 days</SelectItem>
                <SelectItem value="90">Past 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs value={view} onValueChange={setView} className="w-[180px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="map">Map</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <TabsContent value="map" className="mt-0">
          <div ref={mapContainerRef} className="relative rounded-lg overflow-hidden shadow-md" style={{ height: "400px" }}>
            {/* This would be replaced with an actual map library in production */}
            <div className="absolute inset-0 bg-neutral-gray opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg max-w-md text-center">
                <MapIcon className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-header font-bold text-lg mb-2">Interactive Impact Map</h3>
                <p className="text-sm text-neutral-dark mb-4">
                  This map shows real-time data of where items are being reused, repaired, and exchanged in your local community.
                </p>
                <div className="flex justify-center gap-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
                    <span className="text-xs">Ready-to-Use</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-warning mr-1"></div>
                    <span className="text-xs">Repairable</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-error mr-1"></div>
                    <span className="text-xs">Parts Only</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sample map markers - these would be dynamically placed in a real implementation */}
            <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-success animate-pulse"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 rounded-full bg-warning animate-pulse"></div>
            <div className="absolute top-1/3 left-2/3 w-4 h-4 rounded-full bg-success animate-pulse"></div>
            <div className="absolute top-2/3 left-1/2 w-4 h-4 rounded-full bg-error animate-pulse"></div>
            <div className="absolute top-1/5 left-3/4 w-4 h-4 rounded-full bg-warning animate-pulse"></div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral rounded-lg p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-dark">{formatNumber(timeFrameStats.exchanges)}</div>
                <div className="text-sm text-secondary">Successful Exchanges</div>
              </div>
            </div>
            
            <div className="bg-neutral rounded-lg p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                <Bolt className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-dark">{formatNumber(timeFrameStats.repaired)}</div>
                <div className="text-sm text-secondary">Items Repaired</div>
              </div>
            </div>
            
            <div className="bg-neutral rounded-lg p-4 flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-dark">{formatNumber(timeFrameStats.co2Saved)} kg</div>
                <div className="text-sm text-secondary">Total CO₂ Saved</div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Impact</CardTitle>
                <CardDescription>Key statistics about our circular economy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-primary-dark">{formatNumber(impactStats.users)}</p>
                      <p className="text-sm text-secondary">Active Users</p>
                    </div>
                    <div className="bg-neutral/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-primary-dark">{formatNumber(impactStats.itemsListed)}</p>
                      <p className="text-sm text-secondary">Items Listed</p>
                    </div>
                    <div className="bg-neutral/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-primary-dark">{formatNumber(impactStats.repairHeroes)}</p>
                      <p className="text-sm text-secondary">Repair Heroes</p>
                    </div>
                    <div className="bg-neutral/50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-primary-dark">5</p>
                      <p className="text-sm text-secondary">Neighborhoods</p>
                    </div>
                  </div>
                  
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          Local exchange of goods has saved an estimated {timeFrameStats.co2Saved} kg of CO₂ emissions, 
                          equivalent to planting {Math.floor(timeFrameStats.co2Saved / 12)} trees.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Item Categories</CardTitle>
                <CardDescription>Most exchanged item categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Electronics</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <div className="w-full bg-neutral-gray/30 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Furniture</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="w-full bg-neutral-gray/30 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "18%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clothing</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="w-full bg-neutral-gray/30 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kitchen Items</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="w-full bg-neutral-gray/30 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Other Categories</span>
                      <span className="text-sm font-medium">31%</span>
                    </div>
                    <div className="w-full bg-neutral-gray/30 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "31%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Neighborhood Impact</CardTitle>
                <CardDescription>Community impact by neighborhood</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead className="text-left">
                      <tr>
                        <th className="px-4 py-2 text-sm font-medium text-muted-foreground">Neighborhood</th>
                        <th className="px-4 py-2 text-sm font-medium text-muted-foreground">Items Exchanged</th>
                        <th className="px-4 py-2 text-sm font-medium text-muted-foreground">Items Repaired</th>
                        <th className="px-4 py-2 text-sm font-medium text-muted-foreground">CO₂ Saved (kg)</th>
                        <th className="px-4 py-2 text-sm font-medium text-muted-foreground">Active Users</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="px-4 py-3">Downtown</td>
                        <td className="px-4 py-3">34</td>
                        <td className="px-4 py-3">15</td>
                        <td className="px-4 py-3">87</td>
                        <td className="px-4 py-3">42</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Westside</td>
                        <td className="px-4 py-3">28</td>
                        <td className="px-4 py-3">12</td>
                        <td className="px-4 py-3">65</td>
                        <td className="px-4 py-3">35</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Northside</td>
                        <td className="px-4 py-3">19</td>
                        <td className="px-4 py-3">8</td>
                        <td className="px-4 py-3">42</td>
                        <td className="px-4 py-3">27</td>
                      </tr>
                      <tr className="border-t">
                        <td className="px-4 py-3">Eastside</td>
                        <td className="px-4 py-3">16</td>
                        <td className="px-4 py-3">6</td>
                        <td className="px-4 py-3">38</td>
                        <td className="px-4 py-3">21</td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="border-t">
                        <td className="px-4 py-3 font-medium">Total</td>
                        <td className="px-4 py-3 font-medium">{timeFrameStats.exchanges}</td>
                        <td className="px-4 py-3 font-medium">{timeFrameStats.repaired}</td>
                        <td className="px-4 py-3 font-medium">{timeFrameStats.co2Saved}</td>
                        <td className="px-4 py-3 font-medium">{impactStats.users}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button variant="outline" className="flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How Impact Is Calculated
                  </Button>
                  <Button className="ml-2 bg-primary hover:bg-primary-dark">
                    <MapPin className="h-4 w-4 mr-2" />
                    View Impact Near Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </div>
    </div>
  );
};

export default ImpactMap;
