import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import RestaurantDashboardClient from "./restaurant-dashboard-client";

async function getRestaurantData(slug) {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug,
      isActive: true,
    },
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

  return restaurant;
}

export default async function RestaurantDashboard({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurantData(slug);

  if (!restaurant) {
    notFound();
  }

  return <RestaurantDashboardClient restaurant={restaurant} />;
}
