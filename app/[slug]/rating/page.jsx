"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function RatingPage({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { t, language } = useLanguage();

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

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
    setHasRated(true);
  };

  const handleMouseEnter = (star) => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
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
              <h1 className="text-xl font-bold text-gray-900">
                {t("rateRestaurant")}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {restaurant.logo && (
                <Image
                  src={restaurant.logo || "/placeholder.svg"}
                  alt={`${getLocalizedText(restaurant, "name")} logo`}
                  width={64}
                  height={64}
                  className="rounded-lg"
                />
              )}
            </div>
            <CardTitle className="text-2xl text-orange-800">
              {hasRated ? t("thankYouForRating") : t("rateRestaurant")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {!hasRated ? (
              <>
                <p className="text-gray-600 mb-6 text-lg">
                  {t("howWasExperience")} {getLocalizedText(restaurant, "name")}
                  ?
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => handleMouseEnter(star)}
                      onMouseLeave={handleMouseLeave}
                      className="transition-all duration-200 hover:scale-110 transform p-2"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">{t("clickStarsToRate")}</p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-green-600 font-medium text-lg">
                  {t("ratingSubmitted")} ({rating}/5)
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setHasRated(false);
                    setRating(0);
                  }}
                  className="text-orange-600 hover:text-orange-700"
                >
                  {t("changeRating")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
