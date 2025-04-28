import { useEffect, useRef, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Map, MapPin, Bolt, Handshake, Leaf } from "lucide-react";

// This would use Leaflet in a real implementation
const LocalImpactMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [timeFrame, setTimeFrame] = useState("30");
  const mapRef = useRef<any>(null);
  
  const { data: items } = useQuery({
    queryKey: ['/api/items'],
  });
  
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Simulate map markers from items
  const markers = items ? items.map((item: any) => ({
    id: item.id,
    lat: 40.7128 + (Math.random() * 0.1 - 0.05),  // Random coordinates around NYC for demo
    lng: -74.0060 + (Math.random() * 0.1 - 0.05),
    condition: item.condition,
    title: item.title
  })) : [];
  
  // In a real app, we would initialize Leaflet here
  useEffect(() => {
    if (typeof window !== 'undefined' && mapContainerRef.current && markers.length > 0) {
      // This is just a placeholder for demonstration
      // In a real app, this would be:
      // if (!mapRef.current) {
      //   mapRef.current = L.map(mapContainerRef.current).setView([40.7128, -74.0060], 12);
      //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
      // }
      //
      // markers.forEach(marker => {
      //   L.marker([marker.lat, marker.lng])
      //     .addTo(mapRef.current)
      //     .bindPopup(`<b>${marker.title}</b><br>${marker.condition}`);
      // });
    }
  }, [markers]);
  
  // Stats for the bottom cards
  const impactStats = {
    exchanges: stats?.exchanges || 87,
    repaired: stats?.repaired || 43,
    co2Saved: stats?.co2Saved || 238
  };
  
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="font-header text-2xl font-bold text-primary-dark">Local Impact Map</h2>
            <p className="text-secondary">See where items are being reused and repaired in your community</p>
          </div>
          <div className="mt-2 md:mt-0">
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
          </div>
        </div>
        
        <div ref={mapContainerRef} className="relative rounded-lg overflow-hidden shadow-md" style={{ height: "400px" }}>
          {/* This would be replaced with an actual map library like Leaflet in production */}
          <div className="absolute inset-0 bg-neutral-gray opacity-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-md text-center">
              <Map className="h-12 w-12 text-primary mx-auto mb-3" />
              <h3 className="font-header font-bold text-lg mb-2">Interactive Map</h3>
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
          
          {/* Sample map markers */}
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
              <div className="text-2xl font-bold text-primary-dark">{impactStats.exchanges}</div>
              <div className="text-sm text-secondary">Successful Exchanges</div>
            </div>
          </div>
          
          <div className="bg-neutral rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
              <Bolt className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-dark">{impactStats.repaired}</div>
              <div className="text-sm text-secondary">Items Repaired</div>
            </div>
          </div>
          
          <div className="bg-neutral rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mr-4">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-primary-dark">{impactStats.co2Saved} kg</div>
              <div className="text-sm text-secondary">Total CO₂ Saved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocalImpactMap;
