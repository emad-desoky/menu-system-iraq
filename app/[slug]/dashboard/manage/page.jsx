import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RestaurantDashboardClient from "./restaurant-dashboard-client";

async function getRestaurantData(slug) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug, isActive: true },
    include: {
      categories: {
        where: { isActive: true },
        include: {
          menuItems: {
            where: { isActive: true },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  // Convert Decimal prices to strings to avoid serialization issues
  if (restaurant) {
    restaurant.categories = restaurant.categories.map((category) => ({
      ...category,
      menuItems: category.menuItems.map((item) => ({
        ...item,
        price: item.price.toString(),
      })),
    }));
  }

  return restaurant;
}

export default async function RestaurantManagement({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurantData(slug);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDashboardClient restaurant={restaurant} />;
}
