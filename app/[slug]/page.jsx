"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Settings, MenuIcon, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";
import Cart from "@/components/Cart";
import CartSidebar from "@/components/CartSidebar";
import MenuItemModal from "@/components/MenuItemModal";

export default function RestaurantMenu({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { slug } = await params;
        const response = await fetch(`/api/restaurant/${slug}`);
        if (!response.ok) {
          notFound();
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    notFound();
  }

  const bannerStyle = {
    backgroundColor: restaurant.bannerColor || "#ea580c",
    backgroundImage: restaurant.bannerImage
      ? `url(${restaurant.bannerImage})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const overlayStyle = restaurant.bannerImage
    ? {
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        filter: "brightness(0.75)",
      }
    : {};

  const filteredCategories = restaurant.categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMenuItems = selectedCategory
    ? selectedCategory.menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleItemClick = (item) => {
    setSelectedMenuItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="text-white sticky top-0 z-50 shadow-lg"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="w-full h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <MenuIcon className="w-6 h-6 mr-4 md:hidden" />
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${restaurant.name} logo`}
                    width={40}
                    height={40}
                    className="mr-3 rounded-lg"
                  />
                )}
                <h1 className="text-2xl font-bold">
                  {restaurant.name || "E-Menu"}
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a
                  href="#menu"
                  className="hover:text-orange-200 transition-colors"
                >
                  {t("menu")}
                </a>
                <Link
                  href={`/${restaurant.slug}/about`}
                  className="hover:text-orange-200 transition-colors"
                >
                  {t("about")}
                </Link>
                <a
                  href="#contact"
                  className="hover:text-orange-200 transition-colors"
                >
                  {t("contact")}
                </a>
              </nav>
              <div className="flex items-center gap-2">
                <LanguageToggle />
                <Link href={`/${restaurant.slug}/dashboard`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t("dashboard")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="relative h-96 flex items-center justify-center"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              {restaurant.description}
            </p>
          )}
        </div>
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
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("searchMenu")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedCategory && (
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
                className="whitespace-nowrap"
              >
                {t("showAllCategories")}
              </Button>
            )}
          </div>
        </div>

        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            {t("ourMenu")}
          </h2>

          {restaurant.categories.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("menuComingSoon")}
                </h3>
                <p className="text-gray-600">{t("menuComingSoonDesc")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {!selectedCategory ? (
                // Show Categories
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        {category.image ? (
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                            <div className="text-gray-400 text-center">
                              <MenuIcon className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm">{t("noImage")}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-600"
                        >
                          {category.menuItems.length} {t("items")}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Show Menu Items for Selected Category
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-3xl font-bold text-gray-900">
                      {selectedCategory.name}
                    </h3>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {filteredMenuItems.length} {t("items")}
                    </Badge>
                  </div>

                  <div
                    className={`grid gap-6 ${
                      isMobile ? "grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {filteredMenuItems.map((item) => {
                      const currentPrice = item.salePrice || item.price;
                      const hasDiscount =
                        item.salePrice &&
                        Number.parseFloat(item.salePrice) <
                          Number.parseFloat(item.price);

                      return (
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
                                  <MenuIcon className="w-8 h-8 mx-auto mb-1" />
                                  <p className="text-xs">{t("noImage")}</p>
                                </div>
                              </div>
                            )}
                            {hasDiscount && (
                              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                                {t("sale")}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                {item.name}
                              </h4>
                              <div className="text-right">
                                <span className="text-xl font-bold text-orange-600">
                                  ${Number.parseFloat(currentPrice).toFixed(2)}
                                </span>
                                {hasDiscount && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ${Number.parseFloat(item.price).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            </div>

                            {item.description && (
                              <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-1 mb-3">
                              {item.isVegetarian && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600 text-xs"
                                >
                                  {t("isVegetarian")}
                                </Badge>
                              )}
                              {item.isVegan && (
                                <Badge
                                  variant="outline"
                                  className="text-green-700 border-green-700 text-xs"
                                >
                                  {t("isVegan")}
                                </Badge>
                              )}
                              {item.isGlutenFree && (
                                <Badge
                                  variant="outline"
                                  className="text-blue-600 border-blue-600 text-xs"
                                >
                                  {t("isGlutenFree")}
                                </Badge>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleItemClick(item)}
                                className="flex-1 text-xs"
                              >
                                {t("viewDetails")}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-xs"
                                disabled={!item.isAvailable}
                              >
                                {t("addToCart")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">{restaurant.name}</h3>
              {restaurant.address && (
                <p className="text-gray-400 mb-2">{restaurant.address}</p>
              )}
              <div className="flex justify-center md:justify-start space-x-6 mt-6">
                <div className="text-sm text-gray-400">
                  © 2024 {restaurant.name}. {t("allRightsReserved")}
                </div>
              </div>
            </div>

            {/* Google Maps */}
            {restaurant.googleMapsUrl && (
              <div>
                <h4 className="text-lg font-semibold mb-4">{t("location")}</h4>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={restaurant.googleMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Cart and Modals */}
      <Cart />
      <CartSidebar />
      <MenuItemModal
        item={selectedMenuItem}
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
      />
    </div>
  );
}
