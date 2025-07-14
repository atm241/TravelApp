import { 
  users, destinations, activities, trips, tripItems,
  type User, type InsertUser,
  type Destination, type InsertDestination,
  type Activity, type InsertActivity,
  type Trip, type InsertTrip,
  type TripItem, type InsertTripItem
} from "../shared/schema-local.js";
import { db } from "./db";
import { eq, like, or } from "drizzle-orm";

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



// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    return await db.select().from(destinations).where(eq(destinations.category, category));
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination || undefined;
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    return await db.select().from(destinations).where(
      or(
        like(destinations.name, searchPattern),
        like(destinations.country, searchPattern),
        like(destinations.description, searchPattern)
      )
    );
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const [destination] = await db.insert(destinations).values(insertDestination).returning();
    return destination;
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.category, category));
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }

  async getTrips(): Promise<Trip[]> {
    return await db.select().from(trips).where(eq(trips.isPublic, true));
  }

  async getTripsByUser(userId: number): Promise<Trip[]> {
    return await db.select().from(trips).where(eq(trips.userId, userId));
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    console.log('Trip data from DB:', trip);
    return trip || undefined;
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    const [trip] = await db.insert(trips).values(insertTrip).returning();
    return trip;
  }

  async updateTrip(id: number, updateData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const [trip] = await db.update(trips).set(updateData).where(eq(trips.id, id)).returning();
    return trip || undefined;
  }

  async deleteTrip(id: number): Promise<boolean> {
    // Delete associated trip items first
    await db.delete(tripItems).where(eq(tripItems.tripId, id));
    // Delete the trip
    const result = await db.delete(trips).where(eq(trips.id, id));
    // For SQLite with better-sqlite3, check changes property
    return result.changes > 0;
  }

  async getTripItems(tripId: number): Promise<TripItem[]> {
    return await db.select().from(tripItems)
      .where(eq(tripItems.tripId, tripId))
      .orderBy(tripItems.day, tripItems.order);
  }

  async createTripItem(insertTripItem: InsertTripItem): Promise<TripItem> {
    const [tripItem] = await db.insert(tripItems).values(insertTripItem).returning();
    return tripItem;
  }

  async updateTripItem(id: number, updateData: Partial<InsertTripItem>): Promise<TripItem | undefined> {
    const [tripItem] = await db.update(tripItems).set(updateData).where(eq(tripItems.id, id)).returning();
    return tripItem || undefined;
  }

  async deleteTripItem(id: number): Promise<boolean> {
    const result = await db.delete(tripItems).where(eq(tripItems.id, id));
    return result.changes > 0;
  }
}

export const storage = new DatabaseStorage();
