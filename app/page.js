import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Store } from "lucide-react";
import { adminLogin, restaurantLogin } from "./actions";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Restaurant Menu System
          </h1>
          <p className="text-xl text-gray-600">
            Choose your account type to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Box */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Are you an Admin?</CardTitle>
              <CardDescription className="text-base">
                Manage multiple restaurants and oversee the entire system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={adminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="Enter admin password"
                    required
                  />
                  <p className="text-xs text-gray-600">Admin password: 123</p>
                </div>
                <Button type="submit" className="w-full">
                  Login as Admin
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Restaurant Box */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Store className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Are you a Restaurant?</CardTitle>
              <CardDescription className="text-base">
                Manage your restaurant menu and customer information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={restaurantLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    name="name"
                    placeholder="Enter your restaurant name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant-password">Password</Label>
                  <Input
                    id="restaurant-password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    required
                  />
                  <p className="text-xs text-gray-600">
                    Test restaurant: name "test", password "123"
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  Login as Restaurant
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
