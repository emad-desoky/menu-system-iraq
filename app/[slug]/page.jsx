"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Settings,
  Search,
  ShoppingCart,
} from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const { t, isRTL, language } = useLanguage();
  const { addToCart, getTotalItems } = useCart();

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

  const getLocalizedText = (item, field) => {
    if (language === "ar") {
      return item[`${field}Ar`] || item[field] || "";
    }
    return item[`${field}En`] || item[field] || "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loadingMenu")}</p>
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

  // Filter items based on search and active tab
  const filteredCategories = restaurant.categories.filter((category) => {
    const categoryName = getLocalizedText(category, "name").toLowerCase();
    const matchesSearch = categoryName.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getAllMenuItems = () => {
    return restaurant.categories.flatMap((category) =>
      category.menuItems.map((item) => ({
        ...item,
        categoryName: getLocalizedText(category, "name"),
      }))
    );
  };

  const getFilteredItems = () => {
    let items = [];

    if (activeTab === "all") {
      items = getAllMenuItems();
    } else {
      const category = restaurant.categories.find(
        (cat) => cat.id === activeTab
      );
      if (category) {
        items = category.menuItems.map((item) => ({
          ...item,
          categoryName: getLocalizedText(category, "name"),
        }));
      }
    }

    if (searchTerm) {
      items = items.filter((item) => {
        const itemName = getLocalizedText(item, "name").toLowerCase();
        const itemDesc = getLocalizedText(item, "description").toLowerCase();
        return (
          itemName.includes(searchTerm.toLowerCase()) ||
          itemDesc.includes(searchTerm.toLowerCase())
        );
      });
    }

    return items;
  };

  const handleItemClick = (item) => {
    setSelectedMenuItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const totalCartItems = getTotalItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            {restaurant.logo && (
              <Image
                src={restaurant.logo || "/placeholder.svg"}
                alt={`${getLocalizedText(restaurant, "name")} logo`}
                width={32}
                height={32}
                className="mr-2 rounded"
              />
            )}
            <h1 className="text-lg font-bold text-gray-900">
              {getLocalizedText(restaurant, "name")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            {totalCartItems > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => {
                  const cartContext = document.querySelector(
                    "[data-cart-trigger]"
                  );
                  if (cartContext) cartContext.click();
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-600">
                  {totalCartItems}
                </Badge>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className="hidden md:block text-white sticky top-0 z-50 shadow-lg"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="w-full h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${getLocalizedText(restaurant, "name")} logo`}
                    width={40}
                    height={40}
                    className="mr-3 rounded-lg"
                  />
                )}
                <h1 className="text-2xl font-bold">
                  {getLocalizedText(restaurant, "name")}
                </h1>
              </div>
              <nav className="flex space-x-8">
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
                <Link href={`/${restaurant.slug}/dashboard/manage`}>
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

      {/* Hero Section - Desktop Only */}
      <div
        className="hidden md:block relative h-80 flex items-center justify-center"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">
            {getLocalizedText(restaurant, "name")}
          </h1>
          {getLocalizedText(restaurant, "description") && (
            <p className="text-xl opacity-90 max-w-2xl mx-auto px-4">
              {getLocalizedText(restaurant, "description")}
            </p>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {getLocalizedText(restaurant, "address") && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span className="truncate">
                  {getLocalizedText(restaurant, "address")}
                </span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("searchMenu")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Menu Section */}
        <section id="menu" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-8 h-auto p-1 bg-gray-100">
                <TabsTrigger
                  value="all"
                  className="px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  {t("all")}
                </TabsTrigger>
                {restaurant.categories.slice(0, 4).map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white truncate"
                  >
                    {getLocalizedText(category, "name")}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {getFilteredItems().map((item) => {
                    const currentPrice = item.salePrice || item.price;
                    const hasDiscount =
                      item.salePrice &&
                      Number.parseFloat(item.salePrice) <
                        Number.parseFloat(item.price);

                    return (
                      <Card
                        key={item.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="aspect-square bg-gray-200 relative overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={
                                item.imageAlt || getLocalizedText(item, "name")
                              }
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                              <div className="text-gray-400 text-center">
                                <div className="w-8 h-8 mx-auto mb-1 bg-gray-300 rounded"></div>
                                <p className="text-xs">{t("noImage")}</p>
                              </div>
                            </div>
                          )}
                          {hasDiscount && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                              {t("sale")}
                            </Badge>
                          )}
                          {!item.isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <Badge
                                variant="secondary"
                                className="bg-gray-800 text-white"
                              >
                                {t("notAvailable")}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3 md:p-4">
                          <h4 className="font-semibold text-gray-900 line-clamp-1 text-sm md:text-base mb-1">
                            {getLocalizedText(item, "name")}
                          </h4>

                          {getLocalizedText(item, "description") && (
                            <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-2">
                              {getLocalizedText(item, "description")}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-lg font-bold text-orange-600">
                                ${Number.parseFloat(currentPrice).toFixed(2)}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${Number.parseFloat(item.price).toFixed(2)}
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item);
                              }}
                              className="bg-orange-600 hover:bg-orange-700 text-xs px-3 py-1"
                              disabled={!item.isAvailable}
                            >
                              {t("addToCart")}
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.isVegetarian && (
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600 text-xs"
                              >
                                {t("vegetarian")}
                              </Badge>
                            )}
                            {item.isVegan && (
                              <Badge
                                variant="outline"
                                className="text-green-700 border-green-700 text-xs"
                              >
                                {t("vegan")}
                              </Badge>
                            )}
                            {item.isGlutenFree && (
                              <Badge
                                variant="outline"
                                className="text-blue-600 border-blue-600 text-xs"
                              >
                                {t("glutenFree")}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {getFilteredItems().length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">{t("noItemsFound")}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Restaurant Info */}
            <div>
              <div className="flex items-center mb-4">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${getLocalizedText(restaurant, "name")} logo`}
                    width={40}
                    height={40}
                    className="mr-3 rounded-lg"
                  />
                )}
                <h3 className="text-xl font-bold">
                  {getLocalizedText(restaurant, "name")}
                </h3>
              </div>
              {getLocalizedText(restaurant, "description") && (
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {getLocalizedText(restaurant, "description")}
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("contactInfo")}</h4>
              <div className="space-y-3">
                {getLocalizedText(restaurant, "address") && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-400">
                      {getLocalizedText(restaurant, "address")}
                    </p>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-gray-400">{restaurant.phone}</p>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-gray-400">{restaurant.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#menu"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("menu")}
                  </a>
                </li>
                <li>
                  <Link
                    href={`/${restaurant.slug}/about`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${restaurant.slug}/dashboard/manage`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t("dashboard")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 {getLocalizedText(restaurant, "name")}.{" "}
              {t("allRightsReserved")}
            </p>
            <LanguageToggle />
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
