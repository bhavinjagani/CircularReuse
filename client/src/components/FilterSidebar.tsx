import { useState } from "react";
import { useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { itemCategories, itemConditions } from "@shared/schema";

interface FilterCounts {
  categories: Record<string, number>;
  conditions: Record<string, number>;
}

interface FilterSidebarProps {
  counts?: FilterCounts;
}

const FilterSidebar = ({ counts = { categories: {}, conditions: {} } }: FilterSidebarProps) => {
  const [, setLocation] = useLocation();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [distance, setDistance] = useState<string>("10");
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };
  
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach(category => {
        params.append("category", category);
      });
    }
    
    if (selectedConditions.length > 0) {
      selectedConditions.forEach(condition => {
        params.append("condition", condition);
      });
    }
    
    if (priceRange[0] > 0) {
      params.append("priceMin", priceRange[0].toString());
    }
    
    if (priceRange[1] < 500) {
      params.append("priceMax", priceRange[1].toString());
    }
    
    params.append("distance", distance);
    
    setLocation(`/?${params.toString()}`);
  };
  
  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, 500]);
    setDistance("10");
    setLocation("/");
  };
  
  return (
    <aside className="md:w-1/4 bg-white rounded-lg shadow-md p-4 h-fit">
      <h2 className="font-header text-lg font-semibold mb-4">Filters</h2>
      
      {/* Categories Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 flex justify-between items-center">
          <span>Categories</span>
          <ChevronDown className="h-4 w-4 text-secondary cursor-pointer" />
        </h3>
        <div className="space-y-2">
          {itemCategories.map(category => (
            <div key={category} className="flex items-center">
              <Checkbox 
                id={`category-${category}`} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label 
                htmlFor={`category-${category}`} 
                className="ml-2 text-sm"
              >
                {category} {counts.categories[category] ? `(${counts.categories[category]})` : ''}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Condition Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 flex justify-between items-center">
          <span>Condition</span>
          <ChevronDown className="h-4 w-4 text-secondary cursor-pointer" />
        </h3>
        <div className="space-y-2">
          {itemConditions.map(condition => (
            <div key={condition} className="flex items-center">
              <Checkbox 
                id={`condition-${condition}`} 
                checked={selectedConditions.includes(condition)}
                onCheckedChange={() => toggleCondition(condition)}
              />
              <Label 
                htmlFor={`condition-${condition}`} 
                className="ml-2 text-sm"
              >
                {condition} {counts.conditions[condition] ? `(${counts.conditions[condition]})` : ''}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2 flex justify-between items-center">
          <span>Price Range</span>
          <ChevronDown className="h-4 w-4 text-secondary cursor-pointer" />
        </h3>
        <div className="px-2">
          <Slider
            defaultValue={[0, 500]}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full h-2"
          />
          <div className="flex justify-between mt-2 text-xs text-neutral-dark">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>
      </div>
      
      {/* Distance Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Distance</h3>
        <Select value={distance} onValueChange={setDistance}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Within 5 miles</SelectItem>
            <SelectItem value="10">Within 10 miles</SelectItem>
            <SelectItem value="25">Within 25 miles</SelectItem>
            <SelectItem value="50">Within 50 miles</SelectItem>
            <SelectItem value="100">Any distance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Filter Actions */}
      <div className="flex gap-2">
        <Button 
          onClick={handleApplyFilters}
          className="bg-primary hover:bg-primary-dark text-white font-medium flex-grow"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline" 
          className="border border-secondary text-secondary hover:bg-secondary hover:text-white"
        >
          Reset
        </Button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
