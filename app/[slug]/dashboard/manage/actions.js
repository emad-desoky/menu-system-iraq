"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createCategory(formData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
  };

  try {
    await prisma.category.create({
      data,
    });

    revalidatePath("/[slug]/dashboard/manage", "page");
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

export async function createMenuItem(formData) {
  const data = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    price: Number.parseFloat(formData.get("price")),
    isAvailable: formData.get("isAvailable") === "true",
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
    categoryId: formData.get("categoryId"),
  };

  try {
    await prisma.menuItem.create({
      data,
    });

    revalidatePath("/[slug]/dashboard/manage", "page");
  } catch (error) {
    console.error("Error creating menu item:", error);
  }
}

export async function deleteCategory(formData) {
  const categoryId = formData.get("categoryId");

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });

    revalidatePath("/[slug]/dashboard/manage", "page");
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

export async function deleteMenuItem(formData) {
  const menuItemId = formData.get("menuItemId");

  try {
    await prisma.menuItem.delete({
      where: { id: menuItemId },
    });

    revalidatePath("/[slug]/dashboard/manage", "page");
  } catch (error) {
    console.error("Error deleting menu item:", error);
  }
}
