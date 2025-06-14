import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Star, DollarSign } from "lucide-react";
import type { Destination, Activity, TripItem } from "@shared/schema";

interface TripMapProps {
  destination: string;
  tripItems?: TripItem[];
  onAddRecommendation?: (item: any) => void;
}

export function TripMap({ destination, tripItems = [], onAddRecommendation }: TripMapProps) {
  const [recommendations, setRecommendations] = useState<(Destination | Activity)[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  // Mock map data - in a real app this would use Google Maps, Mapbox, etc.
  const mockMapData = {
    center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
    zoom: 12,
    markers: [
      {
        id: 1,
        lat: 40.7589,
        lng: -73.9851,
        title: "Times Square",
        type: "attraction",
        description: "Iconic commercial intersection and tourist destination",
        rating: 4.2,
        price: "$$$"
      },
      {
        id: 2,
        lat: 40.7505,
        lng: -73.9934,
        title: "Empire State Building",
        type: "landmark",
        description: "Art Deco skyscraper with observation decks",
        rating: 4.5,
        price: "$$$$"
      },
      {
        id: 3,
        lat: 40.7794,
        lng: -73.9632,
        title: "Central Park",
        type: "park",
        description: "Large urban park with lakes, meadows, and walking paths",
        rating: 4.7,
        price: "Free"
      },
      {
        id: 4,
        lat: 40.7614,
        lng: -73.9776,
        title: "Broadway Theater District",
        type: "entertainment",
        description: "Home to world-famous theaters and shows",
        rating: 4.6,
        price: "$$$$"
      }
    ]
  };

  useEffect(() => {
    // Mock recommendations based on destination
    const mockRecommendations = [
      {
        id: 101,
        name: "Statue of Liberty",
        description: "Iconic symbol of freedom and democracy",
        imageUrl: "https://images.unsplash.com/photo-1569982175971-d92b01cf8694?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "landmark",
        rating: 4.8,
        reviewCount: 15000,
        priceFrom: 2500
      },
      {
        id: 102,
        name: "Brooklyn Bridge",
        description: "Historic suspension bridge with stunning views",
        imageUrl: "https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "landmark",
        rating: 4.6,
        reviewCount: 8900,
        priceFrom: 0
      },
      {
        id: 103,
        name: "Food Walking Tour",
        description: "Explore NYC's diverse culinary scene",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        category: "food",
        experienceCount: 1200
      }
    ];
    setRecommendations(mockRecommendations);
  }, [destination]);

  const formatPrice = (priceInCents: number) => {
    if (priceInCents === 0) return "Free";
    return `$${(priceInCents / 100).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              Trip Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock Map - In a real app, this would be Google Maps/Mapbox */}
            <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
                  <p className="text-gray-500 mb-4">
                    Explore {destination} and discover nearby attractions
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {mockMapData.markers.map((marker) => (
                      <Button
                        key={marker.id}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMarker(marker)}
                        className={`${
                          selectedMarker?.id === marker.id
                            ? 'bg-purple-100 border-purple-300'
                            : 'bg-white'
                        }`}
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {marker.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Selected Marker Info */}
              {selectedMarker && (
                <div className="absolute bottom-4 left-4 right-4">
                  <Card className="shadow-lg">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{selectedMarker.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{selectedMarker.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{selectedMarker.type}</Badge>
                          <div className="flex items-center text-sm">
                            <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                            {selectedMarker.rating}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => onAddRecommendation?.(selectedMarker)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Trip
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">{item.category}</Badge>
                  {'rating' in item ? (
                    <div className="flex items-center text-sm">
                      <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                      {item.rating} ({item.reviewCount?.toLocaleString()})
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      {item.experienceCount?.toLocaleString()} experiences
                    </div>
                  )}
                </div>

                {'priceFrom' in item && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-purple-600 font-medium">
                      From {formatPrice(item.priceFrom)}
                    </span>
                  </div>
                )}

                <Button
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => onAddRecommendation?.(item)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add to Itinerary
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trip Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trip Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Activities</span>
              <span className="font-semibold">{tripItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Planned</span>
              <span className="font-semibold">
                {Math.max(...tripItems.map(item => item.day), 0) || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Budget</span>
              <span className="font-semibold text-purple-600">$1,200 - $2,500</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}