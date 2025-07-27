import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    await requireAdmin();

    const data = await request.json();
    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name: data.name,
        subdomain: data.subdomain,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
      },
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();

    await prisma.restaurant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
