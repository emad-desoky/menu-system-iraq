"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Store, Eye, LogOut, Trash2 } from "lucide-react";
import { logout, createRestaurant, deleteRestaurant } from "./actions";

export default function AdminDashboardClient({ user, restaurants }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage all restaurants in the system
              </p>
            </div>
            <form action={logout}>
              <Button variant="outline" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Restaurant</CardTitle>
              <CardDescription>
                Create a new restaurant in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={createRestaurant} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Amazing Restaurant"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Restaurant Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="slug">Subdomain Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="amazing-restaurant"
                    pattern="[a-z0-9-]+"
                    title="Only lowercase letters, numbers, and hyphens allowed"
                    required
                  />
                  <p className="text-xs text-gray-600">
                    This will be the subdomain: slug.yourdomain.com
                  </p>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Restaurant description..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="restaurant@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, State 12345"
                    rows={2}
                  />
                </div>
                <Button type="submit">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Restaurant
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            All Restaurants
          </h2>

          {restaurants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Store className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No restaurants yet
                </h3>
                <p className="text-gray-600 text-center">
                  Create your first restaurant using the form above.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {restaurant.name}
                      </CardTitle>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          restaurant.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {restaurant.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <CardDescription>{restaurant.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Menu Items:</span>
                        <span className="font-medium">
                          {restaurant._count.menuItems}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Categories:</span>
                        <span className="font-medium">
                          {restaurant._count.categories}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Password:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {restaurant.password}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Subdomain:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {restaurant.slug}.yourdomain.com
                        </span>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(`/${restaurant.slug}`, "_blank")
                          }
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Menu
                        </Button>
                        <form action={deleteRestaurant}>
                          <input
                            type="hidden"
                            name="restaurantId"
                            value={restaurant.id}
                          />
                          <Button size="sm" variant="destructive" type="submit">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
