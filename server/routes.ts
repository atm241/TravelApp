import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTripSchema, insertTripItemSchema } from "../shared/schema-local.js";
import { generateTripRecommendations, findSimilarActivities } from "./ai-recommendations";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Destinations routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let destinations;
      if (search) {
        destinations = await storage.searchDestinations(search as string);
      } else if (category) {
        destinations = await storage.getDestinationsByCategory(category as string);
      } else {
        destinations = await storage.getDestinations();
      }
      
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const destination = await storage.getDestination(id);
      
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      res.json(destination);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    try {
      const { category } = req.query;
      
      let activities;
      if (category) {
        activities = await storage.getActivitiesByCategory(category as string);
      } else {
        activities = await storage.getActivities();
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Trips routes
  app.get("/api/trips", async (req, res) => {
    try {
      const { userId } = req.query;
      
      let trips;
      if (userId) {
        trips = await storage.getTripsByUser(parseInt(userId as string));
      } else {
        trips = await storage.getTrips();
      }
      
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const validatedData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(validatedData);
      res.status(201).json(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trip" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(id, validatedData);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.json(trip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTrip(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Trip items routes
  app.get("/api/trips/:tripId/items", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripItems(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip items" });
    }
  });

  app.post("/api/trips/:tripId/items", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripItemSchema.parse({
        ...req.body,
        tripId
      });
      const item = await storage.createTripItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create trip item" });
    }
  });

  app.put("/api/trip-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTripItemSchema.partial().parse(req.body);
      const item = await storage.updateTripItem(id, validatedData);
      
      if (!item) {
        return res.status(404).json({ message: "Trip item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid trip item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update trip item" });
    }
  });

  app.delete("/api/trip-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTripItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Trip item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete trip item" });
    }
  });

  // AI Recommendations routes
  app.post("/api/trips/:id/ai-recommendations", async (req, res) => {
    try {
      const tripId = parseInt(req.params.id);
      const trip = await storage.getTrip(tripId);
      
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      const recommendations = await generateTripRecommendations(
        trip.destination,
        trip.description || "",
        trip.startDate,
        trip.endDate
      );

      res.json(recommendations);
    } catch (error) {
      console.error("AI recommendations error:", error);
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  app.post("/api/similar-activities", async (req, res) => {
    try {
      const { description } = req.body;
      
      if (!description || typeof description !== "string") {
        return res.status(400).json({ message: "Description is required" });
      }

      const similarActivities = await findSimilarActivities(description);
      res.json(similarActivities);
    } catch (error) {
      console.error("Similar activities error:", error);
      res.status(500).json({ message: "Failed to find similar activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
