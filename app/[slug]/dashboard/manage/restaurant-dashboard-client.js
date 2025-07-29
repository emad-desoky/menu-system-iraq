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
import { Plus, Trash2, ArrowLeft, ExternalLink, ImageIcon } from "lucide-react";
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
} from "./actions";

export default function RestaurantDashboardClient({ restaurant }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);

  const { t, isRTL } = useLanguage();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Link href={`/${restaurant.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToMenu")}
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {restaurant.name}
                </h1>
                <p className="text-gray-600">{t("restaurantManagement")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <Link href={`/${restaurant.slug}`} target="_blank">
                <Button
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("viewLiveMenu")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="categories">{t("categories")}</TabsTrigger>
            <TabsTrigger value="menu-items">{t("menuItems")}</TabsTrigger>
            <TabsTrigger value="about">{t("about")}</TabsTrigger>
            <TabsTrigger value="appearance">
              {t("restaurantAppearance")}
            </TabsTrigger>
            <TabsTrigger value="settings">
              {t("restaurantSettings")}
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl">
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
                    <form action={createCategory} className="space-y-4">
                      <input
                        type="hidden"
                        name="restaurantId"
                        value={restaurant.id}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">{t("categoryName")}</Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder={t("categoryName")}
                            required
                            className="mt-1"
                          />
                        </div>
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
                      </div>
                      <div>
                        <Label htmlFor="description">
                          {t("description")} ({t("optional")})
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder={t("briefDescription")}
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
                                src={categoryImagePreview || "/placeholder.svg"}
                                alt="Category preview"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700"
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {category.image && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <Image
                                  src={category.image || "/placeholder.svg"}
                                  alt={category.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {category.name}
                              </h3>
                              {category.description && (
                                <p className="text-gray-600 mb-3">
                                  {category.description}
                                </p>
                              )}
                              <Badge
                                variant="outline"
                                className="bg-orange-50 text-orange-700 border-orange-200"
                              >
                                {category.menuItems.length} {t("items")}
                              </Badge>
                            </div>
                          </div>
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
                    <CardTitle className="text-2xl">{t("menuItems")}</CardTitle>
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
                        <form action={createMenuItem} className="space-y-4">
                          <input
                            type="hidden"
                            name="restaurantId"
                            value={restaurant.id}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">{t("itemName")}</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder={t("itemName")}
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="price">{t("price")} ($)</Label>
                              <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                placeholder="19.99"
                                required
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="salePrice">
                                {t("salePrice")} ($) - {t("optional")}
                              </Label>
                              <Input
                                id="salePrice"
                                name="salePrice"
                                type="number"
                                step="0.01"
                                placeholder="15.99"
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {t("leaveEmptyIfNo")}
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="description">
                              {t("description")}
                            </Label>
                            <Textarea
                              id="description"
                              name="description"
                              placeholder={t("description")}
                              className="mt-1"
                            />
                          </div>

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

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
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
                              <Label htmlFor="isVegetarian">
                                {t("vegetarian")}
                              </Label>
                              <Select name="isVegetarian" defaultValue="false">
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">
                                    {t("vegetarian")}
                                  </SelectItem>
                                  <SelectItem value="false">لا</SelectItem>
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

                          <Button
                            type="submit"
                            className="bg-orange-600 hover:bg-orange-700"
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
                            {category.name}
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
                                <div className="aspect-video bg-gray-100 relative">
                                  {item.image ? (
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.imageAlt || item.name}
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
                                      {item.name}
                                    </h4>
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
                                  {item.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    <Badge
                                      variant="outline"
                                      className="text-orange-600 border-orange-600"
                                    >
                                      $
                                      {typeof item.price === "string"
                                        ? item.price
                                        : item.price.toString()}
                                    </Badge>
                                    {item.salePrice && (
                                      <Badge
                                        variant="outline"
                                        className="text-red-600 border-red-600"
                                      >
                                        {t("sale")}: $
                                        {typeof item.salePrice === "string"
                                          ? item.salePrice
                                          : item.salePrice.toString()}
                                      </Badge>
                                    )}
                                    <Badge
                                      variant={
                                        item.isAvailable
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        item.isAvailable ? "bg-green-600" : ""
                                      }
                                    >
                                      {item.isAvailable
                                        ? t("available")
                                        : t("notAvailable")}
                                    </Badge>
                                    {item.isVegetarian && (
                                      <Badge
                                        variant="outline"
                                        className="text-green-600 border-green-600"
                                      >
                                        {t("vegetarian")}
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          {category.menuItems.length === 0 && (
                            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">
                              لا توجد عناصر في هذه الفئة بعد.
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
                <CardTitle className="text-2xl">
                  {t("aboutUsInformation")}
                </CardTitle>
                <CardDescription>{t("tellCustomersAbout")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateAboutUs} className="space-y-6">
                  <input
                    type="hidden"
                    name="restaurantId"
                    value={restaurant.id}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <Label htmlFor="aboutStory">{t("ourStory")}</Label>
                      <Textarea
                        id="aboutStory"
                        name="aboutStory"
                        defaultValue={restaurant.aboutStory || ""}
                        placeholder={t("tellStoryHow")}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutMission">{t("ourMission")}</Label>
                      <Textarea
                        id="aboutMission"
                        name="aboutMission"
                        defaultValue={restaurant.aboutMission || ""}
                        placeholder={t("whatIsRestaurantMission")}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutVision">{t("ourVision")}</Label>
                      <Textarea
                        id="aboutVision"
                        name="aboutVision"
                        defaultValue={restaurant.aboutVision || ""}
                        placeholder={t("whatIsVisionFuture")}
                        rows={4}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="aboutChef">{t("ourChef")}</Label>
                      <Textarea
                        id="aboutChef"
                        name="aboutChef"
                        defaultValue={restaurant.aboutChef || ""}
                        placeholder={t("tellCustomersAboutChef")}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="aboutHistory">{t("ourHistory")}</Label>
                    <Textarea
                      id="aboutHistory"
                      name="aboutHistory"
                      defaultValue={restaurant.aboutHistory || ""}
                      placeholder={t("shareHistoryHeritage")}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

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

                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700"
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

                  {/* Restaurant Name */}
                  <div>
                    <Label htmlFor="displayName">{t("displayName")}</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      defaultValue={restaurant.name}
                      placeholder={t("displayName")}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      هذا الاسم سيظهر في الرأس وفي جميع أنحاء موقعك
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
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {t("updateAppearance")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
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
                      https://{restaurant.slug}.yourdomain.com
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
                      https://{restaurant.slug}.yourdomain.com/dashboard/manage
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
