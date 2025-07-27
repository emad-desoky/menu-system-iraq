"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function createRestaurant(formData) {
  const data = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || null,
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    address: formData.get("address") || null,
    adminId: "admin-default", // We'll use a default admin ID
  };

  try {
    // Create a default admin user if it doesn't exist
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@system.com" },
      update: {},
      create: {
        id: "admin-default",
        email: "admin@system.com",
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
