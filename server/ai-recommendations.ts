import OpenAI from "openai";
import { storage } from "./storage";
import type { Destination, Activity } from "../shared/schema-local.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

interface TripRecommendation {
  activities: string[];
  attractions: string[];
  restaurants: string[];
  tips: string[];
}

function getFallbackRecommendations(): TripRecommendation {
  return {
    activities: [
      "Explore local markets and street food",
      "Take a guided walking tour",
      "Visit popular museums and galleries",
      "Experience local transportation",
      "Photography tour of iconic spots"
    ],
    attractions: [
      "Historic city center",
      "Popular viewpoints and observation decks",
      "Cultural landmarks and monuments",
      "Beautiful parks and gardens",
      "Traditional neighborhoods"
    ],
    restaurants: [
      "Highly-rated local restaurant",
      "Traditional cuisine experience",
      "Popular street food market",
      "Rooftop dining with a view",
      "Local specialty restaurant"
    ],
    tips: [
      "Check local weather and pack accordingly",
      "Learn basic greetings in the local language",
      "Research local customs and etiquette",
      "Book popular attractions in advance",
      "Keep digital and physical copies of documents"
    ]
  };
}

export async function generateTripRecommendations(
  destination: string,
  description: string,
  startDate: string,
  endDate: string
): Promise<TripRecommendation> {
  if (!openai) {
    console.log('OpenAI API not configured, using fallback recommendations');
    return getFallbackRecommendations();
  }

  try {
    const durationDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const prompt = `
You are a travel expert. Based on the following trip details, provide personalized recommendations:

Destination: ${destination}
Trip Description: ${description}
Duration: ${durationDays} days
Dates: ${startDate} to ${endDate}

Please provide recommendations in the following JSON format:
{
  "activities": ["activity1", "activity2", "activity3", "activity4", "activity5"],
  "attractions": ["attraction1", "attraction2", "attraction3", "attraction4", "attraction5"],
  "restaurants": ["restaurant1", "restaurant2", "restaurant3", "restaurant4", "restaurant5"],
  "tips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}

Make recommendations specific to the destination and aligned with the trip description. Include both popular must-sees and hidden gems. Consider the season/dates for weather-appropriate activities.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful travel planning assistant. Provide personalized recommendations based on trip details. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const recommendations = JSON.parse(response.choices[0].message.content || "{}");
    return recommendations;
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    // Fallback to basic recommendations
    return {
      activities: [
        "Explore local markets",
        "Take a walking tour",
        "Visit museums",
        "Try local cuisine",
        "Photography tour"
      ],
      attractions: [
        "Historic city center",
        "Popular viewpoints",
        "Cultural landmarks",
        "Parks and gardens",
        "Local neighborhoods"
      ],
      restaurants: [
        "Traditional local cuisine",
        "Popular local restaurant",
        "Street food markets",
        "Rooftop dining",
        "Local specialties"
      ],
      tips: [
        "Check local weather forecast",
        "Learn basic local phrases",
        "Research local customs",
        "Book popular attractions in advance",
        "Keep copies of important documents"
      ]
    };
  }
}

export async function findSimilarActivities(description: string): Promise<Activity[]> {
  try {
    // Get all activities from database
    const allActivities = await storage.getActivities();
    
    if (allActivities.length === 0) {
      return [];
    }

    if (!openai) {
      console.log('OpenAI API not configured, returning first few activities');
      return allActivities.slice(0, 3);
    }

    const prompt = `
Given this trip description: "${description}"

And these available activities:
${allActivities.map(a => `- ${a.name}: ${a.description} (Category: ${a.category})`).join('\n')}

Which activities would be most relevant for this trip? Respond with a JSON array of activity names in order of relevance:
["activity1", "activity2", "activity3"]

Consider the trip theme, interests, and type of experience described.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a travel activity matcher. Analyze trip descriptions and match them with relevant activities. Respond with JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const relevantActivityNames = JSON.parse(response.choices[0].message.content || "[]");
    
    // Return matching activities in order of relevance
    const matchedActivities = relevantActivityNames
      .map((name: string) => allActivities.find(a => a.name === name))
      .filter(Boolean)
      .slice(0, 4); // Limit to top 4 most relevant

    return matchedActivities;
  } catch (error) {
    console.error("Error finding similar activities:", error);
    // Fallback to first few activities
    const allActivities = await storage.getActivities();
    return allActivities.slice(0, 3);
  }
}