"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function adminLogin(formData) {
  const password = formData.get("password");

  // Check if password is correct
  if (password !== "123") {
    redirect("/error");
  }

  // Simple redirect without cookies
  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}

export async function restaurantLogin(formData) {
  const name = formData.get("name");
  const password = formData.get("password");

  // Find restaurant by name and check password
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      password: password,
      isActive: true,
    },
  });

  if (!restaurant) {
    redirect("/error");
  }

  // Simple redirect without cookies
  revalidatePath("/", "layout");
  redirect(`/${restaurant.slug}/dashboard/manage`);
}
