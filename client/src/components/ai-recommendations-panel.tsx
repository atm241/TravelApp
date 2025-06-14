import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, MapPin, Utensils, Camera, Lightbulb } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface AIRecommendationsProps {
  tripId: number;
  onAddRecommendation?: (title: string, description: string, type: string) => void;
}

interface TripRecommendation {
  activities: string[];
  attractions: string[];
  restaurants: string[];
  tips: string[];
}

export function AIRecommendationsPanel({ tripId, onAddRecommendation }: AIRecommendationsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: recommendations, isLoading, refetch } = useQuery<TripRecommendation>({
    queryKey: ["ai-recommendations", tripId],
    queryFn: async () => {
      const response = await apiRequest("POST", `/api/trips/${tripId}/ai-recommendations`);
      return response.json();
    },
    enabled: false, // Don't auto-fetch, wait for user to request
  });

  const handleGenerateRecommendations = async () => {
    setIsGenerating(true);
    try {
      await refetch();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToItinerary = (item: string, type: string) => {
    onAddRecommendation?.(item, `AI recommended ${type}`, "activity");
  };

  if (!recommendations && !isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Trip Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 text-purple-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get Personalized Recommendations
            </h3>
            <p className="text-gray-600 mb-6">
              Let AI analyze your trip details and suggest activities, attractions, and dining options tailored to your preferences.
            </p>
            <Button 
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate AI Recommendations"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" />
            Generating AI Recommendations...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">
              AI is analyzing your trip details to create personalized recommendations...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateRecommendations}
            disabled={isGenerating}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activities" className="text-xs">
              <Camera className="w-3 h-3 mr-1" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="attractions" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              Attractions
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="text-xs">
              <Utensils className="w-3 h-3 mr-1" />
              Dining
            </TabsTrigger>
            <TabsTrigger value="tips" className="text-xs">
              <Lightbulb className="w-3 h-3 mr-1" />
              Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-2">
            {recommendations?.activities?.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{activity}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Activity</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAddToItinerary(activity, "activity")}
                  className="ml-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="attractions" className="space-y-2">
            {recommendations?.attractions?.map((attraction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{attraction}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Attraction</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAddToItinerary(attraction, "attraction")}
                  className="ml-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-2">
            {recommendations?.restaurants?.map((restaurant, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{restaurant}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Dining</Badge>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAddToItinerary(restaurant, "restaurant")}
                  className="ml-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="tips" className="space-y-2">
            {recommendations?.tips?.map((tip, index) => (
              <div key={index} className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">{tip}</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}