"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function adminSignup(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

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
        name: name,
        role: "ADMIN",
      },
    });
  }

  revalidatePath("/", "layout");
  redirect("/admin/dashboard");
}
