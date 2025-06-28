import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/header";
import { TripPlanner } from "@/components/trip-planner";
import { TripMap } from "@/components/trip-map";
import { AIRecommendationsPanel } from "@/components/ai-recommendations-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Share2, Edit, Map, List, Sparkles } from "lucide-react";
import { Link } from "wouter";
import type { Trip, TripItem } from "@shared";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function TripDetail() {
  const [, params] = useRoute("/trips/:id");
  const tripId = params?.id ? parseInt(params.id) : 0;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trip, isLoading: tripLoading } = useQuery<Trip>({
    queryKey: ["/api/trips", tripId],
    enabled: !!tripId,
  });

  const { data: tripItems = [], isLoading: itemsLoading } = useQuery<TripItem[]>({
    queryKey: ["/api/trips", tripId, "items"],
    enabled: !!tripId,
  });

  const addItemMutation = useMutation({
    mutationFn: async (itemData: Omit<TripItem, 'id'>) => {
      const response = await apiRequest("POST", `/api/trips/${tripId}/items`, itemData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "items"] });
      toast({
        title: "Success",
        description: "Activity added to your trip!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TripItem> }) => {
      const response = await apiRequest("PUT", `/api/trip-items/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "items"] });
      toast({
        title: "Success",
        description: "Activity updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/trip-items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "items"] });
      toast({
        title: "Success",
        description: "Activity removed from your trip!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove activity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddItem = (itemData: Omit<TripItem, 'id'>) => {
    addItemMutation.mutate(itemData);
  };

  const handleUpdateItem = (id: number, data: Partial<TripItem>) => {
    updateItemMutation.mutate({ id, data });
  };

  const handleDeleteItem = (id: number) => {
    deleteItemMutation.mutate(id);
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: trip?.title,
        text: `Check out my trip to ${trip?.destination}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Trip link copied to clipboard!",
      });
    }
  };

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h2>
            <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
            <Link href="/trips">
              <Button>Back to My Trips</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/trips">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My Trips
          </Button>
        </Link>

        {/* Trip Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                  {trip.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {trip.destination}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {(() => {
                      try {
                        if (trip.startDate && trip.endDate) {
                          const startDate = new Date(trip.startDate);
                          const endDate = new Date(trip.endDate);
                          
                          // Check if dates are valid
                          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                            console.error('Invalid dates:', { startDate: trip.startDate, endDate: trip.endDate });
                            return "Invalid date format";
                          }
                          
                          return `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`;
                        }
                        return "Date not available";
                      } catch (error) {
                        console.error('Date formatting error:', error, { startDate: trip.startDate, endDate: trip.endDate });
                        return "Date formatting error";
                      }
                    })()}
                  </div>
                  <Badge variant={trip.isPublic ? "default" : "secondary"}>
                    {trip.isPublic ? "Public" : "Private"}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleShareTrip}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Trip
                </Button>
              </div>
            </div>
            
            {trip.description && (
              <CardContent className="px-0 pb-0">
                <p className="text-gray-600 mt-4">{trip.description}</p>
              </CardContent>
            )}
          </CardHeader>
        </Card>

        {/* Trip Content with Tabs */}
        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="itinerary" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map & Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary">
            <TripPlanner
              tripId={tripId}
              tripItems={tripItems}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          </TabsContent>

          <TabsContent value="ai-recommendations">
            <AIRecommendationsPanel
              tripId={tripId}
              onAddRecommendation={(title, description, type) => {
                const newItem = {
                  tripId: tripId,
                  title: title,
                  description: description,
                  day: Math.max(...tripItems.map(ti => ti.day), 0) + 1,
                  time: "",
                  order: 1,
                  type: type
                };
                handleAddItem(newItem);
              }}
            />
          </TabsContent>

          <TabsContent value="map">
            <TripMap
              destination={trip?.destination || ""}
              tripItems={tripItems}
              onAddRecommendation={(item) => {
                // Convert recommendation to trip item
                const newItem = {
                  tripId: tripId,
                  title: item.name || item.title,
                  description: item.description,
                  day: Math.max(...tripItems.map(ti => ti.day), 0) + 1,
                  time: "",
                  order: 1,
                  type: "activity"
                };
                handleAddItem(newItem);
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
