"use client";
import { useState, useEffect, useRef } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Phone,
  Mail,
  Settings,
  Search,
  ShoppingCart,
  Facebook,
  Instagram,
  Menu,
  Plus,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";
import MenuItemModal from "@/components/MenuItemModal";

export default function RestaurantMenu({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const tabsRef = useRef(null);

  const { t, isRTL, language } = useLanguage();
  const { addToCart, getTotalItems, getTotalPrice } = useCart();

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

  // Handle scroll events for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToCategory = (categoryId) => {
    setActiveTab(categoryId);
    const categoryElement = document.getElementById(`category-${categoryId}`);
    if (categoryElement) {
      const headerHeight = 140; // Approximate height of header + sticky tabs
      const elementPosition = categoryElement.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
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

  const formatPrice = (price) => {
    return `${Number.parseFloat(price).toFixed(0)} IQD`;
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
        categoryId: category.id,
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
          categoryId: category.id,
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

  const groupItemsByCategory = () => {
    const grouped = {};
    const allItems = getAllMenuItems();

    restaurant.categories.forEach((category) => {
      const categoryItems = allItems.filter(
        (item) => item.categoryId === category.id
      );
      if (categoryItems.length > 0) {
        grouped[category.id] = {
          category,
          items: categoryItems,
        };
      }
    });

    return grouped;
  };

  const handleItemClick = (item) => {
    setSelectedMenuItem(item);
    setShowItemModal(true);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const totalCartItems = getTotalItems();
  const groupedItems = groupItemsByCategory();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Updated Header with Mobile Menu */}
      <header
        className="bg-white text-gray-900 sticky top-0 z-50 shadow-lg border-b"
        style={{ backgroundColor: restaurant.bannerColor || "#ea580c" }}
      >
        <div className="w-full h-full">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex items-center justify-between h-12 sm:h-16">
              {/* Left side - Mobile menu button (for mobile) */}
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-1 text-white hover:bg-white hover:bg-opacity-20 mr-2"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                {restaurant.logo && (
                  <Image
                    src={restaurant.logo || "/placeholder.svg"}
                    alt={`${getLocalizedText(restaurant, "name")} logo`}
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-lg flex-shrink-0"
                  />
                )}
              </div>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4 lg:space-x-8">
                <a
                  href="#menu"
                  className="hover:text-orange-200 transition-colors font-medium text-sm lg:text-base text-white"
                >
                  {t("menu")}
                </a>
                <Link
                  href={`/${restaurant.slug}/about`}
                  className="hover:text-orange-200 transition-colors font-medium text-sm lg:text-base text-white"
                >
                  {t("about")}
                </Link>
                <Link
                  href={`/${restaurant.slug}/rating`}
                  className="hover:text-orange-200 transition-colors font-medium text-sm lg:text-base text-white"
                >
                  {t("rateRestaurant")}
                </Link>
              </nav>
              {/* Right side - Cart, Language, Settings */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <LanguageToggle />
                {totalCartItems > 0 && (
                  <Link href={`/${restaurant.slug}/cart`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative p-1 sm:p-2 text-white hover:bg-white hover:bg-opacity-20"
                    >
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-orange-600">
                        {totalCartItems}
                      </Badge>
                    </Button>
                  </Link>
                )}
                <Link href={`/${restaurant.slug}/dashboard/manage`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent text-xs sm:text-sm px-1 sm:px-2 lg:px-3"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
                <div className="py-2">
                  <a
                    href="#menu"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t("menu")}
                  </a>
                  <Link
                    href={`/${restaurant.slug}/about`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t("about")}
                  </Link>
                  <Link
                    href={`/${restaurant.slug}/rating`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {t("rateRestaurant")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="relative h-96 sm:h-64 lg:h-[700px] flex items-center justify-center"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-xl sm:text-2xl lg:text-5xl font-bold mb-2 lg:mb-4">
            {getLocalizedText(restaurant, "name")}
          </h1>
          {getLocalizedText(restaurant, "description") && (
            <p className="text-sm sm:text-base lg:text-xl opacity-90 max-w-2xl mx-auto px-4 mb-4">
              {getLocalizedText(restaurant, "description")}
            </p>
          )}
        </div>
      </div>

      {/* Sticky Category Tabs */}
      <div className="sticky top-12 sm:top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative py-4">
            <div
              className="overflow-x-auto scrollbar-hide"
              ref={tabsRef}
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="inline-flex h-auto p-1 bg-gray-100 rounded-lg min-w-full w-max">
                <Button
                  variant={activeTab === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToCategory("all")}
                  className={`px-4 py-3 text-sm font-medium rounded-lg whitespace-nowrap ${
                    activeTab === "all"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {t("all")}
                </Button>
                {restaurant.categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeTab === category.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToCategory(category.id)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg whitespace-nowrap ${
                      activeTab === category.id
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {getLocalizedText(category, "name")}
                  </Button>
                ))}
              </div>
            </div>
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
          {restaurant.categories.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {t("menuComingSoon")}
                </h3>
                <p className="text-gray-600">{t("menuComingSoonDesc")}</p>
              </CardContent>
            </Card>
          ) : activeTab === "all" && !searchTerm ? (
            // Show all categories grouped
            <div className="space-y-12">
              {Object.entries(groupedItems).map(
                ([categoryId, { category, items }]) => (
                  <div key={categoryId} id={`category-${categoryId}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b">
                      {getLocalizedText(category, "name")}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {items.map((item) => {
                        const currentPrice = item.salePrice || item.price;
                        const hasDiscount =
                          item.salePrice &&
                          Number.parseFloat(item.salePrice) <
                            Number.parseFloat(item.price);
                        return (
                          <Card
                            key={item.id}
                            className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group p-0"
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="aspect-square bg-gray-200 relative overflow-hidden">
                              {item.image ? (
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={
                                    item.imageAlt ||
                                    getLocalizedText(item, "name")
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
                            <div className="p-3 md:p-4">
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
                                  <span className="text-sm font-bold text-orange-600">
                                    {formatPrice(currentPrice)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="text-xs text-gray-500 line-through">
                                      {formatPrice(item.price)}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(item);
                                  }}
                                  className="bg-orange-600 hover:bg-orange-700 p-2 h-8 w-8"
                                  disabled={!item.isAvailable}
                                >
                                  <Plus className="w-4 h-4" />
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
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            // Show filtered items or specific category
            <div id={`category-${activeTab}`}>
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
                      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group p-0"
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
                      <div className="p-3 md:p-4">
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
                            <span className="text-sm font-bold text-orange-600">
                              {formatPrice(currentPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-gray-500 line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            className="bg-orange-600 hover:bg-orange-700 p-2 h-8 w-8"
                            disabled={!item.isAvailable}
                          >
                            <Plus className="w-4 h-4" />
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
                      </div>
                    </Card>
                  );
                })}
              </div>
              {getFilteredItems().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">{t("noItemsFound")}</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg p-0"
          size="sm"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

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
                    <p
                      className="text-gray-400"
                      dir="ltr"
                      style={{ textAlign: isRTL ? "right" : "left" }}
                    >
                      {restaurant.phone}
                    </p>
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

      {/* Fixed Bottom Cart Button - Updated to navigate to cart page */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link href={`/${restaurant.slug}/cart`}>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">
                {formatPrice(getTotalPrice())}
              </span>
              <Badge className="bg-orange-500 text-white ml-1">
                {totalCartItems}
              </Badge>
            </Button>
          </Link>
        </div>
      )}

      {/* Modals */}
      <MenuItemModal
        item={selectedMenuItem}
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
      />
    </div>
  );
}
