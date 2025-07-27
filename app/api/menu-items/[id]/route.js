import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await requireAuth();
    const data = await request.json();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: params.id,
        restaurant: { ownerId: user.id },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        isAvailable: data.isAvailable,
        categoryId: data.categoryId,
      },
    });

    return NextResponse.json(updatedMenuItem);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireAuth();

    const menuItem = await prisma.menuItem.findFirst({
      where: {
        id: params.id,
        restaurant: { ownerId: user.id },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    await prisma.menuItem.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
