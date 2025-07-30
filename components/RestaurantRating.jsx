"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RestaurantRating({ restaurantName }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { t } = useLanguage();

  const handleRating = (selectedRating) => {
    setRating(selectedRating);
    setHasRated(true);
    // Here you would typically send the rating to your backend
    // For now, it's just a frontend component as requested
  };

  const handleMouseEnter = (star) => {
    setHoveredRating(star);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-center text-orange-800">
          {hasRated ? t("thankYouForRating") : t("rateRestaurant")}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {!hasRated ? (
          <>
            <p className="text-gray-600 mb-4 text-sm">
              {t("howWasExperience")} {restaurantName}?
            </p>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => handleMouseEnter(star)}
                  onMouseLeave={handleMouseLeave}
                  className="transition-colors duration-200 hover:scale-110 transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">{t("clickStarsToRate")}</p>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-green-600 font-medium">
              {t("ratingSubmitted")} ({rating}/5)
            </p>
            <Button
              variant="ghost"
              size="sm"
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
  );
}
