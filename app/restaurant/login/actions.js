"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function restaurantLogin(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // Find the restaurant associated with this user
  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      restaurants: true,
    },
  });

  if (!user || user.role !== "RESTAURANT" || user.restaurants.length === 0) {
    redirect("/error");
  }

  const restaurant = user.restaurants[0];

  revalidatePath("/", "layout");
  redirect(`/restaurant/dashboard/${restaurant.slug}`);
}
