import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: user.id },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable,
        restaurantId: restaurant.id,
        categoryId: data.categoryId,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
