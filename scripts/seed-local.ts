import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '../shared/schema-local';

const sqlite = new Database('./local.db');
const db = drizzle(sqlite, { schema });

async function seed() {
  console.log('🌱 Seeding database...');

  // Insert sample destinations
  const destinations = await db.insert(schema.destinations).values([
    {
      name: "Bali",
      country: "Indonesia",
      description: "Tropical paradise with beautiful beaches, temples, and rice terraces.",
      imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1",
      category: "beach",
      rating: 5,
      reviewCount: 1250,
      priceFrom: 50000, // $500
      latitude: "-8.3405",
      longitude: "115.0920"
    },
    {
      name: "Tokyo",
      country: "Japan",
      description: "Modern metropolis blending tradition and innovation.",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
      category: "city",
      rating: 5,
      reviewCount: 890,
      priceFrom: 80000, // $800
      latitude: "35.6762",
      longitude: "139.6503"
    },
    {
      name: "Santorini",
      country: "Greece",
      description: "Stunning island with white buildings and beautiful sunsets.",
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
      category: "popular",
      rating: 5,
      reviewCount: 750,
      priceFrom: 120000, // $1200
      latitude: "36.3932",
      longitude: "25.4615"
    },
    {
      name: "Machu Picchu",
      country: "Peru",
      description: "Ancient Incan citadel high in the Andes Mountains.",
      imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377",
      category: "adventure",
      rating: 5,
      reviewCount: 620,
      priceFrom: 70000, // $700
      latitude: "-13.1631",
      longitude: "-72.5450"
    },
    {
      name: "Patagonia",
      country: "Chile & Argentina",
      description: "Vast wilderness with glaciers, mountains, and wildlife.",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
      category: "nature",
      rating: 4,
      reviewCount: 340,
      priceFrom: 150000, // $1500
      latitude: "-50.9423",
      longitude: "-73.4068"
    }
  ]).returning();

  console.log(`✅ Created ${destinations.length} destinations`);

  // Insert sample activities
  const activities = await db.insert(schema.activities).values([
    {
      name: "Scuba Diving",
      description: "Explore underwater coral reefs and marine life.",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19",
      category: "diving",
      experienceCount: 450
    },
    {
      name: "Hiking",
      description: "Trek through scenic mountain trails and valleys.",
      imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306",
      category: "hiking",
      experienceCount: 680
    },
    {
      name: "Cultural Tours",
      description: "Immerse yourself in local traditions and history.",
      imageUrl: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6d",
      category: "cultural",
      experienceCount: 320
    },
    {
      name: "Food Tasting",
      description: "Sample authentic local cuisine and delicacies.",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
      category: "food",
      experienceCount: 540
    },
    {
      name: "Safari",
      description: "Observe wildlife in their natural habitat.",
      imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
      category: "safari",
      experienceCount: 280
    },
    {
      name: "Adventure Sports",
      description: "Thrill-seeking activities like bungee jumping and zip-lining.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      category: "adventure",
      experienceCount: 195
    }
  ]).returning();

  console.log(`✅ Created ${activities.length} activities`);

  // Insert a sample user
  const users = await db.insert(schema.users).values([
    {
      username: "demo_user",
      email: "demo@example.com",
      password: "hashed_password_here" // In real app, this would be properly hashed
    }
  ]).returning();

  console.log(`✅ Created ${users.length} users`);

  // Insert a sample trip
  const trips = await db.insert(schema.trips).values([
    {
      userId: users[0].id,
      title: "Amazing Bali Adventure",
      destination: "Bali, Indonesia",
      startDate: "2024-07-15",
      endDate: "2024-07-25",
      description: "10-day exploration of temples, beaches, and culture.",
      isPublic: true
    }
  ]).returning();

  console.log(`✅ Created ${trips.length} trips`);

  // Insert sample trip items
  const tripItems = await db.insert(schema.tripItems).values([
    {
      tripId: trips[0].id,
      title: "Arrive in Denpasar",
      description: "Flight arrival and hotel check-in",
      day: 1,
      time: "14:00",
      order: 1,
      type: "transport"
    },
    {
      tripId: trips[0].id,
      title: "Visit Uluwatu Temple",
      description: "Explore the clifftop temple and watch sunset",
      day: 2,
      time: "16:00",
      order: 1,
      type: "activity"
    },
    {
      tripId: trips[0].id,
      title: "Ubud Rice Terraces",
      description: "Hike through the famous Tegallalang Rice Terraces",
      day: 3,
      time: "09:00",
      order: 1,
      type: "activity"
    }
  ]).returning();

  console.log(`✅ Created ${tripItems.length} trip items`);
  console.log('🎉 Database seeded successfully!');
}

seed().catch(console.error);
