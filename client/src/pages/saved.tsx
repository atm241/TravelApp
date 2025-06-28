import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { DestinationCard } from "@/components/destination-card";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Heart, Search, Filter } from "lucide-react";
import type { Destination } from "@shared";

export default function Saved() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // For now, we'll simulate saved items with localStorage or mock data
  // In a real app, this would come from a backend API
  const { data: savedDestinations = [] } = useQuery<Destination[]>({
    queryKey: ["saved-destinations"],
    queryFn: async () => {
      // This would typically fetch saved destinations from backend
      // For now, return empty array - user can save items which will populate this
      return [];
    }
  });

  const { data: savedActivities = [] } = useQuery<Activity[]>({
    queryKey: ["saved-activities"], 
    queryFn: async () => {
      // This would typically fetch saved activities from backend
      return [];
    }
  });

  const categories = [
    { id: "all", name: "All" },
    { id: "popular", name: "Popular" },
    { id: "adventure", name: "Adventure" },
    { id: "beach", name: "Beach" },
    { id: "city", name: "City" },
    { id: "nature", name: "Nature" },
  ];

  const filteredDestinations = savedDestinations.filter(dest => {
    const matchesSearch = searchQuery === "" || 
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved Items</h1>
          <p className="text-lg text-gray-600">
            Your bookmarked destinations and activities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search saved items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="destinations" className="space-y-8">
          <TabsList className="grid w-full md:w-auto grid-cols-2">
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-purple-600 hover:bg-purple-700" : ""}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Saved Destinations */}
            {filteredDestinations.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved destinations yet</h3>
                <p className="text-gray-600 mb-6">
                  Start exploring and save destinations you love by clicking the heart icon
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explore Destinations
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onSelect={(dest) => console.log("Selected destination:", dest)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            {savedActivities.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved activities yet</h3>
                <p className="text-gray-600 mb-6">
                  Discover exciting activities and save your favorites for future trips
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explore Activities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {savedActivities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onSelect={(act) => console.log("Selected activity:", act)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}