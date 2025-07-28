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
import { Plus, Store, Eye, LogOut, Trash2, Users } from "lucide-react";
import { logout, createRestaurant, deleteRestaurant } from "./actions";

export default function AdminDashboardClient({ restaurants }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Manage all restaurants in the system
                </p>
              </div>
            </div>
            <form action={logout}>
              <Button
                variant="outline"
                type="submit"
                className="border-gray-300 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Restaurant Form */}
        <Card className="mb-8 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="text-xl text-orange-800 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Restaurant
            </CardTitle>
            <CardDescription>
              Create a new restaurant in the system with all necessary details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createRestaurant} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Restaurant Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Amazing Restaurant"
                    required
                    className="mt-1"
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
                    className="mt-1"
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
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 mt-1">
                  This will be the subdomain: slug.yourdomain.com
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the restaurant..."
                  className="mt-1"
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
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
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Restaurant
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Restaurants List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              All Restaurants ({restaurants.length})
            </h2>
          </div>

          {restaurants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Store className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No restaurants yet
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  Create your first restaurant using the form above to get
                  started with the platform.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="hover:shadow-lg transition-all duration-200 border-0 shadow-md"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-900">
                        {restaurant.name}
                      </CardTitle>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          restaurant.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {restaurant.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                    {restaurant.description && (
                      <CardDescription className="line-clamp-2">
                        {restaurant.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Menu Items:</span>
                        <span className="font-medium">
                          {restaurant._count.menuItems}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categories:</span>
                        <span className="font-medium">
                          {restaurant._count.categories}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Password:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                          {restaurant.password}
                        </code>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">URL:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs break-all">
                          {restaurant.slug}.yourdomain.com
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
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
