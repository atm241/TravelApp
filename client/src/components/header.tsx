import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { MapPin, Search, Plus, User, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { insertTripSchema, type Trip } from "@shared";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Explore", href: "/" },
    { name: "My Trips", href: "/trips" },
    { name: "Saved", href: "/saved" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <MapPin className="text-purple-600 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900">TravelPlanner</span>
            </Link>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location === item.href
                        ? "text-purple-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-medium">
              <Plus className="w-4 h-4 mr-2" />
              New Trip
            </Button>
            
            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
              <User className="text-purple-600 w-4 h-4" />
            </div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location === item.href
                          ? "text-purple-600 bg-purple-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6">
                  <Input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
