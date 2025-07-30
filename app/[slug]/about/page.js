"use client";
import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AboutPage({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const AboutSection = ({ title, content, image }) => {
    if (!content) return null;

    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          {image && (
            <div className="mb-6">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={800}
                height={400}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          <p className="text-gray-700 leading-relaxed text-lg">{content}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <Link
                  href={`/${restaurant.slug}`}
                  className="hover:text-orange-200 transition-colors font-medium text-xs sm:text-sm lg:text-base text-white"
                >
                  {t("menu")}
                </Link>
                <span className="text-orange-200 font-medium text-xs sm:text-sm lg:text-base">
                  {t("about")}
                </span>
              </nav>

              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <LanguageToggle />
                <Link href={`/${restaurant.slug}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent text-xs sm:text-sm px-1 sm:px-2 lg:px-3"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">{t("backToMenu")}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div
        className="relative h-32 sm:h-48 lg:h-80 flex items-center justify-center"
        style={bannerStyle}
      >
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="text-center text-white z-10 px-4">
          <h1 className="text-xl sm:text-2xl lg:text-5xl font-bold mb-2 lg:mb-4">
            {t("about")} {getLocalizedText(restaurant, "name")}
          </h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Sections */}
        <AboutSection
          title={t("ourStory")}
          content={getLocalizedText(restaurant, "aboutStory")}
          image={restaurant.aboutStoryImage}
        />

        <AboutSection
          title={t("ourMission")}
          content={getLocalizedText(restaurant, "aboutMission")}
          image={restaurant.aboutMissionImage}
        />

        <AboutSection
          title={t("ourVision")}
          content={getLocalizedText(restaurant, "aboutVision")}
          image={restaurant.aboutVisionImage}
        />

        <AboutSection
          title={t("ourChef")}
          content={getLocalizedText(restaurant, "aboutChef")}
          image={restaurant.aboutChefImage}
        />

        <AboutSection
          title={t("ourHistory")}
          content={getLocalizedText(restaurant, "aboutHistory")}
          image={restaurant.aboutHistoryImage}
        />

        {/* Contact Information */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t("visitUs")}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {getLocalizedText(restaurant, "address") && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700">
                      {getLocalizedText(restaurant, "address")}
                    </p>
                  </div>
                )}
                {restaurant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-gray-700">{restaurant.phone}</p>
                  </div>
                )}
                {restaurant.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <p className="text-gray-700">{restaurant.email}</p>
                  </div>
                )}
                <div className="flex gap-4 pt-2">
                  {restaurant.facebookUrl && (
                    <a
                      href={restaurant.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                  )}
                  {restaurant.instagramUrl && (
                    <a
                      href={restaurant.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
              {restaurant.googleMapsUrl && (
                <div>
                  <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t("viewOnGoogleMaps")}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
