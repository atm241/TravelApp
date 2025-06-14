import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, MapPin, Users, Trash2, Edit, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTripSchema } from "@shared/schema";
import type { Trip, Activity } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Link } from "wouter";

type TripFormData = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string; 
  description?: string;
  isPublic: boolean;
  userId: number;
};

export default function Trips() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trips = [], isLoading } = useQuery<Trip[]>({
    queryKey: ["/api/trips", 1], // Using userId = 1 for demo
  });

  const createTripMutation = useMutation({
    mutationFn: async (tripData: TripFormData) => {
      const response = await apiRequest("POST", "/api/trips", tripData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      setIsCreateDialogOpen(false);
      reset();
      toast({
        title: "Success",
        description: "Trip created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: async (tripId: number) => {
      await apiRequest("DELETE", `/api/trips/${tripId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({
        title: "Success",
        description: "Trip deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete trip. Please try again.",
        variant: "destructive", 
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(insertTripSchema),
    defaultValues: {
      userId: 1, // Demo user ID
      isPublic: false,
    },
  });

  const onSubmit = (data: TripFormData) => {
    createTripMutation.mutate(data);
  };

  const handleDeleteTrip = (tripId: number) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTripMutation.mutate(tripId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-lg text-gray-600">
              Manage and organize your travel plans
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Trip Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Vacation in Europe"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    {...register("destination")}
                  />
                  {errors.destination && (
                    <p className="text-sm text-red-600 mt-1">{errors.destination.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...register("endDate")}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-600 mt-1">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your trip..."
                    {...register("description")}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublic"
                    {...register("isPublic")}
                  />
                  <Label htmlFor="isPublic">Make this trip public</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isSubmitting ? "Creating..." : "Create Trip"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first trip to start planning your adventure
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg line-clamp-2">{trip.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {trip.destination}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {format(new Date(trip.startDate), "MMM dd")} - {format(new Date(trip.endDate), "MMM dd, yyyy")}
                    </div>

                    {trip.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        {trip.isPublic ? "Public" : "Private"}
                      </div>
                      
                      <Link href={`/trips/${trip.id}`}>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
