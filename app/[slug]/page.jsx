import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Settings } from "lucide-react";
import Link from "next/link";

async function getRestaurant(slug) {
  return await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        include: {
          menuItems: {
            where: { isActive: true, isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export default async function RestaurantMenu({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              {restaurant.description && (
                <p className="text-lg text-gray-600 mb-4">
                  {restaurant.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {restaurant.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {restaurant.address}
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {restaurant.phone}
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {restaurant.email}
                  </div>
                )}
              </div>
            </div>
            <Link href={`/${slug}/dashboard`}>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {restaurant.categories.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Menu Coming Soon
              </h3>
              <p className="text-gray-600 text-center">
                This restaurant is still setting up their menu. Please check
                back later!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {restaurant.categories.map((category) => (
              <div key={category.id}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600">{category.description}</p>
                  )}
                </div>

                <div className="grid gap-4">
                  {category.menuItems.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.name}
                              </h3>
                              {!item.isAvailable && (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-gray-600 mb-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-bold text-gray-900">
                              ${item.price.toString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
