import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, X, MapPin, Clock } from "lucide-react";
import type { TripItem } from "@shared/schema";

interface TripPlannerProps {
  tripId?: number;
  tripItems?: TripItem[];
  onAddItem?: (item: Omit<TripItem, 'id'>) => void;
  onUpdateItem?: (id: number, item: Partial<TripItem>) => void;
  onDeleteItem?: (id: number) => void;
}

export function TripPlanner({ 
  tripId, 
  tripItems = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem 
}: TripPlannerProps) {
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    day: 1,
    time: "",
    endTime: "",
    type: "activity"
  });

  const handleAddItem = () => {
    if (!newItem.title.trim()) return;
    
    const order = tripItems.filter(item => item.day === newItem.day).length + 1;
    
    onAddItem?.({
      ...newItem,
      tripId: tripId || 1,
      order
    });
    
    setNewItem({
      title: "",
      description: "",
      day: 1,
      time: "",
      endTime: "",
      type: "activity"
    });
  };

  const groupedItems = tripItems.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, TripItem[]>);

  const maxDay = Math.max(...Object.keys(groupedItems).map(Number), 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Trip Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new item form */}
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-dashed border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                placeholder="Activity title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Day"
                  value={newItem.day}
                  onChange={(e) => setNewItem({ ...newItem, day: parseInt(e.target.value) || 1 })}
                  className="w-20"
                />
                <Input
                  type="time"
                  placeholder="Start time"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  className="flex-1"
                />
                <Input
                  type="time"
                  placeholder="End time (optional)"
                  value={newItem.endTime}
                  onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <Textarea
              placeholder="Description (optional)"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="mb-4"
            />
            <Button onClick={handleAddItem} className="w-full bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>

          {/* Trip items by day */}
          {Array.from({ length: Math.max(maxDay, 1) }, (_, i) => i + 1).map(day => (
            <div key={day} className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1">
                  Day {day}
                </Badge>
              </div>
              
              <div className="space-y-3 ml-4">
                {groupedItems[day]?.map((item, index) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{item.title}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteItem?.(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-purple-600">
                            <span className="font-medium">Day {item.day}</span>
                            {(item.time || item.endTime) && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.time && item.endTime 
                                  ? `${item.time} - ${item.endTime}`
                                  : item.time || `Until ${item.endTime}`
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {!groupedItems[day]?.length && (
                  <div className="text-center py-8 text-gray-500">
                    No activities planned for Day {day}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
