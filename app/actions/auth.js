"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function adminLogin(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function adminSignup(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/error");
  }

  // Create user in Prisma
  if (authData.user) {
    await prisma.user.create({
      data: {
        id: authData.user.id,
        email: authData.user.email,
        role: "ADMIN",
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function restaurantLogin(formData) {
  const restaurantSlug = formData.get("restaurantSlug");
  const password = formData.get("password");

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug },
  });

  if (!restaurant || restaurant.password !== password) {
    redirect("/error");
  }

  // Set restaurant session (you might want to use a more secure approach)
  revalidatePath("/", "layout");
  redirect(`/restaurant/${restaurantSlug}/dashboard`);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
