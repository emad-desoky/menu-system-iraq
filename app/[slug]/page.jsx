"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  MapPin,
  Phone,
  Mail,
  Settings,
  MenuIcon,
  Search,
  ChevronDown,
  ExternalLink,
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
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState({});

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

        // Open first category by default
        if (data.categories.length > 0) {
          setOpenCategories({ [data.categories[0].id]: true });
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [params]);

  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
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

  const filteredCategories = restaurant.categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.menuItems.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

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
      <div className="bg-white border-b shadow-sm">
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
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={t("searchMenu")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
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
            <div className="space-y-4">
              {filteredCategories.map((category) => {
                const filteredItems = category.menuItems.filter((item) =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (searchTerm && filteredItems.length === 0) return null;

                return (
                  <Collapsible
                    key={category.id}
                    open={openCategories[category.id]}
                    onOpenChange={() => toggleCategory(category.id)}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CollapsibleTrigger asChild>
                        <div className="cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {category.image && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                                    <Image
                                      src={category.image || "/placeholder.svg"}
                                      alt={category.name}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    {category.name}
                                  </h3>
                                  {category.description && (
                                    <p className="text-gray-600 mb-2">
                                      {category.description}
                                    </p>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-orange-600 border-orange-600"
                                  >
                                    {filteredItems.length} {t("items")}
                                  </Badge>
                                </div>
                              </div>
                              <ChevronDown
                                className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                                  openCategories[category.id]
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </div>
                          </CardContent>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t bg-gray-50/50">
                          <div className="p-6">
                            <div
                              className={`grid gap-6 ${
                                isMobile
                                  ? "grid-cols-1"
                                  : "md:grid-cols-2 lg:grid-cols-3"
                              }`}
                            >
                              {filteredItems.map((item) => {
                                const currentPrice =
                                  item.salePrice || item.price;
                                const hasDiscount =
                                  item.salePrice &&
                                  Number.parseFloat(item.salePrice) <
                                    Number.parseFloat(item.price);

                                return (
                                  <Card
                                    key={item.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white"
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
                                            <p className="text-xs">
                                              {t("noImage")}
                                            </p>
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
                                            $
                                            {Number.parseFloat(
                                              currentPrice
                                            ).toFixed(2)}
                                          </span>
                                          {hasDiscount && (
                                            <div className="text-sm text-gray-500 line-through">
                                              $
                                              {Number.parseFloat(
                                                item.price
                                              ).toFixed(2)}
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
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Restaurant Info */}
            <div>
              <div className="flex items-center mb-6">
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${restaurant.name} logo`}
                    width={48}
                    height={48}
                    className="mr-3 rounded-lg"
                  />
                )}
                <h3 className="text-2xl font-bold">{restaurant.name}</h3>
              </div>
              {restaurant.description && (
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {restaurant.description}
                </p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">{t("contactInfo")}</h4>
              <div className="space-y-4">
                {restaurant.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-400">{restaurant.address}</p>
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

            {/* Google Maps or Quick Links */}
            <div>
              {restaurant.googleMapsUrl ? (
                <div>
                  <h4 className="text-lg font-semibold mb-6">
                    {t("location")}
                  </h4>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-800">
                      <iframe
                        src={
                          restaurant.googleMapsUrl.includes("embed")
                            ? restaurant.googleMapsUrl
                            : `https://maps.google.com/maps?q=${encodeURIComponent(
                                restaurant.address || restaurant.name
                              )}&output=embed`
                        }
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                    {restaurant.googleMapsUrl.includes("goo.gl") && (
                      <a
                        href={restaurant.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {t("viewOnGoogleMaps")}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-semibold mb-6">
                    {t("quickLinks")}
                  </h4>
                  <ul className="space-y-3">
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
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 {restaurant.name}. {t("allRightsReserved")}
            </p>
            <div className="flex items-center gap-4">
              <LanguageToggle />
            </div>
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
