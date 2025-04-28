import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, BookOpen } from "lucide-react";

const CTASection = () => {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
  });
  
  // Formatted stats with fallbacks
  const formattedStats = {
    itemsExchanged: stats?.itemsExchanged || 350,
    communitySavings: stats?.communitySavings || 15400,
    co2Saved: stats?.co2Saved || 1.2,
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <section className="bg-gradient-to-r from-primary-dark to-primary py-12 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-header text-3xl font-bold mb-2">Join Our Circular Economy Community</h2>
        <p className="max-w-2xl mx-auto mb-8 opacity-90">
          Help reduce waste, save money, and build a more sustainable future by buying, selling, and repairing second-hand items.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link href="/list-item">
            <Button className="bg-white text-primary hover:bg-neutral hover:text-primary-dark font-bold py-3 px-6 h-auto">
              <PlusCircle className="mr-2 h-5 w-5" />
              List an Item
            </Button>
          </Link>
          
          <Link href="/">
            <Button className="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 px-6 h-auto">
              <Search className="mr-2 h-5 w-5" />
              Browse Marketplace
            </Button>
          </Link>
          
          <Link href="/repair-guides">
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-6 h-auto">
              <BookOpen className="mr-2 h-5 w-5" />
              Repair Guides
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{formattedStats.itemsExchanged}+</div>
            <div className="text-lg font-medium">Items Exchanged</div>
            <p className="text-sm opacity-90 mt-2">Items found new homes instead of landfills</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{formatCurrency(formattedStats.communitySavings)}</div>
            <div className="text-lg font-medium">Community Savings</div>
            <p className="text-sm opacity-90 mt-2">Money saved by buying second-hand</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6">
            <div className="text-4xl font-bold mb-2">{formattedStats.co2Saved} tons</div>
            <div className="text-lg font-medium">CO₂ Saved</div>
            <p className="text-sm opacity-90 mt-2">Estimated carbon emission reduction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
