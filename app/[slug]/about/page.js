"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AboutPage({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

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
          <p className="mt-4 text-gray-600">Loading...</p>
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
                <Link
                  href={`/${restaurant.slug}`}
                  className="hover:text-orange-200 transition-colors"
                >
                  Menu
                </Link>
                <Link
                  href={`/${restaurant.slug}/about`}
                  className="text-orange-200"
                >
                  About
                </Link>
              </nav>
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-20" style={bannerStyle}>
        <div style={overlayStyle} className="absolute inset-0"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Link href={`/${restaurant.slug}`}>
            <Button
              variant="ghost"
              className="mb-6 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-6">About {restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-xl opacity-90 leading-relaxed">
              {restaurant.description}
            </p>
          )}
        </div>
      </div>

      {/* About Content */}
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* About Sections Grid */}
          <div className="grid gap-8 md:gap-12">
            {restaurant.aboutStory && (
              <section className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8 md:p-12">
                    <div className="text-center mb-8">
                      <h2
                        className="text-3xl font-bold text-gray-900 mb-4"
                        style={{ color: restaurant.bannerColor || "#ea580c" }}
                      >
                        Our Story
                      </h2>
                      <div
                        className="w-24 h-1 mx-auto rounded-full"
                        style={{
                          backgroundColor: restaurant.bannerColor || "#ea580c",
                        }}
                      ></div>
                    </div>
                    <div className="text-gray-700 leading-relaxed text-center">
                      <p className="text-lg break-words whitespace-pre-wrap overflow-wrap-anywhere max-w-none">
                        {restaurant.aboutStory}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Mission & Vision Row */}
            {(restaurant.aboutMission || restaurant.aboutVision) && (
              <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {restaurant.aboutMission && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-3"
                          style={{ color: restaurant.bannerColor || "#ea580c" }}
                        >
                          Our Mission
                        </h3>
                        <div
                          className="w-16 h-1 mx-auto rounded-full"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center break-words whitespace-pre-wrap overflow-wrap-anywhere">
                        {restaurant.aboutMission}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {restaurant.aboutVision && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-3"
                          style={{ color: restaurant.bannerColor || "#ea580c" }}
                        >
                          Our Vision
                        </h3>
                        <div
                          className="w-16 h-1 mx-auto rounded-full"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center break-words whitespace-pre-wrap overflow-wrap-anywhere">
                        {restaurant.aboutVision}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {/* Chef & History Row */}
            {(restaurant.aboutChef || restaurant.aboutHistory) && (
              <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {restaurant.aboutChef && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-3"
                          style={{ color: restaurant.bannerColor || "#ea580c" }}
                        >
                          Our Chef
                        </h3>
                        <div
                          className="w-16 h-1 mx-auto rounded-full"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center break-words whitespace-pre-wrap overflow-wrap-anywhere">
                        {restaurant.aboutChef}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {restaurant.aboutHistory && (
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <h3
                          className="text-2xl font-bold text-gray-900 mb-3"
                          style={{ color: restaurant.bannerColor || "#ea580c" }}
                        >
                          Our History
                        </h3>
                        <div
                          className="w-16 h-1 mx-auto rounded-full"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        ></div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-center break-words whitespace-pre-wrap overflow-wrap-anywhere">
                        {restaurant.aboutHistory}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {/* Contact Information */}
            <section className="max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-8">
                    <h2
                      className="text-3xl font-bold text-gray-900 mb-4"
                      style={{ color: restaurant.bannerColor || "#ea580c" }}
                    >
                      Visit Us
                    </h2>
                    <div
                      className="w-24 h-1 mx-auto rounded-full"
                      style={{
                        backgroundColor: restaurant.bannerColor || "#ea580c",
                      }}
                    ></div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    {restaurant.address && (
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        >
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Address
                        </h4>
                        <p className="text-gray-600">{restaurant.address}</p>
                      </div>
                    )}
                    {restaurant.phone && (
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        >
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Phone
                        </h4>
                        <p className="text-gray-600">{restaurant.phone}</p>
                      </div>
                    )}
                    {restaurant.email && (
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                          style={{
                            backgroundColor:
                              restaurant.bannerColor || "#ea580c",
                          }}
                        >
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Email
                        </h4>
                        <p className="text-gray-600">{restaurant.email}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-4">{restaurant.name}</h3>
          <p className="text-gray-400">
            © 2024 {restaurant.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
