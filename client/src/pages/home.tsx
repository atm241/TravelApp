import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { DestinationCard } from "@/components/destination-card";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, Flame, Mountain, Umbrella, Building, Trees } from "lucide-react";
import type { Destination, Activity } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }
      const response = await fetch(`/api/destinations?${params}`);
      if (!response.ok) throw new Error("Failed to fetch destinations");
      return response.json();
    }
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const categories = [
    { id: "popular", name: "Popular", icon: Flame },
    { id: "adventure", name: "Adventure", icon: Mountain },
    { id: "beach", name: "Beach", icon: Umbrella },
    { id: "city", name: "City", icon: Building },
    { id: "nature", name: "Nature", icon: Trees },
  ];

  const handleExploreSearch = () => {
    console.log("Searching for:", searchDestination, "on:", searchDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="brand-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Plan Your Perfect Trip</h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Discover amazing destinations and create unforgettable memories
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Where to?
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter destination"
                      value={searchDestination}
                      onChange={(e) => setSearchDestination(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      When?
                    </label>
                    <Input
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                  <Button 
                    onClick={handleExploreSearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 self-end"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Explore Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Discover your next adventure with our enhanced explore experience
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Destination Grid */}
          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {destinations.map((destination) => (
                <DestinationCard 
                  key={destination.id} 
                  destination={destination}
                  onSelect={(dest) => console.log("Selected destination:", dest)}
                />
              ))}
            </div>
          )}

          {/* Activities Section */}
          <div className="bg-purple-50 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Popular Activities</h3>
              <p className="text-gray-600">Discover exciting adventures for your next trip</p>
            </div>
            
            {activitiesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {activities.map((activity) => (
                  <ActivityCard 
                    key={activity.id} 
                    activity={activity}
                    onSelect={(act) => console.log("Selected activity:", act)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TravelPlanner?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for the perfect trip in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Smart Itinerary Builder",
                description: "Create detailed itineraries with drag-and-drop simplicity and get AI-powered suggestions."
              },
              {
                icon: Building,
                title: "Collaborative Planning", 
                description: "Plan together with friends and family in real-time with shared trip boards and voting features."
              },
              {
                icon: Calendar,
                title: "Offline Access",
                description: "Download your itineraries and access them offline during your travels without internet."
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-purple-600 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
