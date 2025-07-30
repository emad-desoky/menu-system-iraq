"use client";
import { useState, useEffect, useRef } from "react";
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
  Facebook,
  Instagram,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";
import Cart from "@/components/Cart";
import CartSidebar from "@/components/CartSidebar";
import MenuItemModal from "@/components/MenuItemModal";
import RestaurantRating from "@/components/RestaurantRating";

export default function RestaurantMenu({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef(null);
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

  useEffect(() => {
    const checkScrollButtons = () => {
      if (tabsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    if (tabsRef.current) {
      checkScrollButtons();
      tabsRef.current.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }

    return () => {
      if (tabsRef.current) {
        tabsRef.current.removeEventListener("scroll", checkScrollButtons);
      }
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [restaurant]);

  const scrollTabs = (direction) => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        tabsRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      tabsRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

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
      {/* Unified Header - Same design for all screen sizes */}
      {/* Updated Header - Clean background without image */}
      <header
        className="bg-white text-gray-900 sticky top-0 z-50 shadow-lg border-b"
        style={{ backgroundColor: restaurant.bannerColor || "#ea580c" }}
      >
        <div className="w-full h-full">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-16">
              <div className="flex items-center min-w-0 flex-shrink-0">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${getLocalizedText(restaurant, "name")} logo`}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-1 sm:mr-2 lg:mr-3 rounded-lg flex-shrink-0"
                  />
                )}
                <h1 className="text-xs sm:text-sm lg:text-2xl font-bold truncate text-white">
                  {getLocalizedText(restaurant, "name")}
                </h1>
              </div>

              <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 mx-2 sm:mx-4">
                <a
                  href="#menu"
                  className="hover:text-orange-200 transition-colors font-medium text-xs sm:text-sm lg:text-base text-white"
                >
                  {t("menu")}
                </a>
                <Link
                  href={`/${restaurant.slug}/about`}
                  className="hover:text-orange-200 transition-colors font-medium text-xs sm:text-sm lg:text-base text-white"
                >
                  {t("about")}
                </Link>
              </nav>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <LanguageToggle />
                {totalCartItems > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-1 sm:p-2 text-white hover:bg-white hover:bg-opacity-20"
                    onClick={() => {
                      const cartContext = document.querySelector(
                        "[data-cart-trigger]"
                      );
                      if (cartContext) cartContext.click();
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-orange-600">
                      {totalCartItems}
                    </Badge>
                  </Button>
                )}
                <Link href={`/${restaurant.slug}/dashboard/manage`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent text-xs sm:text-sm px-1 sm:px-2 lg:px-3"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">{t("dashboard")}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Responsive */}
      {/* Hero Section - Keep the background image here */}
      <div
        className="relative h-32 sm:h-48 lg:h-80 flex items-center justify-center"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-xl sm:text-2xl lg:text-5xl font-bold mb-2 lg:mb-4">
            {getLocalizedText(restaurant, "name")}
          </h1>
          {getLocalizedText(restaurant, "description") && (
            <p className="text-sm sm:text-base lg:text-xl opacity-90 max-w-2xl mx-auto px-4">
              {getLocalizedText(restaurant, "description")}
            </p>
          )}
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

        {/* Restaurant Rating Component */}
        <RestaurantRating
          restaurantName={getLocalizedText(restaurant, "name")}
        />

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
              {/* Horizontal Scrolling Tabs with Navigation Buttons */}
              <div className="relative mb-8">
                {/* Left scroll button */}
                {canScrollLeft && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md"
                    onClick={() => scrollTabs("left")}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}

                {/* Right scroll button */}
                {canScrollRight && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md"
                    onClick={() => scrollTabs("right")}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}

                <div
                  className="overflow-x-auto scrollbar-hide px-8"
                  ref={tabsRef}
                >
                  <TabsList className="inline-flex h-auto p-1 bg-gray-100 rounded-lg min-w-full w-max">
                    <TabsTrigger
                      value="all"
                      className="px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white whitespace-nowrap"
                    >
                      {t("all")}
                    </TabsTrigger>
                    {restaurant.categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-orange-600 data-[state=active]:text-white whitespace-nowrap"
                      >
                        {getLocalizedText(category, "name")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

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
          <div className="grid md:grid-cols-2 gap-8">
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
              {/* Social Media Links */}
              <div className="flex gap-4">
                {restaurant.facebookUrl && (
                  <a
                    href={restaurant.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {restaurant.instagramUrl && (
                  <a
                    href={restaurant.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-pink-500 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
              </div>
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
