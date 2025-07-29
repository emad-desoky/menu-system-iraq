"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Mail, Globe, Lock } from "lucide-react";

export default function RestaurantMenu({ restaurant }) {
  const [showDashboardLogin, setShowDashboardLogin] = useState(false);
  const [password, setPassword] = useState("");

  const handleDashboardLogin = () => {
    if (password === "123") {
      window.location.href = "/dashboard";
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="text-gray-600 mt-1">{restaurant.description}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDashboardLogin(!showDashboardLogin)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>

          {showDashboardLogin && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-sm">
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleDashboardLogin()
                  }
                />
                <Button onClick={handleDashboardLogin}>Login</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <div className="space-y-8">
              {restaurant.categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {category.menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-start p-4 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              {!item.isAvailable && (
                                <Badge variant="secondary">Not Available</Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">
                              ${item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                      {category.menuItems.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No items available in this category.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {restaurant.categories.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <p className="text-gray-500">Menu coming soon...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About {restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {restaurant.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Our Story</h3>
                    <p className="text-gray-600">{restaurant.description}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      {restaurant.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span>{restaurant.address}</span>
                        </div>
                      )}
                      {restaurant.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{restaurant.phone}</span>
                        </div>
                      )}
                      {restaurant.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{restaurant.email}</span>
                        </div>
                      )}
                      {restaurant.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {restaurant.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
