"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function CartPage({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getTotalPrice,
    clearCart,
  } = useCart();

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

  const formatPrice = (price) => {
    return `${Number.parseFloat(price).toFixed(0)} IQD`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href={`/${restaurant.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToMenu")}
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{t("cart")}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("delete")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {t("emptyCart")}
              </h3>
              <Link href={`/${restaurant.slug}`}>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  {t("backToMenu")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 mx-auto sm:mx-0 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={getLocalizedText(item, "name")}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            {t("noImage")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details and Actions */}
                    <div className="flex flex-col flex-1 min-w-0 gap-2">
                      {/* Title and Price */}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-center sm:text-left">
                          {getLocalizedText(item, "name")}
                        </h3>
                        <p className="text-orange-600 font-bold text-center sm:text-left">
                          {formatPrice(item.salePrice || item.price)}
                        </p>
                      </div>

                      {/* Quantity and Delete */}
                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Fixed Bottom Total and Checkout */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">
                {t("total")}:
              </span>
              <span className="text-xl font-bold text-orange-600">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3">
              {t("checkout")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
