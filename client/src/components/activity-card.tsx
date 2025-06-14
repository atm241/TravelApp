import { Card, CardContent } from "@/components/ui/card";
import type { Activity } from "@shared/schema";

interface ActivityCardProps {
  activity: Activity;
  onSelect?: (activity: Activity) => void;
}

export function ActivityCard({ activity, onSelect }: ActivityCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onSelect?.(activity)}
    >
      <CardContent className="p-4 text-center">
        <img 
          src={activity.imageUrl} 
          alt={activity.name}
          className="w-full h-24 object-cover rounded-lg mb-3"
        />
        <h4 className="font-semibold text-gray-900 mb-1">{activity.name}</h4>
        <p className="text-sm text-gray-500">
          {activity.experienceCount.toLocaleString()} experiences
        </p>
      </CardContent>
    </Card>
  );
}
