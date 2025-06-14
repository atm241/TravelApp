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
