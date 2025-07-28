import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Settings, MenuIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <MenuIcon className="w-6 h-6 mr-4 md:hidden" />
              <h1 className="text-2xl font-bold">E-Menu</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#menu"
                className="hover:text-orange-200 transition-colors"
              >
                Menu
              </a>
              <a
                href="#about"
                className="hover:text-orange-200 transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                className="hover:text-orange-200 transition-colors"
              >
                Contact
              </a>
            </nav>
            <Link href={`/${slug}/dashboard`}>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
              >
                <Settings className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              {restaurant.description}
            </p>
          )}
        </div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            {restaurant.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                {restaurant.address}
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" />
                {restaurant.phone}
              </div>
            )}
            {restaurant.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" />
                {restaurant.email}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Menu
          </h2>

          {restaurant.categories.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Menu Coming Soon
                </h3>
                <p className="text-gray-600">
                  We're preparing something amazing for you. Please check back
                  later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {restaurant.categories.map((category) => (
                <div key={category.id} className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-lg">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {category.menuItems.map((item) => (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="aspect-video bg-gray-200 relative">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.imageAlt || item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-gray-400 text-center">
                                <MenuIcon className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">No image</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="text-xl font-semibold text-gray-900">
                              {item.name}
                            </h4>
                            <span className="text-2xl font-bold text-orange-600">
                              ${item.price.toString()}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {item.isVegetarian && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Vegetarian
                              </Badge>
                            )}
                            {item.isVegan && (
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-700"
                              >
                                Vegan
                              </Badge>
                            )}
                            {item.isGlutenFree && (
                              <Badge
                                variant="outline"
                                className="text-blue-600 border-blue-600"
                              >
                                Gluten Free
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section id="about" className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            About Us
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            {restaurant.aboutStory && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  Our Story
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {restaurant.aboutStory}
                </p>
              </Card>
            )}

            {restaurant.aboutMission && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  Our Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {restaurant.aboutMission}
                </p>
              </Card>
            )}

            {restaurant.aboutVision && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  Our Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {restaurant.aboutVision}
                </p>
              </Card>
            )}

            {restaurant.aboutChef && (
              <Card className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-orange-600">
                  Our Chef
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {restaurant.aboutChef}
                </p>
              </Card>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{restaurant.name}</h3>
            {restaurant.address && (
              <p className="text-gray-400 mb-2">{restaurant.address}</p>
            )}
            <div className="flex justify-center space-x-6 mt-6">
              <div className="text-sm text-gray-400">
                © 2024 {restaurant.name}. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
