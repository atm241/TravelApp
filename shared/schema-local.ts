import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const destinations = sqliteTable("destinations", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // popular, adventure, beach, city, nature
  rating: integer("rating").notNull(), // 1-5 stars
  reviewCount: integer("review_count").notNull().default(0),
  priceFrom: integer("price_from").notNull(), // price in cents
  latitude: text("latitude"),
  longitude: text("longitude"),
});

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // hiking, diving, food, safari, cultural, adventure
  experienceCount: integer("experience_count").notNull().default(0),
});

export const trips = sqliteTable("trips", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  description: text("description"),
  isPublic: integer("is_public", { mode: 'boolean' }).notNull().default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const tripItems = sqliteTable("trip_items", {
  id: integer("id").primaryKey(),
  tripId: integer("trip_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  day: integer("day").notNull(),
  time: text("time"),
  order: integer("order").notNull(),
  type: text("type").notNull().default("activity"), // activity, accommodation, transport
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
});

export const insertTripItemSchema = createInsertSchema(tripItems).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = z.infer<typeof insertDestinationSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = z.infer<typeof insertTripSchema>;

export type TripItem = typeof tripItems.$inferSelect;
export type InsertTripItem = z.infer<typeof insertTripItemSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),
  tripItems: many(tripItems),
}));

export const tripItemsRelations = relations(tripItems, ({ one }) => ({
  trip: one(trips, {
    fields: [tripItems.tripId],
    references: [trips.id],
  }),
}));
