"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  Languages,
  Facebook,
  Instagram,
  Edit,
  X,
  Save,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import {
  createCategory,
  createMenuItem,
  deleteCategory,
  deleteMenuItem,
  updateAboutUs,
  updateAppearance,
  updateCategory,
  updateMenuItem,
} from "./actions";

export default function RestaurantDashboardClient({ restaurant }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [editImagePreviews, setEditImagePreviews] = useState({});

  const { t, isRTL, language } = useLanguage();

  const getLocalizedText = (item, field) => {
    if (language === "ar") {
      return item[`${field}Ar`] || item[field] || "";
    }
    return item[`${field}En`] || item[field] || "";
  };

  const formatPrice = (price) => {
    return `${Number.parseFloat(price).toFixed(0)} IQD`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e, id, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreviews((prev) => ({
          ...prev,
          [`${type}_${id}`]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditingCategory = (category) => {
    setEditingCategory(category.id);
    setEditImagePreviews((prev) => ({
      ...prev,
      [`category_${category.id}`]: category.image,
    }));
  };

  const cancelEditingCategory = () => {
    setEditingCategory(null);
    setEditImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`category_${editingCategory}`];
      return newPreviews;
    });
  };

  const startEditingMenuItem = (item) => {
    setEditingMenuItem(item.id);
    setEditImagePreviews((prev) => ({
      ...prev,
      [`menuitem_${item.id}`]: item.image,
    }));
  };

  const cancelEditingMenuItem = () => {
    setEditingMenuItem(null);
    setEditImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`menuitem_${editingMenuItem}`];
      return newPreviews;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6 gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href={`/${restaurant.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900 p-1 sm:p-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">{t("backToMenu")}</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {getLocalizedText(restaurant, "name")}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {t("restaurantManagement")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageToggle />
              <Link href={`/${restaurant.slug}`} target="_blank">
                <Button
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t("viewLiveMenu")}</span>
                  <span className="sm:hidden">عرض</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Tabs defaultValue="categories" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
            <TabsTrigger
              value="categories"
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              {t("categories")}
            </TabsTrigger>
            <TabsTrigger
              value="menu-items"
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              {t("menuItems")}
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              {t("about")}
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              {t("restaurantAppearance")}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-xs sm:text-sm py-2 sm:py-3"
            >
              {t("restaurantSettings")}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Languages className="w-6 h-6 text-orange-600" />
                      {t("menuCategories")}
                    </CardTitle>
                    <CardDescription>{t("organizeMenu")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Category Form */}
                <Card className="border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800">
                      {t("addNewCategory")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form action={createCategory} className="space-y-6">
                      <input
                        type="hidden"
                        name="restaurantId"
                        value={restaurant.id}
                      />
                      {/* Bilingual Name Fields */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="nameAr"
                            className="flex items-center gap-2"
                          >
                            {t("categoryName")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Input
                            id="nameAr"
                            name="nameAr"
                            placeholder="اسم الفئة"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="nameEn"
                            className="flex items-center gap-2"
                          >
                            {t("categoryName")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Input
                            id="nameEn"
                            name="nameEn"
                            placeholder="Category Name"
                            required
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {/* Bilingual Description Fields */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="descriptionAr">
                            {t("description")} (العربية) - {t("optional")}
                          </Label>
                          <Textarea
                            id="descriptionAr"
                            name="descriptionAr"
                            placeholder="وصف مختصر للفئة..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="descriptionEn">
                            {t("description")} (English) - {t("optional")}
                          </Label>
                          <Textarea
                            id="descriptionEn"
                            name="descriptionEn"
                            placeholder="Brief description of this category..."
                            className="mt-1"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="sortOrder">{t("sortOrder")}</Label>
                          <Input
                            id="sortOrder"
                            name="sortOrder"
                            type="number"
                            defaultValue="0"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="categoryImage">
                            {t("categoryImage")}
                          </Label>
                          <div className="mt-1 flex items-center space-x-4">
                            <Input
                              id="categoryImage"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleCategoryImageChange}
                              className="flex-1"
                            />
                            {categoryImagePreview && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border">
                                <Image
                                  src={
                                    categoryImagePreview || "/placeholder.svg"
                                  }
                                  alt="Category preview"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t("addCategory")}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Categories List */}
                <div className="space-y-4">
                  {restaurant.categories.map((category) => (
                    <Card
                      key={category.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-6">
                        {editingCategory === category.id ? (
                          // Edit Form
                          <form
                            action={updateCategory}
                            className="space-y-4"
                            onSubmit={() => {
                              setTimeout(() => setEditingCategory(null), 100);
                            }}
                          >
                            <input
                              type="hidden"
                              name="categoryId"
                              value={category.id}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`edit-nameAr-${category.id}`}>
                                  {t("categoryName")} (العربية)
                                </Label>
                                <Input
                                  id={`edit-nameAr-${category.id}`}
                                  name="nameAr"
                                  defaultValue={category.nameAr || ""}
                                  placeholder="اسم الفئة"
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`edit-nameEn-${category.id}`}>
                                  {t("categoryName")} (English)
                                </Label>
                                <Input
                                  id={`edit-nameEn-${category.id}`}
                                  name="nameEn"
                                  defaultValue={category.nameEn || ""}
                                  placeholder="Category Name"
                                  className="mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor={`edit-descriptionAr-${category.id}`}
                                >
                                  {t("description")} (العربية)
                                </Label>
                                <Textarea
                                  id={`edit-descriptionAr-${category.id}`}
                                  name="descriptionAr"
                                  defaultValue={category.descriptionAr || ""}
                                  placeholder="وصف مختصر للفئة..."
                                  className="mt-1"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor={`edit-descriptionEn-${category.id}`}
                                >
                                  {t("description")} (English)
                                </Label>
                                <Textarea
                                  id={`edit-descriptionEn-${category.id}`}
                                  name="descriptionEn"
                                  defaultValue={category.descriptionEn || ""}
                                  placeholder="Brief description..."
                                  className="mt-1"
                                  rows={2}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor={`edit-sortOrder-${category.id}`}
                                >
                                  {t("sortOrder")}
                                </Label>
                                <Input
                                  id={`edit-sortOrder-${category.id}`}
                                  name="sortOrder"
                                  type="number"
                                  defaultValue={category.sortOrder || 0}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <Label htmlFor={`edit-image-${category.id}`}>
                                  {t("categoryImage")}
                                </Label>
                                <div className="mt-1 flex items-center space-x-4">
                                  <Input
                                    id={`edit-image-${category.id}`}
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleEditImageChange(
                                        e,
                                        category.id,
                                        "category"
                                      )
                                    }
                                    className="flex-1"
                                  />
                                  {(editImagePreviews[
                                    `category_${category.id}`
                                  ] ||
                                    category.image) && (
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border">
                                      <Image
                                        src={
                                          editImagePreviews[
                                            `category_${
                                              category.id || "/placeholder.svg"
                                            }`
                                          ] ||
                                          category.image ||
                                          "/placeholder.svg"
                                        }
                                        alt="Category preview"
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                type="submit"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                {t("save")}
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={cancelEditingCategory}
                              >
                                <X className="w-4 h-4 mr-2" />
                                {t("cancel")}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          // Display Mode
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {category.image && (
                                <div className="w-16 h-16 rounded-lg overflow-hidden">
                                  <Image
                                    src={category.image || "/placeholder.svg"}
                                    alt={getLocalizedText(category, "name")}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                  {getLocalizedText(category, "name")}
                                </h3>
                                {getLocalizedText(category, "description") && (
                                  <p className="text-gray-600 mb-3">
                                    {getLocalizedText(category, "description")}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-50 text-orange-700 border-orange-200"
                                  >
                                    {category.menuItems.length} {t("items")}
                                  </Badge>
                                  {category.nameAr && category.nameEn && (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      <Languages className="w-3 h-3 mr-1" />
                                      {t("bilingual")}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditingCategory(category)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <form action={deleteCategory}>
                                <input
                                  type="hidden"
                                  name="categoryId"
                                  value={category.id}
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  type="submit"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </form>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Items Tab */}
          <TabsContent value="menu-items">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Languages className="w-6 h-6 text-orange-600" />
                      {t("menuItems")}
                    </CardTitle>
                    <CardDescription>{t("manageMenuItems")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {restaurant.categories.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">
                      {t("createCategoryFirst")}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Add Menu Item Form */}
                    <Card className="border-orange-200 bg-orange-50/50">
                      <CardHeader>
                        <CardTitle className="text-lg text-orange-800">
                          {t("addNewMenuItem")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form action={createMenuItem} className="space-y-6">
                          <input
                            type="hidden"
                            name="restaurantId"
                            value={restaurant.id}
                          />
                          {/* Bilingual Name Fields */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="nameAr"
                                className="flex items-center gap-2"
                              >
                                {t("itemName")} (العربية)
                                <Badge variant="outline" className="text-xs">
                                  AR
                                </Badge>
                              </Label>
                              <Input
                                id="nameAr"
                                name="nameAr"
                                placeholder="اسم الطبق"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor="nameEn"
                                className="flex items-center gap-2"
                              >
                                {t("itemName")} (English)
                                <Badge variant="outline" className="text-xs">
                                  EN
                                </Badge>
                              </Label>
                              <Input
                                id="nameEn"
                                name="nameEn"
                                placeholder="Dish Name"
                                required
                                className="mt-1"
                              />
                            </div>
                          </div>
                          {/* Bilingual Description Fields */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="descriptionAr">
                                {t("description")} (العربية)
                              </Label>
                              <Textarea
                                id="descriptionAr"
                                name="descriptionAr"
                                placeholder="وصف الطبق والمكونات والتحضير..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                            <div>
                              <Label htmlFor="descriptionEn">
                                {t("description")} (English)
                              </Label>
                              <Textarea
                                id="descriptionEn"
                                name="descriptionEn"
                                placeholder="Describe the dish, ingredients, preparation..."
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>
                          {/* Price Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="price">{t("price")} (IQD)</Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="1"
                                placeholder="25000"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="salePrice">
                                {t("salePrice")} (IQD) - {t("optional")}
                              </Label>
                              <Input
                                id="salePrice"
                                name="salePrice"
                                type="number"
                                step="1"
                                placeholder="20000"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="categoryId">
                                {t("categories")}
                              </Label>
                              <Select name="categoryId" required>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder={t("categories")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {restaurant.categories.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {getLocalizedText(category, "name")}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {/* Bilingual Ingredients & Allergens */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="ingredientsAr">
                                {t("ingredients")} (العربية) - {t("optional")}
                              </Label>
                              <Textarea
                                id="ingredientsAr"
                                name="ingredientsAr"
                                placeholder="المكونات..."
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="ingredientsEn">
                                {t("ingredients")} (English) - {t("optional")}
                              </Label>
                              <Textarea
                                id="ingredientsEn"
                                name="ingredientsEn"
                                placeholder="Ingredients..."
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="allergensAr">
                                {t("allergens")} (العربية) - {t("optional")}
                              </Label>
                              <Textarea
                                id="allergensAr"
                                name="allergensAr"
                                placeholder="مسببات الحساسية..."
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="allergensEn">
                                {t("allergens")} (English) - {t("optional")}
                              </Label>
                              <Textarea
                                id="allergensEn"
                                name="allergensEn"
                                placeholder="Allergens..."
                                className="mt-1"
                                rows={2}
                              />
                            </div>
                          </div>
                          {/* Image and Options */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="image">{t("itemImage")}</Label>
                              <div className="mt-1 flex items-center space-x-4">
                                <Input
                                  id="image"
                                  name="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  className="flex-1"
                                />
                                {imagePreview && (
                                  <div className="w-16 h-16 rounded-lg overflow-hidden border">
                                    <Image
                                      src={imagePreview || "/placeholder.svg"}
                                      alt="Preview"
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="isAvailable">
                                  {t("availability")}
                                </Label>
                                <Select name="isAvailable" defaultValue="true">
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="true">
                                      {t("available")}
                                    </SelectItem>
                                    <SelectItem value="false">
                                      {t("notAvailable")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="sortOrder">
                                  {t("sortOrder")}
                                </Label>
                                <Input
                                  id="sortOrder"
                                  name="sortOrder"
                                  type="number"
                                  defaultValue="0"
                                  className="mt-1"
                                />
                              </div>
                            </div>
                          </div>
                          {/* Dietary Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="isVegetarian">
                                {t("vegetarian")}
                              </Label>
                              <Select name="isVegetarian" defaultValue="false">
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">
                                    {t("yes")}
                                  </SelectItem>
                                  <SelectItem value="false">
                                    {t("no")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="isVegan">{t("vegan")}</Label>
                              <Select name="isVegan" defaultValue="false">
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">
                                    {t("yes")}
                                  </SelectItem>
                                  <SelectItem value="false">
                                    {t("no")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="isGlutenFree">
                                {t("glutenFree")}
                              </Label>
                              <Select name="isGlutenFree" defaultValue="false">
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">
                                    {t("yes")}
                                  </SelectItem>
                                  <SelectItem value="false">
                                    {t("no")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {t("addMenuItem")}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Menu Items List */}
                    <div className="space-y-6">
                      {restaurant.categories.map((category) => (
                        <div key={category.id}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            {getLocalizedText(category, "name")}
                            <Badge variant="outline" className="ml-2">
                              {category.menuItems.length} {t("items")}
                            </Badge>
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {category.menuItems.map((item) => (
                              <Card
                                key={item.id}
                                className="hover:shadow-md transition-shadow"
                              >
                                {editingMenuItem === item.id ? (
                                  // Edit Form for Menu Item
                                  <form
                                    action={updateMenuItem}
                                    className="p-4 space-y-4"
                                    onSubmit={() => {
                                      setTimeout(
                                        () => setEditingMenuItem(null),
                                        100
                                      );
                                    }}
                                  >
                                    <input
                                      type="hidden"
                                      name="menuItemId"
                                      value={item.id}
                                    />

                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-nameAr-${item.id}`}
                                        >
                                          {t("itemName")} (العربية)
                                        </Label>
                                        <Input
                                          id={`edit-item-nameAr-${item.id}`}
                                          name="nameAr"
                                          defaultValue={item.nameAr || ""}
                                          placeholder="اسم الطبق"
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-nameEn-${item.id}`}
                                        >
                                          {t("itemName")} (English)
                                        </Label>
                                        <Input
                                          id={`edit-item-nameEn-${item.id}`}
                                          name="nameEn"
                                          defaultValue={item.nameEn || ""}
                                          placeholder="Dish Name"
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-descriptionAr-${item.id}`}
                                        >
                                          {t("description")} (العربية)
                                        </Label>
                                        <Textarea
                                          id={`edit-item-descriptionAr-${item.id}`}
                                          name="descriptionAr"
                                          defaultValue={
                                            item.descriptionAr || ""
                                          }
                                          placeholder="وصف الطبق..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-descriptionEn-${item.id}`}
                                        >
                                          {t("description")} (English)
                                        </Label>
                                        <Textarea
                                          id={`edit-item-descriptionEn-${item.id}`}
                                          name="descriptionEn"
                                          defaultValue={
                                            item.descriptionEn || ""
                                          }
                                          placeholder="Dish description..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-price-${item.id}`}
                                        >
                                          {t("price")} (IQD)
                                        </Label>
                                        <Input
                                          id={`edit-item-price-${item.id}`}
                                          name="price"
                                          type="number"
                                          defaultValue={item.price}
                                          className="mt-1"
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-salePrice-${item.id}`}
                                        >
                                          {t("salePrice")} (IQD)
                                        </Label>
                                        <Input
                                          id={`edit-item-salePrice-${item.id}`}
                                          name="salePrice"
                                          type="number"
                                          defaultValue={item.salePrice || ""}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor={`edit-item-categoryId-${item.id}`}
                                      >
                                        {t("categories")}
                                      </Label>
                                      <Select
                                        name="categoryId"
                                        defaultValue={item.categoryId}
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {restaurant.categories.map((cat) => (
                                            <SelectItem
                                              key={cat.id}
                                              value={cat.id}
                                            >
                                              {getLocalizedText(cat, "name")}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Availability and Dietary Options */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-isAvailable-${item.id}`}
                                        >
                                          {t("availability")}
                                        </Label>
                                        <Select
                                          name="isAvailable"
                                          defaultValue={item.isAvailable.toString()}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="true">
                                              {t("available")}
                                            </SelectItem>
                                            <SelectItem value="false">
                                              {t("notAvailable")}
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-sortOrder-${item.id}`}
                                        >
                                          {t("sortOrder")}
                                        </Label>
                                        <Input
                                          id={`edit-item-sortOrder-${item.id}`}
                                          name="sortOrder"
                                          type="number"
                                          defaultValue={item.sortOrder || 0}
                                          className="mt-1"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-isVegetarian-${item.id}`}
                                        >
                                          {t("vegetarian")}
                                        </Label>
                                        <Select
                                          name="isVegetarian"
                                          defaultValue={item.isVegetarian.toString()}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="true">
                                              {t("yes")}
                                            </SelectItem>
                                            <SelectItem value="false">
                                              {t("no")}
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-isVegan-${item.id}`}
                                        >
                                          {t("vegan")}
                                        </Label>
                                        <Select
                                          name="isVegan"
                                          defaultValue={item.isVegan.toString()}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="true">
                                              {t("yes")}
                                            </SelectItem>
                                            <SelectItem value="false">
                                              {t("no")}
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-isGlutenFree-${item.id}`}
                                        >
                                          {t("glutenFree")}
                                        </Label>
                                        <Select
                                          name="isGlutenFree"
                                          defaultValue={item.isGlutenFree.toString()}
                                        >
                                          <SelectTrigger className="mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="true">
                                              {t("yes")}
                                            </SelectItem>
                                            <SelectItem value="false">
                                              {t("no")}
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>

                                    {/* Ingredients and Allergens */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-ingredientsAr-${item.id}`}
                                        >
                                          {t("ingredients")} (العربية) -{" "}
                                          {t("optional")}
                                        </Label>
                                        <Textarea
                                          id={`edit-item-ingredientsAr-${item.id}`}
                                          name="ingredientsAr"
                                          defaultValue={
                                            item.ingredientsAr || ""
                                          }
                                          placeholder="المكونات..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-ingredientsEn-${item.id}`}
                                        >
                                          {t("ingredients")} (English) -{" "}
                                          {t("optional")}
                                        </Label>
                                        <Textarea
                                          id={`edit-item-ingredientsEn-${item.id}`}
                                          name="ingredientsEn"
                                          defaultValue={
                                            item.ingredientsEn || ""
                                          }
                                          placeholder="Ingredients..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-allergensAr-${item.id}`}
                                        >
                                          {t("allergens")} (العربية) -{" "}
                                          {t("optional")}
                                        </Label>
                                        <Textarea
                                          id={`edit-item-allergensAr-${item.id}`}
                                          name="allergensAr"
                                          defaultValue={item.allergensAr || ""}
                                          placeholder="مسببات الحساسية..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                      <div>
                                        <Label
                                          htmlFor={`edit-item-allergensEn-${item.id}`}
                                        >
                                          {t("allergens")} (English) -{" "}
                                          {t("optional")}
                                        </Label>
                                        <Textarea
                                          id={`edit-item-allergensEn-${item.id}`}
                                          name="allergensEn"
                                          defaultValue={item.allergensEn || ""}
                                          placeholder="Allergens..."
                                          className="mt-1"
                                          rows={2}
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <Label
                                        htmlFor={`edit-item-image-${item.id}`}
                                      >
                                        {t("itemImage")}
                                      </Label>
                                      <div className="mt-1 flex items-center space-x-4">
                                        <Input
                                          id={`edit-item-image-${item.id}`}
                                          name="image"
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) =>
                                            handleEditImageChange(
                                              e,
                                              item.id,
                                              "menuitem"
                                            )
                                          }
                                          className="flex-1"
                                        />
                                        {(editImagePreviews[
                                          `menuitem_${item.id}`
                                        ] ||
                                          item.image) && (
                                          <div className="w-16 h-16 rounded-lg overflow-hidden border">
                                            <Image
                                              src={
                                                editImagePreviews[
                                                  `menuitem_${
                                                    item.id ||
                                                    "/placeholder.svg"
                                                  }`
                                                ] ||
                                                item.image ||
                                                "/placeholder.svg"
                                              }
                                              alt="Item preview"
                                              width={64}
                                              height={64}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex gap-2">
                                      <Button
                                        type="submit"
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Save className="w-4 h-4 mr-2" />
                                        {t("save")}
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={cancelEditingMenuItem}
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        {t("cancel")}
                                      </Button>
                                    </div>
                                  </form>
                                ) : (
                                  // Display Mode for Menu Item
                                  <>
                                    <div className="aspect-video bg-gray-100 relative">
                                      {item.image ? (
                                        <Image
                                          src={item.image || "/placeholder.svg"}
                                          alt={
                                            item.imageAlt ||
                                            getLocalizedText(item, "name")
                                          }
                                          fill
                                          className="object-cover rounded-t-lg"
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center h-full">
                                          <ImageIcon className="w-12 h-12 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-900">
                                          {getLocalizedText(item, "name")}
                                        </h4>
                                        <div className="flex gap-1">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                              startEditingMenuItem(item)
                                            }
                                          >
                                            <Edit className="w-3 h-3" />
                                          </Button>
                                          <form action={deleteMenuItem}>
                                            <input
                                              type="hidden"
                                              name="menuItemId"
                                              value={item.id}
                                            />
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              type="submit"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </form>
                                        </div>
                                      </div>
                                      {getLocalizedText(
                                        item,
                                        "description"
                                      ) && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                          {getLocalizedText(
                                            item,
                                            "description"
                                          )}
                                        </p>
                                      )}
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        <Badge
                                          variant="outline"
                                          className="text-orange-600 border-orange-600"
                                        >
                                          {formatPrice(item.price)}
                                        </Badge>
                                        {item.salePrice && (
                                          <Badge
                                            variant="outline"
                                            className="text-red-600 border-red-600"
                                          >
                                            {t("sale")}:{" "}
                                            {formatPrice(item.salePrice)}
                                          </Badge>
                                        )}
                                        <Badge
                                          variant={
                                            item.isAvailable
                                              ? "default"
                                              : "secondary"
                                          }
                                          className={
                                            item.isAvailable
                                              ? "bg-green-600"
                                              : ""
                                          }
                                        >
                                          {item.isAvailable
                                            ? t("available")
                                            : t("notAvailable")}
                                        </Badge>
                                        {item.nameAr && item.nameEn && (
                                          <Badge
                                            variant="outline"
                                            className="bg-green-50 text-green-700 border-green-200"
                                          >
                                            <Languages className="w-3 h-3 mr-1" />
                                            {t("bilingual")}
                                          </Badge>
                                        )}
                                      </div>
                                    </CardContent>
                                  </>
                                )}
                              </Card>
                            ))}
                          </div>
                          {category.menuItems.length === 0 && (
                            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                              {t("noItemsInCategory")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Us Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Languages className="w-6 h-6 text-orange-600" />
                  {t("aboutUsInformation")}
                </CardTitle>
                <CardDescription>{t("tellCustomersAbout")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateAboutUs} className="space-y-8">
                  <input
                    type="hidden"
                    name="restaurantId"
                    value={restaurant.id}
                  />
                  {/* Our Story - Bilingual with Image */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {t("ourStory")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aboutStoryImage">
                          {t("image")} - {t("optional")}
                        </Label>
                        <Input
                          id="aboutStoryImage"
                          name="aboutStoryImage"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="aboutStoryAr"
                            className="flex items-center gap-2"
                          >
                            {t("ourStory")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutStoryAr"
                            name="aboutStoryAr"
                            defaultValue={restaurant.aboutStoryAr || ""}
                            placeholder="احك قصة كيف بدأ مطعمك..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="aboutStoryEn"
                            className="flex items-center gap-2"
                          >
                            {t("ourStory")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutStoryEn"
                            name="aboutStoryEn"
                            defaultValue={restaurant.aboutStoryEn || ""}
                            placeholder="Tell the story of how your restaurant began..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Mission - Bilingual with Image */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {t("ourMission")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aboutMissionImage">
                          {t("image")} - {t("optional")}
                        </Label>
                        <Input
                          id="aboutMissionImage"
                          name="aboutMissionImage"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="aboutMissionAr"
                            className="flex items-center gap-2"
                          >
                            {t("ourMission")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutMissionAr"
                            name="aboutMissionAr"
                            defaultValue={restaurant.aboutMissionAr || ""}
                            placeholder="ما هي مهمة مطعمك؟"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="aboutMissionEn"
                            className="flex items-center gap-2"
                          >
                            {t("ourMission")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutMissionEn"
                            name="aboutMissionEn"
                            defaultValue={restaurant.aboutMissionEn || ""}
                            placeholder="What is your restaurant's mission?"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Vision - Bilingual with Image */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {t("ourVision")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aboutVisionImage">
                          {t("image")} - {t("optional")}
                        </Label>
                        <Input
                          id="aboutVisionImage"
                          name="aboutVisionImage"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="aboutVisionAr"
                            className="flex items-center gap-2"
                          >
                            {t("ourVision")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutVisionAr"
                            name="aboutVisionAr"
                            defaultValue={restaurant.aboutVisionAr || ""}
                            placeholder="ما هي رؤيتك للمستقبل؟"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="aboutVisionEn"
                            className="flex items-center gap-2"
                          >
                            {t("ourVision")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutVisionEn"
                            name="aboutVisionEn"
                            defaultValue={restaurant.aboutVisionEn || ""}
                            placeholder="What is your vision for the future?"
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Chef - Bilingual with Image */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {t("ourChef")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aboutChefImage">
                          {t("image")} - {t("optional")}
                        </Label>
                        <Input
                          id="aboutChefImage"
                          name="aboutChefImage"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="aboutChefAr"
                            className="flex items-center gap-2"
                          >
                            {t("ourChef")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutChefAr"
                            name="aboutChefAr"
                            defaultValue={restaurant.aboutChefAr || ""}
                            placeholder="أخبر العملاء عن الشيف الرئيسي..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="aboutChefEn"
                            className="flex items-center gap-2"
                          >
                            {t("ourChef")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutChefEn"
                            name="aboutChefEn"
                            defaultValue={restaurant.aboutChefEn || ""}
                            placeholder="Tell customers about your head chef..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* History - Bilingual with Image */}
                  <div className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      {t("ourHistory")}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="aboutHistoryImage">
                          {t("image")} - {t("optional")}
                        </Label>
                        <Input
                          id="aboutHistoryImage"
                          name="aboutHistoryImage"
                          type="file"
                          accept="image/*"
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="aboutHistoryAr"
                            className="flex items-center gap-2"
                          >
                            {t("ourHistory")} (العربية)
                            <Badge variant="outline" className="text-xs">
                              AR
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutHistoryAr"
                            name="aboutHistoryAr"
                            defaultValue={restaurant.aboutHistoryAr || ""}
                            placeholder="شارك تاريخ وتراث مطعمك..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="aboutHistoryEn"
                            className="flex items-center gap-2"
                          >
                            {t("ourHistory")} (English)
                            <Badge variant="outline" className="text-xs">
                              EN
                            </Badge>
                          </Label>
                          <Textarea
                            id="aboutHistoryEn"
                            name="aboutHistoryEn"
                            defaultValue={restaurant.aboutHistoryEn || ""}
                            placeholder="Share the history and heritage of your restaurant..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Google Maps and Social Media - Keep as before */}
                  <div>
                    <Label htmlFor="googleMapsUrl">{t("googleMapsUrl")}</Label>
                    <Input
                      id="googleMapsUrl"
                      name="googleMapsUrl"
                      defaultValue={restaurant.googleMapsUrl || ""}
                      placeholder="https://maps.app.goo.gl/VdQhydFBJi8V7rQy7"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      يمكنك استخدام رابط مباشر من خرائط جوجل أو رابط التضمين
                    </p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="facebookUrl"
                        className="flex items-center gap-2"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook Page URL
                      </Label>
                      <Input
                        id="facebookUrl"
                        name="facebookUrl"
                        defaultValue={restaurant.facebookUrl || ""}
                        placeholder="https://facebook.com/yourrestaurant"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="instagramUrl"
                        className="flex items-center gap-2"
                      >
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram Page URL
                      </Label>
                      <Input
                        id="instagramUrl"
                        name="instagramUrl"
                        defaultValue={restaurant.instagramUrl || ""}
                        placeholder="https://instagram.com/yourrestaurant"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                  >
                    {t("save")} {t("aboutUsInformation")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("restaurantAppearance")}
                </CardTitle>
                <CardDescription>
                  {t("customizeVisualIdentity")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateAppearance} className="space-y-8">
                  <input
                    type="hidden"
                    name="restaurantId"
                    value={restaurant.id}
                  />
                  {/* Bilingual Restaurant Name */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="displayNameAr"
                        className="flex items-center gap-2"
                      >
                        {t("displayName")} (العربية)
                        <Badge variant="outline" className="text-xs">
                          AR
                        </Badge>
                      </Label>
                      <Input
                        id="displayNameAr"
                        name="displayNameAr"
                        defaultValue={restaurant.nameAr || restaurant.name}
                        placeholder="اسم المطعم المعروض"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="displayNameEn"
                        className="flex items-center gap-2"
                      >
                        {t("displayName")} (English)
                        <Badge variant="outline" className="text-xs">
                          EN
                        </Badge>
                      </Label>
                      <Input
                        id="displayNameEn"
                        name="displayNameEn"
                        defaultValue={restaurant.nameEn || restaurant.name}
                        placeholder="Restaurant display name"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {/* Logo Upload */}
                  <div>
                    <Label htmlFor="logo">{t("restaurantLogo")}</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      <Input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="flex-1"
                      />
                      {(logoPreview || restaurant.logo) && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border bg-white p-2">
                          <Image
                            src={
                              logoPreview ||
                              restaurant.logo ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Logo preview"
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {t("uploadSquareLogo")}
                    </p>
                  </div>
                  {/* Banner Color */}
                  <div>
                    <Label htmlFor="bannerColor">{t("bannerColor")}</Label>
                    <div className="mt-2 flex items-center space-x-4">
                      <Input
                        id="bannerColor"
                        name="bannerColor"
                        type="color"
                        defaultValue={restaurant.bannerColor || "#ea580c"}
                        className="w-20 h-12 p-1 border rounded-lg"
                      />
                      <Input
                        type="text"
                        defaultValue={restaurant.bannerColor || "#ea580c"}
                        placeholder="#ea580c"
                        className="flex-1"
                        onChange={(e) => {
                          const colorInput =
                            document.getElementById("bannerColor");
                          if (colorInput) colorInput.value = e.target.value;
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {t("choosePrimaryColor")}
                    </p>
                  </div>
                  {/* Banner Background Image */}
                  <div>
                    <Label htmlFor="bannerImage">
                      {t("bannerBackgroundImage")} ({t("optional")})
                    </Label>
                    <div className="mt-2 space-y-4">
                      <Input
                        id="bannerImage"
                        name="bannerImage"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageChange}
                      />
                      {(bannerImagePreview || restaurant.bannerImage) && (
                        <div className="w-full h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={
                              bannerImagePreview ||
                              restaurant.bannerImage ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Banner preview"
                            width={400}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="removeBannerImage"
                            className="rounded"
                          />
                          <span className="text-sm text-gray-600">
                            {t("removeBackgroundImage")}
                          </span>
                        </label>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      ارفع صورة خلفية لرأس موقعك. ستُعرض بشفافية 75% وسطوع
                      للحصول على قراءة أفضل للنص.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                  >
                    {t("updateAppearance")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab - UPDATED WITH CORRECT DOMAIN */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("restaurantSettings")}
                </CardTitle>
                <CardDescription>{t("manageBasicInfo")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">
                      {t("restaurantUrl")}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("menuAvailableAt")}
                    </p>
                    <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
                      https://cq-menu.com/{restaurant.slug}
                    </code>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">
                      {t("dashboardAccess")}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {t("dashboardUrl")}
                    </p>
                    <code className="block mt-2 p-2 bg-gray-100 rounded text-sm">
                      https://cq-menu.com/{restaurant.slug}/dashboard/manage
                    </code>
                    <p className="text-xs text-gray-500 mt-2">
                      {t("password")}: {restaurant.password}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
