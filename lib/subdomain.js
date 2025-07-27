import { headers } from "next/headers";

export async function getSubdomain() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Extract subdomain from host
  const parts = host.split(".");
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

export async function getRestaurantBySubdomain(subdomain) {
  if (!subdomain) return null;

  const prisma = (await import("@/lib/prisma")).default;

  return await prisma.restaurant.findUnique({
    where: { subdomain },
    include: {
      categories: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          menuItems: {
            where: { isActive: true, isAvailable: true },
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });
}
