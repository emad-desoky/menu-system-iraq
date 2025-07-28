import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Store, ChefHat, Utensils } from "lucide-react";
import { adminLogin, restaurantLogin } from "./actions";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              E-Menu
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Revolutionizing Restaurant Management
            </p>
            <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              Streamline your restaurant operations with our comprehensive
              digital menu system. From elegant menu displays to powerful
              management tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg bg-transparent"
            >
              <Utensils className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Access Level
            </h2>
            <p className="text-xl text-gray-600">
              Whether you&apos;re managing multiple restaurants or running your
              own establishment
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
                    System Administrator
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage multiple restaurants, oversee operations, and control
                    the entire platform
                  </p>
                </div>

                <form action={adminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="admin-password"
                      className="text-sm font-medium"
                    >
                      Admin Password
                    </Label>
                    <Input
                      id="admin-password"
                      name="password"
                      type="password"
                      placeholder="Enter admin password"
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-gray-500">Default: 123</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
                  >
                    Access Admin Dashboard
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
                    Restaurant Owner
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Manage your restaurant menu, update information, and control
                    your digital presence
                  </p>
                </div>

                <form action={restaurantLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="restaurant-name"
                      className="text-sm font-medium"
                    >
                      Restaurant Name
                    </Label>
                    <Input
                      id="restaurant-name"
                      name="name"
                      placeholder="Enter your restaurant name"
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="restaurant-password"
                      className="text-sm font-medium"
                    >
                      Password
                    </Label>
                    <Input
                      id="restaurant-password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      className="h-12"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Test: name &quot;test&quot;, password &quot;123&quot;
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    Access Restaurant Dashboard
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">E-Menu</h3>
          <p className="text-gray-400 mb-6">
            Empowering restaurants with digital innovation
          </p>
          <div className="flex justify-center space-x-6">
            <div className="text-sm text-gray-400">
              © 2024 E-Menu. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
