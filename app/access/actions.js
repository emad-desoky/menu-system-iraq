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
    // Instead of creating a dynamic slug route, redirect to the fixed restaurant dashboard
    // Change this line based on your actual deployed route structure
    redirect("/restaurant/dashboard");

    // If you need the restaurant name for the session, you might want to:
    // 1. Store it in cookies/session
    // 2. Pass it as a query parameter
    // 3. Or redirect to: `/restaurant/dashboard?name=${encodeURIComponent(name)}`
  } else {
    // Handle invalid credentials
    redirect("/access?error=invalid-credentials");
  }
}
