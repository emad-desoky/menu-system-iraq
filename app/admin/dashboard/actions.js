"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function createRestaurant(formData) {
  const data = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    address: formData.get("address") || null,
    password: formData.get("password"),
  };

  try {
    // Check if slug already exists
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug: data.slug },
    });

    if (existingRestaurant) {
      // Generate a unique slug by appending a number
      let counter = 1;
      let uniqueSlug = `${data.slug}-${counter}`;

      while (
        await prisma.restaurant.findUnique({ where: { slug: uniqueSlug } })
      ) {
        counter++;
        uniqueSlug = `${data.slug}-${counter}`;
      }

      data.slug = uniqueSlug;
    }

    // Create a default admin user for this restaurant
    const adminUser = await prisma.user.create({
      data: {
        email: data.email || `admin@${data.slug}.com`,
        name: `${data.name} Admin`,
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
    redirect("/admin/dashboard?error=creation_failed");
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

export async function logout() {
  // Simple redirect without cookies for now
  revalidatePath("/", "layout");
  redirect("/");
}
