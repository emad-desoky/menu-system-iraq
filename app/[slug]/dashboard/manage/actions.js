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
    name:
      formData.get("nameAr") || formData.get("nameEn") || "Unnamed Category",
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    description:
      formData.get("descriptionAr") || formData.get("descriptionEn") || null,
    descriptionAr: formData.get("descriptionAr") || null,
    descriptionEn: formData.get("descriptionEn") || null,
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
    name: formData.get("nameAr") || formData.get("nameEn") || "Unnamed Item",
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    description:
      formData.get("descriptionAr") || formData.get("descriptionEn") || null,
    descriptionAr: formData.get("descriptionAr") || null,
    descriptionEn: formData.get("descriptionEn") || null,
    price: Number.parseFloat(formData.get("price")),
    salePrice: salePriceValue,
    isAvailable: formData.get("isAvailable") === "true",
    isVegetarian: formData.get("isVegetarian") === "true",
    isVegan: formData.get("isVegan") === "true",
    isGlutenFree: formData.get("isGlutenFree") === "true",
    ingredients:
      formData.get("ingredientsAr") || formData.get("ingredientsEn") || null,
    ingredientsAr: formData.get("ingredientsAr") || null,
    ingredientsEn: formData.get("ingredientsEn") || null,
    allergens:
      formData.get("allergensAr") || formData.get("allergensEn") || null,
    allergensAr: formData.get("allergensAr") || null,
    allergensEn: formData.get("allergensEn") || null,
    sortOrder: Number.parseInt(formData.get("sortOrder")) || 0,
    restaurantId: formData.get("restaurantId"),
    categoryId: formData.get("categoryId"),
    image: imageData,
    imageAlt: formData.get("nameEn") || formData.get("nameAr"),
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
    if (
      googleMapsUrl.includes("goo.gl") ||
      googleMapsUrl.includes("maps.app.goo.gl")
    ) {
      // Keep the original URL for direct linking
    } else if (
      googleMapsUrl.includes("google.com/maps") &&
      !googleMapsUrl.includes("embed")
    ) {
      const urlParams = new URLSearchParams(googleMapsUrl.split("?")[1]);
      const query = urlParams.get("q") || urlParams.get("query");
      if (query) {
        googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
          query
        )}`;
      }
    }
  }

  // Handle image uploads for each about section
  const handleImageUpload = async (fileField) => {
    const imageFile = formData.get(fileField);
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString("base64");
      const mimeType = imageFile.type;
      return `data:${mimeType};base64,${base64}`;
    }
    return null;
  };

  const aboutStoryImage = await handleImageUpload("aboutStoryImage");
  const aboutMissionImage = await handleImageUpload("aboutMissionImage");
  const aboutVisionImage = await handleImageUpload("aboutVisionImage");
  const aboutChefImage = await handleImageUpload("aboutChefImage");
  const aboutHistoryImage = await handleImageUpload("aboutHistoryImage");

  const data = {
    aboutStoryAr: formData.get("aboutStoryAr") || null,
    aboutStoryEn: formData.get("aboutStoryEn") || null,
    aboutMissionAr: formData.get("aboutMissionAr") || null,
    aboutMissionEn: formData.get("aboutMissionEn") || null,
    aboutVisionAr: formData.get("aboutVisionAr") || null,
    aboutVisionEn: formData.get("aboutVisionEn") || null,
    aboutChefAr: formData.get("aboutChefAr") || null,
    aboutChefEn: formData.get("aboutChefEn") || null,
    aboutHistoryAr: formData.get("aboutHistoryAr") || null,
    aboutHistoryEn: formData.get("aboutHistoryEn") || null,
    googleMapsUrl: googleMapsUrl,
    facebookUrl: formData.get("facebookUrl") || null,
    instagramUrl: formData.get("instagramUrl") || null,
  };

  // Only update images if new ones were uploaded
  if (aboutStoryImage) data.aboutStoryImage = aboutStoryImage;
  if (aboutMissionImage) data.aboutMissionImage = aboutMissionImage;
  if (aboutVisionImage) data.aboutVisionImage = aboutVisionImage;
  if (aboutChefImage) data.aboutChefImage = aboutChefImage;
  if (aboutHistoryImage) data.aboutHistoryImage = aboutHistoryImage;

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
    name:
      formData.get("displayNameAr") ||
      formData.get("displayNameEn") ||
      formData.get("displayName"),
    nameAr: formData.get("displayNameAr"),
    nameEn: formData.get("displayNameEn"),
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
