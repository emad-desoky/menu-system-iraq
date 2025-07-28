"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export async function adminLogin(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    redirect("/admin");
  } catch (error) {
    console.error("Login error:", error);
    redirect("/admin/login?error=invalid_credentials");
  }
}
