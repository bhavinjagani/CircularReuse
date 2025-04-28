import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertItemSchema, itemCategories, itemConditions, calculateCO2Saved } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Upload, ArrowRight, Loader2 } from "lucide-react";

const listItemSchema = insertItemSchema.extend({
  // Make sure the price is a positive number
  price: z.coerce.number().positive("Price must be greater than 0"),
  // Make sure weight is a positive number
  weight: z.coerce.number().min(0, "Weight cannot be negative"),
  // Validate image URL
  imageUrl: z.string().url("Please enter a valid image URL"),
});

const DEFAULT_DEMO_USER_ID = 1; // In a real app, this would come from authentication

const ListItem = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState("");
  const [co2Saved, setCo2Saved] = useState(0);

  const form = useForm<z.infer<typeof listItemSchema>>({
    resolver: zodResolver(listItemSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      condition: "",
      imageUrl: "",
      weight: 0,
      location: "New York, NY", // Default location
      distance: 0,
      userId: DEFAULT_DEMO_USER_ID,
    },
  });

  const { watch, setValue } = form;
  const categoryValue = watch("category");
  const weightValue = watch("weight");

  // Update CO2 saved calculation when category or weight changes
  // This is for display only - the real calculation happens on the server
  const updateCO2Calculation = () => {
    if (categoryValue && weightValue) {
      const calculated = calculateCO2Saved(categoryValue, weightValue);
      setCo2Saved(calculated);
    }
  };

  // Watch for relevant field changes
  useState(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "imageUrl" && value.imageUrl) {
        setPreviewUrl(value.imageUrl);
      }
      
      if ((name === "category" || name === "weight") && value.category && value.weight) {
        updateCO2Calculation();
      }
    });
    
    return () => subscription.unsubscribe();
  });

  // Handle form submission
  const createItemMutation = useMutation({
    mutationFn: async (data: z.infer<typeof listItemSchema>) => {
      const response = await apiRequest("POST", "/api/items", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Item listed successfully!",
        description: "Your item has been added to the marketplace.",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Failed to list item",
        description: error.message || "There was an error listing your item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof listItemSchema>) => {
    createItemMutation.mutate(data);
  };

  // Get repair tips based on category and condition
  const getRepairTips = () => {
    const category = form.getValues("category");
    const condition = form.getValues("condition");
    
    if (!category || condition !== "Repairable") return null;
    
    const tips = {
      Electronics: "Check for loose connections, replace capacitors, or update firmware.",
      Furniture: "Sand rough edges, tighten loose joints, fill cracks with wood filler.",
      Clothing: "Patch holes, replace buttons, reinforce weak seams.",
      Kitchen: "Descale appliances, replace seals, check electrical connections.",
      Tools: "Lubricate moving parts, replace worn handles, sharpen blades.",
      Sports: "Replace worn grips, patch inflatable items, realign components.",
      Toys: "Replace batteries, clean circuit boards, reattach loose parts.",
      Books: "Reinforce binding, replace missing pages, clean covers gently.",
      Automotive: "Check fluid levels, replace filters, clean electrical contacts.",
      Other: "Clean thoroughly, identify broken parts, research specific repair methods.",
    };
    
    return tips[category as keyof typeof tips] || null;
  };

  const repairTip = getRepairTips();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-header font-bold mb-6 text-primary-dark">List an Item</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>
                  Provide information about the item you're listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Vintage Sewing Machine" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the item, including its condition, history, and any issues"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" min="0" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (grams)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1" 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  updateCO2Calculation();
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Used to calculate CO₂ savings
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                updateCO2Calculation();
                              }}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {itemCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {itemConditions.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Brooklyn, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide a URL to an image of your item
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-dark"
                      disabled={createItemMutation.isPending}
                    >
                      {createItemMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Listing Item...
                        </>
                      ) : (
                        <>
                          List Item
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {/* Image Preview */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Image Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Item preview" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-neutral-gray rounded-md flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Enter an image URL to see a preview
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Sustainability Impact */}
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Sustainability Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <Leaf className="h-8 w-8 text-success mr-3" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated CO₂ Saved</p>
                    <p className="text-2xl font-bold text-success">{co2Saved} g</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  By listing this item, you're helping reduce the carbon footprint associated with manufacturing new products.
                </p>
              </CardContent>
            </Card>
            
            {/* Repair Tips */}
            {repairTip && (
              <Card>
                <CardHeader>
                  <CardTitle>Repair Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent/10 p-3 rounded-md">
                    <p className="text-sm text-secondary-foreground">
                      {repairTip}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Include these tips in your description to help potential buyers understand repair possibilities.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
