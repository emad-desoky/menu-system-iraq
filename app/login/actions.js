"use server";

import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function logout() {
  await signOut({ redirectTo: "/admin/login" });
  redirect("/admin/login");
}
