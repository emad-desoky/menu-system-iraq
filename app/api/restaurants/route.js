import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Check auth here in API route
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurants = await prisma.restaurant.findMany({
      include: {
        _count: {
          select: { menuItems: true, categories: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        slug: data.slug,
        password: data.password,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        adminId: user.id,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
