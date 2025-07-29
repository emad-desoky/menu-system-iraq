"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function createCategory(formData) {
  // Handle category image upload
  const imageFile = formData.get("image");
  let imageData = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type;
    imageData = `data:${mimeType};base64,${base64}`;
  }

  const data = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    image: imageData,
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
  };

  try {
    await prisma.category.create({
      data,
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
  } catch (error) {
    console.error("Error creating category:", error);
  }
}

export async function createMenuItem(formData) {
  // Handle base64 image storage
  const imageFile = formData.get("image");
  let imageData = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = imageFile.type;
    imageData = `data:${mimeType};base64,${base64}`;
  }

  const salePrice = formData.get("salePrice");
  const salePriceValue =
    salePrice && salePrice !== "" ? Number.parseFloat(salePrice) : null;

  const data = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    price: Number.parseFloat(formData.get("price")),
    salePrice: salePriceValue,
    isAvailable: formData.get("isAvailable") === "true",
    isVegetarian: formData.get("isVegetarian") === "true",
    isVegan: formData.get("isVegan") === "true",
    isGlutenFree: formData.get("isGlutenFree") === "true",
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
    categoryId: formData.get("categoryId"),
    image: imageData,
    imageAlt: formData.get("name"),
  };

  try {
    await prisma.menuItem.create({
      data,
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
  } catch (error) {
    console.error("Error creating menu item:", error);
  }
}

export async function deleteCategory(formData) {
  const categoryId = formData.get("categoryId");

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
  } catch (error) {
    console.error("Error deleting category:", error);
  }
}

export async function deleteMenuItem(formData) {
  const menuItemId = formData.get("menuItemId");

  try {
    await prisma.menuItem.delete({
      where: { id: menuItemId },
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
  } catch (error) {
    console.error("Error deleting menu item:", error);
  }
}

export async function updateAboutUs(formData) {
  const restaurantId = formData.get("restaurantId");
  let googleMapsUrl = formData.get("googleMapsUrl") || null;

  // Handle different Google Maps URL formats
  if (googleMapsUrl) {
    // If it's a goo.gl link, keep it as is for direct linking
    if (
      googleMapsUrl.includes("goo.gl") ||
      googleMapsUrl.includes("maps.app.goo.gl")
    ) {
      // Keep the original URL for direct linking
    } else if (
      googleMapsUrl.includes("google.com/maps") &&
      !googleMapsUrl.includes("embed")
    ) {
      // Convert regular Google Maps URL to embed URL
      const urlParams = new URLSearchParams(googleMapsUrl.split("?")[1]);
      const query = urlParams.get("q") || urlParams.get("query");
      if (query) {
        googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
          query
        )}`;
      }
    }
  }

  const data = {
    aboutStory: formData.get("aboutStory") || null,
    aboutMission: formData.get("aboutMission") || null,
    aboutVision: formData.get("aboutVision") || null,
    aboutChef: formData.get("aboutChef") || null,
    aboutHistory: formData.get("aboutHistory") || null,
    googleMapsUrl: googleMapsUrl,
  };

  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
    revalidatePath("/[slug]/about", "page");
  } catch (error) {
    console.error("Error updating about us:", error);
  }
}

export async function updateAppearance(formData) {
  const restaurantId = formData.get("restaurantId");

  // Handle logo upload
  const logoFile = formData.get("logo");
  let logoData = null;

  if (logoFile && logoFile.size > 0) {
    const bytes = await logoFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = logoFile.type;
    logoData = `data:${mimeType};base64,${base64}`;
  }

  // Handle banner image upload
  const bannerImageFile = formData.get("bannerImage");
  let bannerImageData = null;

  if (bannerImageFile && bannerImageFile.size > 0) {
    const bytes = await bannerImageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = bannerImageFile.type;
    bannerImageData = `data:${mimeType};base64,${base64}`;
  }

  const removeBannerImage = formData.get("removeBannerImage") === "on";

  const data = {
    name: formData.get("displayName"),
    bannerColor: formData.get("bannerColor"),
  };

  // Only update logo if a new one was uploaded
  if (logoData) {
    data.logo = logoData;
  }

  // Handle banner image
  if (removeBannerImage) {
    data.bannerImage = null;
  } else if (bannerImageData) {
    data.bannerImage = bannerImageData;
  }

  try {
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });
    revalidatePath("/[slug]/dashboard/manage", "page");
    revalidatePath("/[slug]", "page");
    revalidatePath("/[slug]/about", "page");
  } catch (error) {
    console.error("Error updating appearance:", error);
  }
}
