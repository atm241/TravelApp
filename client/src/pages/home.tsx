import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { DestinationCard } from "@/components/destination-card";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, MapPin, Calendar, Flame, Mountain, Umbrella, Building, Trees, Check, ChevronsUpDown, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Destination, Activity } from "@shared";

// Popular cities for autocomplete
const popularCities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "London, UK", "Paris, France", "Tokyo, Japan", "Sydney, Australia", "Rome, Italy",
  "Barcelona, Spain", "Amsterdam, Netherlands", "Berlin, Germany", "Dubai, UAE",
  "Singapore", "Bangkok, Thailand", "Istanbul, Turkey", "Mumbai, India", "Seoul, South Korea",
  "Mexico City, Mexico", "Buenos Aires, Argentina", "São Paulo, Brazil", "Cairo, Egypt",
  "Marrakech, Morocco", "Cape Town, South Africa", "Bali, Indonesia", "Santorini, Greece"
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("popular");
  const [searchDestination, setSearchDestination] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState(popularCities);

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
    console.log("Searching for:", searchDestination, "from:", arrivalDate, "to:", departureDate);
    // You can add navigation logic here, for example:
    // navigate(`/explore?destination=${encodeURIComponent(searchDestination)}&arrival=${arrivalDate}&departure=${departureDate}`);
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
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* City Autocomplete */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Where to?
                    </label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className="w-full justify-between px-4 py-3 h-12 text-left text-gray-900"
                        >
                          {searchDestination || "Choose destination..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput 
                            placeholder="Search cities..." 
                            onValueChange={(value) => {
                              const filtered = popularCities.filter(city => 
                                city.toLowerCase().includes(value.toLowerCase())
                              );
                              setFilteredCities(filtered);
                            }}
                          />
                          <CommandEmpty>No cities found.</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {filteredCities.slice(0, 8).map((city) => (
                                <CommandItem
                                  key={city}
                                  value={city}
                                  onSelect={(currentValue) => {
                                    setSearchDestination(currentValue === searchDestination ? "" : currentValue);
                                    setCityOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      searchDestination === city ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {city}
                                </CommandItem>
                              ))}
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Arrival Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Plane className="w-4 h-4 inline mr-1" />
                      Arrival
                    </label>
                    <Input
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      className="w-full px-4 py-3 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                  
                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Plane className="w-4 h-4 inline mr-1 rotate-45" />
                      Departure
                    </label>
                    <Input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={arrivalDate} // Departure can't be before arrival
                      className="w-full px-4 py-3 h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                </div>
                
                {/* Search Button */}
                <div className="mt-4 text-center">
                  <Button 
                    onClick={handleExploreSearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-3 text-lg"
                    disabled={!searchDestination || !arrivalDate || !departureDate}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Trips
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
