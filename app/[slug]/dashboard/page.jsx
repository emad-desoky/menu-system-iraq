import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { restaurantLogin } from "./actions";

async function getRestaurant(slug) {
  return await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
  });
}

export default async function RestaurantDashboardLogin({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {restaurant.name}
          </CardTitle>
          <CardDescription>
            Enter password to access restaurant dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={restaurantLogin} className="space-y-4">
            <input type="hidden" name="restaurantSlug" value={slug} />

            <div className="space-y-2">
              <Label htmlFor="password">Dashboard Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter dashboard password"
                required
              />
              <p className="text-xs text-gray-600">
                Default password is: {restaurant.password}
              </p>
            </div>

            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </form>

          <div className="text-center">
            <Link href={`/${slug}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
