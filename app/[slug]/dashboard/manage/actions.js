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
    isVegetarian: formData.get("isVegetarian") === "true",
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
    categoryId: formData.get("categoryId"),
    // Note: In a real app, you'd handle image upload to a service like Cloudinary or AWS S3
    image: formData.get("image")
      ? "/placeholder.svg?height=300&width=400"
      : null,
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

export async function updateAboutUs(formData) {
  const restaurantId = formData.get("restaurantId");
  const data = {
    aboutStory: formData.get("aboutStory") || null,
    aboutMission: formData.get("aboutMission") || null,
    aboutVision: formData.get("aboutVision") || null,
    aboutChef: formData.get("aboutChef") || null,
    aboutHistory: formData.get("aboutHistory") || null,
  };

  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
  } catch (error) {
    console.error("Error updating about us:", error);
  }
}
