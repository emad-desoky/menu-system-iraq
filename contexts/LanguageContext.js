"use client";

import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  ar: {
    // Navigation
    menu: "القائمة",
    about: "من نحن",
    contact: "اتصل بنا",
    dashboard: "لوحة التحكم",

    // Common
    name: "الاسم",
    description: "الوصف",
    price: "السعر",
    salePrice: "سعر التخفيض",
    image: "الصورة",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    search: "بحث",
    filter: "تصفية",
    all: "الكل",
    available: "متوفر",
    notAvailable: "غير متوفر",
    sale: "تخفيض",
    quantity: "الكمية",
    checkout: "الدفع",
    emptyCart: "السلة فارغة",
    menuComingSoon: "القائمة قريباً",
    menuComingSoonDesc: "نحن نحضر شيئاً رائعاً لكم. يرجى المراجعة لاحقاً!",
    noImage: "لا توجد صورة",
    items: "عناصر",
    searchMenu: "البحث في القائمة",
    showAllCategories: "عرض جميع الفئات",
    viewDetails: "عرض التفاصيل",
    ingredients: "المكونات",
    allergens: "مسببات الحساسية",
  },
  en: {
    // Navigation
    menu: "Menu",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",

    // Common
    name: "Name",
    description: "Description",
    price: "Price",
    salePrice: "Sale Price",
    image: "Image",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    all: "All",
    available: "Available",
    notAvailable: "Not Available",
    sale: "Sale",
    quantity: "Quantity",
    checkout: "Checkout",
    emptyCart: "Your cart is empty",
    menuComingSoon: "Menu Coming Soon",
    menuComingSoonDesc:
      "We're preparing something amazing for you. Please check back later!",
    noImage: "No image",
    items: "items",
    searchMenu: "Search menu",
    showAllCategories: "Show All Categories",
    viewDetails: "View Details",
    ingredients: "Ingredients",
    allergens: "Allergens",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ar");
  const [isRTL, setIsRTL] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "ar";
    setLanguage(savedLanguage);
    setIsRTL(savedLanguage === "ar");
    document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLanguage;
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar";
    setLanguage(newLanguage);
    setIsRTL(newLanguage === "ar");
    localStorage.setItem("language", newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, isRTL, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
