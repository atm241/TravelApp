import type { Destination, Activity } from "@shared/schema";

export const mockDestinations: Destination[] = [
  {
    id: 1,
    name: "Tokyo, Japan",
    country: "Japan",
    description: "Modern metropolis with ancient traditions",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "popular",
    rating: 5,
    reviewCount: 2100,
    priceFrom: 129900,
    latitude: "35.6762",
    longitude: "139.6503"
  },
  {
    id: 2,
    name: "Santorini, Greece",
    country: "Greece",
    description: "Stunning sunsets and white-washed villages",
    imageUrl: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "popular",
    rating: 5,
    reviewCount: 1800,
    priceFrom: 89900,
    latitude: "36.3932",
    longitude: "25.4615"
  },
  {
    id: 3,
    name: "Bali, Indonesia",
    country: "Indonesia",
    description: "Tropical paradise with rich culture",
    imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "beach",
    rating: 5,
    reviewCount: 3200,
    priceFrom: 69900,
    latitude: "-8.3405",
    longitude: "115.0920"
  },
  {
    id: 4,
    name: "Iceland",
    country: "Iceland",
    description: "Land of fire, ice, and northern lights",
    imageUrl: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "nature",
    rating: 5,
    reviewCount: 1500,
    priceFrom: 159900,
    latitude: "64.9631",
    longitude: "-19.0208"
  },
  {
    id: 5,
    name: "Machu Picchu, Peru",
    country: "Peru",
    description: "Ancient Incan citadel in the clouds",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "adventure",
    rating: 5,
    reviewCount: 987,
    priceFrom: 119900,
    latitude: "-13.1631",
    longitude: "-72.5450"
  },
  {
    id: 6,
    name: "Swiss Alps",
    country: "Switzerland",
    description: "Majestic mountains and pristine lakes",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "adventure",
    rating: 5,
    reviewCount: 1200,
    priceFrom: 179900,
    latitude: "46.5197",
    longitude: "7.4815"
  },
  {
    id: 7,
    name: "Maldives",
    country: "Maldives",
    description: "Tropical paradise with crystal waters",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "beach",
    rating: 5,
    reviewCount: 2500,
    priceFrom: 229900,
    latitude: "3.2028",
    longitude: "73.2207"
  },
  {
    id: 8,
    name: "New York City",
    country: "United States",
    description: "The city that never sleeps",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
    category: "city",
    rating: 5,
    reviewCount: 4100,
    priceFrom: 99900,
    latitude: "40.7128",
    longitude: "-74.0060"
  }
];

export const mockActivities: Activity[] = [
  {
    id: 1,
    name: "Hiking",
    description: "Explore mountain trails and scenic viewpoints",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "hiking",
    experienceCount: 1234
  },
  {
    id: 2,
    name: "Scuba Diving",
    description: "Discover underwater worlds and marine life",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "diving",
    experienceCount: 567
  },
  {
    id: 3,
    name: "Food Tours",
    description: "Taste local cuisine and culinary traditions",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "food",
    experienceCount: 891
  },
  {
    id: 4,
    name: "Wildlife Safari",
    description: "Observe animals in their natural habitat",
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "safari",
    experienceCount: 445
  },
  {
    id: 5,
    name: "Cultural Tours",
    description: "Explore historical sites and local traditions",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "cultural",
    experienceCount: 723
  },
  {
    id: 6,
    name: "Adventure Sports",
    description: "Experience thrilling outdoor activities",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150",
    category: "adventure",
    experienceCount: 356
  }
];

// Initialize mock data in storage
export async function initializeMockData() {
  // This would be called from the server startup to populate initial data
  return { destinations: mockDestinations, activities: mockActivities };
}
