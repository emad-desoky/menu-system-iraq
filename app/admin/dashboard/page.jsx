import prisma from "@/lib/prisma";
import AdminDashboardClient from "./admin-dashboard-client";

async function getRestaurants() {
  return await prisma.restaurant.findMany({
    include: {
      _count: {
        select: {
          menuItems: true,
          categories: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminDashboard() {
  // Simple check - in real app you'd check session differently
  const restaurants = await getRestaurants();
  return <AdminDashboardClient restaurants={restaurants} />;
}
