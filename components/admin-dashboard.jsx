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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";

export default function AdminDashboard({ user }) {
  const [restaurants, setRestaurants] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const response = await fetch("/api/restaurants");
    const data = await response.json();
    setRestaurants(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const restaurantData = {
      name: formData.get("name"),
      subdomain: formData.get("subdomain"),
      description: formData.get("description"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      website: formData.get("website"),
    };

    const url = editingRestaurant
      ? `/api/restaurants/${editingRestaurant.id}`
      : "/api/restaurants";

    const method = editingRestaurant ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(restaurantData),
    });

    if (response.ok) {
      fetchRestaurants();
      setShowAddForm(false);
      setEditingRestaurant(null);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this restaurant?")) {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRestaurants();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">
              Manage restaurants and system settings
            </p>
          </div>
          <Button onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Restaurants</CardTitle>
                  <CardDescription>
                    Manage all restaurants in the system
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Restaurant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showAddForm || editingRestaurant ? (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 mb-6 p-4 border rounded-lg"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Restaurant Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingRestaurant?.name}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subdomain">Subdomain</Label>
                      <Input
                        id="subdomain"
                        name="subdomain"
                        defaultValue={editingRestaurant?.subdomain}
                        placeholder="restaurant-name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingRestaurant?.description}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={editingRestaurant?.email}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={editingRestaurant?.phone}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={editingRestaurant?.address}
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        defaultValue={editingRestaurant?.website}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">
                      {editingRestaurant ? "Update" : "Create"} Restaurant
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingRestaurant(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : null}

              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{restaurant.name}</h3>
                      <p className="text-sm text-gray-600">
                        {restaurant.subdomain}.yourdomain.com
                      </p>
                      <p className="text-sm text-gray-500">
                        {restaurant.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant={
                            restaurant.isActive ? "default" : "secondary"
                          }
                        >
                          {restaurant.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingRestaurant(restaurant)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(restaurant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
