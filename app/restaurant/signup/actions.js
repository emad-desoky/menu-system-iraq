"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function restaurantSignup(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const restaurantName = formData.get("restaurantName");
  const slug = formData.get("slug");
  const description = formData.get("description");

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/error");
  }

  // Create user and restaurant in Prisma
  if (authData.user) {
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email,
        role: "RESTAURANT",
      },
    });

    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        slug: slug,
        description: description || null,
        email: email,
        adminId: user.id,
      },
    });

    revalidatePath("/", "layout");
    redirect(`/restaurant/dashboard/${restaurant.slug}`);
  }
}
