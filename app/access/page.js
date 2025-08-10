"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Store, ChefHat, Utensils } from "lucide-react";
import { adminLogin, restaurantLogin } from "./actions";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

export default function AccessPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("chooseAccessLevel")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("managingMultipleRestaurants")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Admin Access */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t("systemAdministrator")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("manageMultipleRestaurants")}
                  </p>
                </div>
                <form action={adminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-password"
                      className="text-sm font-medium"
                    >
                      {t("adminPassword")}
                    </Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      placeholder={t("enterAdminPassword")}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-gray-500">Default: 123</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
                  >
                    {t("accessAdminDashboard")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Restaurant Access */}
            <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <Store className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {t("restaurantOwner")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("manageRestaurantMenu")}
                  </p>
                </div>
                <form action={restaurantLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="restaurant-name"
                      className="text-sm font-medium"
                    >
                      {t("restaurantName")}
                    </Label>
                    <Input
                      id="restaurant-name"
                      name="name"
                      placeholder={t("enterRestaurantName")}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="restaurant-password"
                      className="text-sm font-medium"
                    >
                      {t("password")}
                    </Label>
                    <Input
                      id="restaurant-password"
                      name="password"
                      type="password"
                      placeholder={t("enterPassword")}
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Test: name &#34;test&quot;, password &ldquo;123&quot;
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    {t("accessRestaurantDashboard")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4">E-Menu</h3>
              <p className="text-gray-400 mb-6 text-lg">
                {t("empoweringRestaurants")}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("about")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("contact")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("dashboard")}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("followUs")}</h4>
              <div className="text-gray-400">
                <p className="mb-2">{t("empoweringRestaurants")}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 E-Menu. {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
