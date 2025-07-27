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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, LogOut, ExternalLink } from "lucide-react";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  logout,
} from "./actions";

export default function RestaurantDashboardClient({ restaurant }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <p className="text-gray-600">Restaurant Management Dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/${restaurant.slug}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Menu Website
              </Button>
              <form action={logout}>
                <Button variant="outline" type="submit">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Menu Categories</CardTitle>
                <CardDescription>
                  Organize your menu into categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form
                  action={createCategory}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <input
                    type="hidden"
                    name="restaurantId"
                    value={restaurant.id}
                  />
                  <h3 className="font-semibold">Add New Category</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Appetizers"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sortOrder">Sort Order</Label>
                      <Input
                        id="sortOrder"
                        name="sortOrder"
                        type="number"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Category description..."
                    />
                  </div>
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </form>

                <div className="space-y-4">
                  {restaurant.categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          {category.description}
                        </p>
                        <Badge variant="outline" className="mt-2">
                          {category.menuItems.length} items
                        </Badge>
                      </div>
                      <form action={deleteCategory}>
                        <input
                          type="hidden"
                          name="categoryId"
                          value={category.id}
                        />
                        <Button size="sm" variant="destructive" type="submit">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu-items">
            <Card>
              <CardHeader>
                <CardTitle>Menu Items</CardTitle>
                <CardDescription>
                  Manage your menu items and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {restaurant.categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Please create at least one category before adding menu
                    items.
                  </p>
                ) : (
                  <>
                    <form
                      action={createMenuItem}
                      className="p-4 border rounded-lg space-y-4"
                    >
                      <input
                        type="hidden"
                        name="restaurantId"
                        value={restaurant.id}
                      />
                      <h3 className="font-semibold">Add New Menu Item</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Grilled Chicken"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="19.99"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Item description..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="categoryId">Category</Label>
                          <Select name="categoryId" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {restaurant.categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="isAvailable">Availability</Label>
                          <Select name="isAvailable" defaultValue="true">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Available</SelectItem>
                              <SelectItem value="false">
                                Not Available
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="sortOrder">Sort Order</Label>
                          <Input
                            id="sortOrder"
                            name="sortOrder"
                            type="number"
                            defaultValue="0"
                          />
                        </div>
                      </div>
                      <Button type="submit">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Menu Item
                      </Button>
                    </form>

                    <div className="space-y-4">
                      {restaurant.categories.map((category) => (
                        <div key={category.id}>
                          <h3 className="font-semibold text-lg mb-3">
                            {category.name}
                          </h3>
                          <div className="space-y-2 ml-4">
                            {category.menuItems.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 border rounded"
                              >
                                <div>
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {item.description}
                                  </p>
                                  <div className="flex gap-2 mt-1">
                                    <Badge variant="outline">
                                      ${item.price.toString()}
                                    </Badge>
                                    <Badge
                                      variant={
                                        item.isAvailable
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {item.isAvailable
                                        ? "Available"
                                        : "Not Available"}
                                    </Badge>
                                  </div>
                                </div>
                                <form action={deleteMenuItem}>
                                  <input
                                    type="hidden"
                                    name="menuItemId"
                                    value={item.id}
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    type="submit"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </form>
                              </div>
                            ))}
                            {category.menuItems.length === 0 && (
                              <p className="text-gray-500 text-sm">
                                No items in this category yet.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About Us</CardTitle>
                <CardDescription>
                  Update your restaurant information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={restaurant.description || ""}
                      placeholder="Tell customers about your restaurant..."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={restaurant.address || ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={restaurant.phone || ""}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={restaurant.email || ""}
                    />
                  </div>
                  <Button type="submit">Update Information</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
