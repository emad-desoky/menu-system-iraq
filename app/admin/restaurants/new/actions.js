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
    adminId: formData.get("adminId"),
  };

  try {
    await prisma.restaurant.create({
      data,
    });

    revalidatePath("/admin");
    redirect("/admin");
  } catch (error) {
    console.error("Error creating restaurant:", error);
    redirect("/error");
  }
}
