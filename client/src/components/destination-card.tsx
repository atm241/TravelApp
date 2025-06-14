import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Destination } from "@shared/schema";
import { useState } from "react";

interface DestinationCardProps {
  destination: Destination;
  onSelect?: (destination: Destination) => void;
}

export function DestinationCard({ destination, onSelect }: DestinationCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toLocaleString()}`;
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
      onClick={() => onSelect?.(destination)}
    >
      <div className="relative">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-md rounded-full p-2"
          onClick={handleSaveToggle}
        >
          <Heart 
            className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </Button>
        <Badge 
          variant="secondary" 
          className="absolute top-4 left-4 bg-white/90 text-gray-700"
        >
          {destination.category}
        </Badge>
      </div>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
            <span>{destination.rating} ({destination.reviewCount.toLocaleString()} reviews)</span>
          </div>
          <div className="text-purple-600 font-semibold">
            From {formatPrice(destination.priceFrom)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
