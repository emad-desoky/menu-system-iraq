"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function logout() {
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createRestaurant(formData) {
  const data = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    password: formData.get("password"),
    description: formData.get("description") || null,
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    address: formData.get("address") || null,
  };

  try {
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@system.com" },
      update: {},
      create: {
        email: "admin@system.com",
        name: "System Admin",
        role: "ADMIN",
      },
    });

    await prisma.restaurant.create({
      data: {
        ...data,
        adminId: adminUser.id,
      },
    });

    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Error creating restaurant:", error);
    redirect("/error");
  }
}

export async function deleteRestaurant(formData) {
  const restaurantId = formData.get("restaurantId");

  try {
    await prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    revalidatePath("/admin/dashboard");
  } catch (error) {
    console.error("Error deleting restaurant:", error);
  }
}
