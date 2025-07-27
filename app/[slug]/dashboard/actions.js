"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function restaurantLogin(formData) {
  const restaurantSlug = formData.get("restaurantSlug");
  const password = formData.get("password");

  // Find restaurant by slug and check password
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug: restaurantSlug,
      password: password,
      isActive: true,
    },
  });

  if (!restaurant) {
    redirect("/error");
  }

  // Redirect to restaurant management dashboard
  revalidatePath("/", "layout");
  redirect(`/${restaurantSlug}/dashboard/manage`);
}
