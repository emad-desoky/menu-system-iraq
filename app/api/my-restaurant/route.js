import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findFirst({
      where: { adminId: user.id },
    });

    if (!restaurant) {
      return NextResponse.json({
        restaurant: null,
        categories: [],
        menuItems: [],
      });
    }

    const categories = await prisma.category.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { sortOrder: "asc" },
    });

    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ restaurant, categories, menuItems });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
