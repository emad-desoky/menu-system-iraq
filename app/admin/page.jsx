import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Store, Eye, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "../login/actions";

async function getRestaurants(userId) {
  return await prisma.restaurant.findMany({
    where: { adminId: userId },
    include: {
      _count: {
        select: {
          menuItems: true,
          categories: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const restaurants = await getRestaurants(user.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage your restaurants</p>
            </div>
            <form action={logout}>
              <Button variant="outline" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Restaurants
            </h2>
            <p className="text-gray-600">
              Manage and monitor your restaurant network
            </p>
          </div>
          <Link href="/admin/restaurants/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Restaurant
            </Button>
          </Link>
        </div>

        {restaurants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No restaurants yet
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Get started by adding your first restaurant to the platform.
              </p>
              <Link href="/admin/restaurants/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Restaurant
                </Button>
              </Link>
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
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
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
                      <span className="text-gray-600">Subdomain:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {restaurant.slug}.yourdomain.com
                      </span>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Link
                        href={`/admin/restaurants/${restaurant.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/${restaurant.slug}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Store className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
