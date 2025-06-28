import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { DestinationCard } from "@/components/destination-card";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Grid, List } from "lucide-react";
import type { Destination } from "@shared";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations", selectedCategory, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory);  
      }
      if (searchQuery) {
        params.append("search", searchQuery);
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
    { id: "all", name: "All Destinations" },
    { id: "popular", name: "Popular" },
    { id: "adventure", name: "Adventure" },
    { id: "beach", name: "Beach" },
    { id: "city", name: "City" },
    { id: "nature", name: "Nature" },
  ];

  const handleSearch = () => {
    // Search is handled automatically by the query dependency
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Explore Destinations</h1>
          <p className="text-lg text-gray-600">
            Discover amazing places around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
              </Button>
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

            {/* Destinations Grid */}
            {destinationsLoading ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80" />
                ))}
              </div>
            ) : destinations.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No destinations found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or browse different categories
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {destinations.map((destination) => (
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
            {activitiesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {activities.map((activity) => (
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
