"use client";

import { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, LogOut, Eye } from "lucide-react";
import { logout } from "@/app/login/actions";

export default function RestaurantDashboard({ user }) {
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    const response = await fetch("/api/my-restaurant");
    const data = await response.json();
    setRestaurant(data.restaurant);
    setCategories(data.categories || []);
    setMenuItems(data.menuItems || []);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const categoryData = {
      name: formData.get("name"),
      description: formData.get("description"),
    };

    const url = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";

    const method = editingCategory ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoryData),
    });

    if (response.ok) {
      fetchRestaurantData();
      setShowAddCategory(false);
      setEditingCategory(null);
    }
  };

  const handleMenuItemSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const menuItemData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number.parseFloat(formData.get("price")),
      categoryId: formData.get("categoryId"),
      isAvailable: formData.get("isAvailable") === "true",
    };

    const url = editingMenuItem
      ? `/api/menu-items/${editingMenuItem.id}`
      : "/api/menu-items";

    const method = editingMenuItem ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuItemData),
    });

    if (response.ok) {
      fetchRestaurantData();
      setShowAddMenuItem(false);
      setEditingMenuItem(null);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      confirm(
        "Are you sure? This will also delete all menu items in this category."
      )
    ) {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRestaurantData();
      }
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRestaurantData();
      }
    }
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Restaurant Found</CardTitle>
            <CardDescription>
              You don't have a restaurant assigned yet. Please contact the
              administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-gray-600">Restaurant Dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `https://${restaurant.subdomain}.yourdomain.com`,
                  "_blank"
                )
              }
            >
              <Eye className="w-4 h-4 mr-2" />
              View Menu
            </Button>
            <Button onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>
                      Organize your menu items into categories
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddCategory(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showAddCategory || editingCategory ? (
                  <form
                    onSubmit={handleCategorySubmit}
                    className="space-y-4 mb-6 p-4 border rounded-lg"
                  >
                    <div>
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingCategory?.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingCategory?.description}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">
                        {editingCategory ? "Update" : "Create"} Category
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddCategory(false);
                          setEditingCategory(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : null}

                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>
                      Manage your menu items and pricing
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowAddMenuItem(true)}
                    disabled={categories.length === 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <p className="text-gray-500">
                    Please create at least one category before adding menu
                    items.
                  </p>
                ) : (
                  <>
                    {showAddMenuItem || editingMenuItem ? (
                      <form
                        onSubmit={handleMenuItemSubmit}
                        className="space-y-4 mb-6 p-4 border rounded-lg"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={editingMenuItem?.name}
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
                              defaultValue={editingMenuItem?.price}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={editingMenuItem?.description}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="categoryId">Category</Label>
                            <Select
                              name="categoryId"
                              defaultValue={editingMenuItem?.categoryId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
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
                            <Select
                              name="isAvailable"
                              defaultValue={
                                editingMenuItem?.isAvailable?.toString() ||
                                "true"
                              }
                            >
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
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">
                            {editingMenuItem ? "Update" : "Create"} Menu Item
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddMenuItem(false);
                              setEditingMenuItem(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : null}

                    <div className="space-y-4">
                      {menuItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              {item.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">${item.price}</Badge>
                              <Badge
                                variant={
                                  item.isAvailable ? "default" : "secondary"
                                }
                              >
                                {item.isAvailable
                                  ? "Available"
                                  : "Not Available"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMenuItem(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteMenuItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                      defaultValue={restaurant.description}
                      placeholder="Tell customers about your restaurant..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={restaurant.address}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={restaurant.phone}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={restaurant.email}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        defaultValue={restaurant.website}
                      />
                    </div>
                  </div>
                  <Button type="submit">Update Information</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Settings</CardTitle>
                <CardDescription>
                  Configure your restaurant settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Restaurant URL</Label>
                    <p className="text-sm text-gray-600">
                      Your menu is available at:{" "}
                      <strong>
                        https://{restaurant.subdomain}.yourdomain.com
                      </strong>
                    </p>
                  </div>
                  <div>
                    <Label>Dashboard Access</Label>
                    <p className="text-sm text-gray-600">
                      Dashboard URL:{" "}
                      <strong>
                        https://{restaurant.subdomain}.yourdomain.com/dashboard
                      </strong>
                    </p>
                    <p className="text-sm text-gray-500">Password: 123</p>
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
