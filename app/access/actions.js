"use server";

import { redirect } from "next/navigation";

export async function adminLogin(formData) {
  const password = formData.get("password");

  // Simple password check - replace with your actual authentication logic
  if (password === "123") {
    redirect("/admin/dashboard");
  } else {
    // Handle invalid password - you might want to add error handling
    redirect("/access?error=invalid-password");
  }
}

export async function restaurantLogin(formData) {
  const name = formData.get("name");
  const password = formData.get("password");

  // Simple authentication check - replace with your actual logic
  if (name === "test" && password === "123") {
    redirect("/restaurant/dashboard");
  } else {
    // Handle invalid credentials
    redirect("/access?error=invalid-credentials");
  }
}
