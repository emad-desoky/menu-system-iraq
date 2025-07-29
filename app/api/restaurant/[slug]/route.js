import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug, isActive: true },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            menuItems: {
              where: { isActive: true, isAvailable: true },
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Convert Decimal prices to strings to avoid serialization issues
    restaurant.categories = restaurant.categories.map((category) => ({
      ...category,
      menuItems: category.menuItems.map((item) => ({
        ...item,
        price: item.price.toString(),
        salePrice: item.salePrice ? item.salePrice.toString() : null,
      })),
    }));

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
