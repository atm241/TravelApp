import { 
  users, destinations, activities, trips, tripItems,
  type User, type InsertUser,
  type Destination, type InsertDestination,
  type Activity, type InsertActivity,
  type Trip, type InsertTrip,
  type TripItem, type InsertTripItem
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getDestinationsByCategory(category: string): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  searchDestinations(query: string): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;

  // Activity operations
  getActivities(): Promise<Activity[]>;
  getActivitiesByCategory(category: string): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Trip operations
  getTrips(): Promise<Trip[]>;
  getTripsByUser(userId: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;

  // Trip item operations
  getTripItems(tripId: number): Promise<TripItem[]>;
  createTripItem(tripItem: InsertTripItem): Promise<TripItem>;
  updateTripItem(id: number, tripItem: Partial<InsertTripItem>): Promise<TripItem | undefined>;
  deleteTripItem(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private destinations: Map<number, Destination>;
  private activities: Map<number, Activity>;
  private trips: Map<number, Trip>;
  private tripItems: Map<number, TripItem>;
  private currentUserId: number;
  private currentDestinationId: number;
  private currentActivityId: number;
  private currentTripId: number;
  private currentTripItemId: number;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.activities = new Map();
    this.trips = new Map();
    this.tripItems = new Map();
    this.currentUserId = 1;
    this.currentDestinationId = 1;
    this.currentActivityId = 1;
    this.currentTripId = 1;
    this.currentTripItemId = 1;
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock destinations
    const mockDestinations = [
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

    // Mock activities
    const mockActivities = [
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

    // Populate destinations
    mockDestinations.forEach(dest => {
      this.destinations.set(dest.id, dest);
    });
    this.currentDestinationId = Math.max(...mockDestinations.map(d => d.id)) + 1;

    // Populate activities
    mockActivities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
    this.currentActivityId = Math.max(...mockActivities.map(a => a.id)) + 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    return Array.from(this.destinations.values()).filter(dest => dest.category === category);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.destinations.values()).filter(dest => 
      dest.name.toLowerCase().includes(lowerQuery) || 
      dest.country.toLowerCase().includes(lowerQuery) ||
      dest.description.toLowerCase().includes(lowerQuery)
    );
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = this.currentDestinationId++;
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  // Activity operations
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.category === category);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  // Trip operations
  async getTrips(): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.isPublic);
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return Array.from(this.trips.values()).filter(trip => trip.userId === userId);
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    return this.trips.get(id);
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const id = this.currentTripId++;
    const trip: Trip = { 
      ...insertTrip, 
      id, 
      createdAt: new Date() 
    };
    this.trips.set(id, trip);
    return trip;
  }

  async updateTrip(id: number, updateData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const trip = this.trips.get(id);
    if (!trip) return undefined;
    
    const updatedTrip = { ...trip, ...updateData };
    this.trips.set(id, updatedTrip);
    return updatedTrip;
  }

  async deleteTrip(id: number): Promise<boolean> {
    const deleted = this.trips.delete(id);
    // Also delete associated trip items
    Array.from(this.tripItems.entries()).forEach(([itemId, item]) => {
      if (item.tripId === id) {
        this.tripItems.delete(itemId);
      }
    });
    return deleted;
  }

  // Trip item operations
  async getTripItems(tripId: number): Promise<TripItem[]> {
    return Array.from(this.tripItems.values())
      .filter(item => item.tripId === tripId)
      .sort((a, b) => a.day === b.day ? a.order - b.order : a.day - b.day);
  }

  async createTripItem(insertTripItem: InsertTripItem): Promise<TripItem> {
    const id = this.currentTripItemId++;
    const tripItem: TripItem = { ...insertTripItem, id };
    this.tripItems.set(id, tripItem);
    return tripItem;
  }

  async updateTripItem(id: number, updateData: Partial<InsertTripItem>): Promise<TripItem | undefined> {
    const tripItem = this.tripItems.get(id);
    if (!tripItem) return undefined;
    
    const updatedTripItem = { ...tripItem, ...updateData };
    this.tripItems.set(id, updatedTripItem);
    return updatedTripItem;
  }

  async deleteTripItem(id: number): Promise<boolean> {
    return this.tripItems.delete(id);
  }
}

export const storage = new MemStorage();
