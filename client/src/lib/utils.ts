import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from 'react';

// Calculate the CO2 savings based on product category and weight
export function calculateCO2Savings(category: string, weight: number): number {
  const multipliers: Record<string, number> = {
    Electronics: 3.5,
    Furniture: 2.0,
    Clothing: 1.2,
    Kitchen: 1.8,
    Tools: 2.2,
    Sports: 1.5,
    Toys: 1.3,
    Books: 0.8,
    Automotive: 3.0,
    Other: 1.0,
  };

  const multiplier = multipliers[category] || 1.0;
  return Math.floor(weight * multiplier);
}

// Format price to display as currency
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

// Format CO2 savings
export function formatCO2(co2: number): string {
  return co2 >= 1000 ? `${(co2 / 1000).toFixed(1)} kg` : `${co2} g`;
}

// Format distance
export function formatDistance(distance: number): string {
  return `${distance.toFixed(1)} miles away`;
}

// Utility function to combine classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get condition badge class
export function getConditionBadgeClass(condition: string): string {
  switch (condition) {
    case "Ready-to-Use":
      return "badge-ready";
    case "Repairable":
      return "badge-repairable";
    case "Parts Only":
      return "badge-parts";
    default:
      return "badge-ready";
  }
}

// Get placeholder image based on category
export function getCategoryImage(category: string): string {
  const images: Record<string, string> = {
    Electronics: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&auto=format&fit=crop",
    Furniture: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&auto=format&fit=crop",
    Clothing: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&auto=format&fit=crop",
    Kitchen: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&auto=format&fit=crop",
    Tools: "https://images.unsplash.com/photo-1580901368546-7c4bfbc11b34?w=400&h=300&auto=format&fit=crop",
    Sports: "https://images.unsplash.com/photo-1590454895549-81919adeb3ec?w=400&h=300&auto=format&fit=crop",
    Toys: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&auto=format&fit=crop",
    Books: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400&h=300&auto=format&fit=crop",
    Automotive: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&h=300&auto=format&fit=crop",
    Other: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400&h=300&auto=format&fit=crop",
  };

  return images[category] || images.Other;
}

// Get repair tip difficulty display - returns dot counts instead of JSX
export function getRepairDifficultyDisplay(difficulty: number): { filled: number, empty: number } {
  const filled = Math.min(Math.max(difficulty, 0), 5);
  const empty = 5 - filled;
  return { filled, empty };
}

// Extract user initials for avatar fallback
export function getUserInitials(username: string): string {
  if (!username) return "?";
  
  const parts = username.split(/[_.\-\s]/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return username.substring(0, 2).toUpperCase();
}
