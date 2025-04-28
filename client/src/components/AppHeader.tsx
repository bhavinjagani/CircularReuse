import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  User,
  Recycle
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppHeader = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const isActiveLink = (path: string) => {
    return location === path;
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Recycle className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="font-header font-bold text-xl text-primary">Circular Marketplace</h1>
                <p className="text-xs text-secondary-dark">Reduce, Reuse, Repair</p>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-10">
            <div className="w-full relative">
              <Input
                type="text"
                placeholder="Search for items..."
                className="w-full py-2 px-4 rounded-full border border-neutral-gray"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit"
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-2 text-secondary h-6 w-6 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* User Navigation */}
          <nav className="flex items-center space-x-4">
            <Link href="/list-item">
              <a className={cn("nav-link", isActiveLink("/list-item") && "text-primary")}>
                <PlusCircle className="h-6 w-6 mb-1 text-primary-light" />
                <span className="hidden md:inline">List Item</span>
              </a>
            </Link>
            
            <Link href="/messages">
              <a className={cn("nav-link", isActiveLink("/messages") && "text-primary")}>
                <MessageSquare className="h-6 w-6 mb-1 text-secondary" />
                <span className="hidden md:inline">Messages</span>
              </a>
            </Link>
            
            <Link href="/profile">
              <a className={cn("nav-link", isActiveLink("/profile") && "text-primary")}>
                <div className="relative">
                  <Avatar className="h-6 w-6 mb-1 bg-accent text-white">
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">2</span>
                  </div>
                </div>
                <span className="hidden md:inline">Profile</span>
              </a>
            </Link>
          </nav>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="w-full relative">
            <Input
              type="text"
              placeholder="Search for items..."
              className="w-full py-2 px-4 rounded-full border border-neutral-gray"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-2 text-secondary h-6 w-6 p-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Category Navigation */}
        <nav className="flex items-center space-x-1 md:space-x-6 pb-1 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <Link href="/">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              isActiveLink("/") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              All Items
            </a>
          </Link>
          
          <Link href="/?condition=Ready-to-Use">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              location.includes("condition=Ready-to-Use") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              Ready-to-Use
            </a>
          </Link>
          
          <Link href="/?condition=Repairable">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              location.includes("condition=Repairable") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              Repairable
            </a>
          </Link>
          
          <Link href="/?condition=Parts Only">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              location.includes("condition=Parts Only") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              Parts Only
            </a>
          </Link>
          
          <Link href="/repair-guides">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              isActiveLink("/repair-guides") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              DIY Repair Guides
            </a>
          </Link>
          
          <Link href="/impact-map">
            <a className={cn(
              "py-2 px-2 md:px-3 text-sm md:text-base",
              isActiveLink("/impact-map") 
                ? "text-primary-dark border-b-2 border-primary font-semibold" 
                : "text-neutral-dark hover:text-primary-dark hover:border-b-2 hover:border-primary"
            )}>
              Impact Map
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;
