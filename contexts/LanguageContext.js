"use client";

import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  ar: {
    // Navigation
    menu: "القائمة",
    about: "من نحن",
    contact: "اتصل بنا",
    dashboard: "لوحة التحكم",
    backToMenu: "العودة للقائمة",
    viewLiveMenu: "عرض القائمة المباشرة",

    // Admin Dashboard
    adminDashboard: "لوحة تحكم المدير",
    manageAllRestaurants: "إدارة جميع المطاعم في النظام",
    addNewRestaurant: "إضافة مطعم جديد",
    restaurantName: "اسم المطعم",
    restaurantPassword: "كلمة مرور المطعم",
    subdomainSlug: "رابط النطاق الفرعي",
    createRestaurant: "إنشاء مطعم",
    allRestaurants: "جميع المطاعم",
    noRestaurantsYet: "لا توجد مطاعم بعد",
    createFirstRestaurant: "أنشئ أول مطعم لك",

    // Restaurant Dashboard
    restaurantManagement: "إدارة المطعم",
    menuCategories: "فئات القائمة",
    organizeMenu: "تنظيم قائمتك في فئات للتنقل بشكل أفضل",
    addNewCategory: "إضافة فئة جديدة",
    addNewMenuItem: "إضافة عنصر قائمة جديد",
    manageMenuItems: "إدارة عناصر القائمة وأسعارها وتوفرها",
    aboutUsInformation: "معلومات من نحن",
    tellCustomersAbout: "أخبر عملاءك عن قصة مطعمك ومهمته وقيمه",
    restaurantAppearance: "مظهر المطعم",
    customizeVisualIdentity: "تخصيص الهوية البصرية والعلامة التجارية لمطعمك",
    restaurantSettings: "إعدادات المطعم",
    manageBasicInfo: "إدارة المعلومات الأساسية وتفاصيل الوصول لمطعمك",

    // Categories
    categories: "الفئات",
    categoryName: "اسم الفئة",
    categoryImage: "صورة الفئة",
    addCategory: "إضافة فئة",
    sortOrder: "ترتيب العرض",

    // Menu Items
    menuItems: "عناصر القائمة",
    itemName: "اسم العنصر",
    itemImage: "صورة العنصر",
    addMenuItem: "إضافة عنصر قائمة",
    availability: "التوفر",
    vegetarian: "نباتي",
    vegan: "نباتي صرف",
    glutenFree: "خالي من الجلوتين",
    createCategoryFirst:
      "يرجى إنشاء فئة واحدة على الأقل قبل إضافة عناصر القائمة.",
    noItemsInCategory: "لا توجد عناصر في هذه الفئة بعد.",
    noItemsFound: "لم يتم العثور على عناصر.",

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
    total: "المجموع",
    yes: "نعم",
    no: "لا",
    bilingual: "ثنائي اللغة",

    // Menu
    ourMenu: "قائمتنا",
    menuComingSoon: "القائمة قريباً",
    menuComingSoonDesc: "نحن نحضر شيئاً رائعاً لكم. يرجى المراجعة لاحقاً!",
    noImage: "لا توجد صورة",
    items: "عناصر",
    searchMenu: "البحث في القائمة",
    showAllCategories: "عرض جميع الفئات",
    viewDetails: "عرض التفاصيل",
    addToCart: "أضف للسلة",
    cart: "السلة",
    ingredients: "المكونات",
    allergens: "مسببات الحساسية",

    // About sections
    ourStory: "قصتنا",
    ourMission: "مهمتنا",
    ourVision: "رؤيتنا",
    ourChef: "الشيف",
    ourHistory: "تاريخنا",
    visitUs: "زورونا",

    // Contact
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    location: "الموقع",

    // Appearance
    restaurantLogo: "شعار المطعم",
    displayName: "الاسم المعروض",
    bannerColor: "لون البانر",
    bannerBackgroundImage: "صورة خلفية البانر",
    updateAppearance: "تحديث المظهر",
    uploadSquareLogo: "ارفع شعاراً مربعاً (مُوصى به: 200x200 بكسل)",
    choosePrimaryColor: "اختر اللون الأساسي لرأس مطعمك والتفاصيل",
    removeBackgroundImage: "إزالة صورة الخلفية",

    // Settings
    restaurantUrl: "رابط المطعم",
    menuAvailableAt: "قائمتك متاحة على:",
    dashboardAccess: "الوصول للوحة التحكم",
    dashboardUrl: "رابط لوحة التحكم:",
    password: "كلمة المرور",

    // Footer
    allRightsReserved: "جميع الحقوق محفوظة",
    followUs: "تابعونا",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات الاتصال",

    // Forms
    required: "مطلوب",
    optional: "اختياري",
    leaveEmptyIfNo: "اتركه فارغاً إذا لم يكن هناك",
    briefDescription: "وصف مختصر",
    tellStoryHow: "احك قصة كيف بدأ مطعمك...",
    whatIsRestaurantMission: "ما هي مهمة مطعمك؟",
    whatIsVisionFuture: "ما هي رؤيتك للمستقبل؟",
    tellCustomersAboutChef: "أخبر العملاء عن الشيف الرئيسي...",
    shareHistoryHeritage: "شارك تاريخ وتراث مطعمك...",
    getEmbedUrl:
      "احصل على رابط التضمين من خرائط جوجل بالنقر على 'مشاركة' ← 'تضمين خريطة'",

    // Status
    active: "نشط",
    inactive: "غير نشط",
    loading: "جاري التحميل...",
    loadingMenu: "جاري تحميل القائمة...",

    // Actions
    logout: "تسجيل الخروج",
    signOut: "تسجيل الخروج",
    backToHome: "العودة للرئيسية",

    // Login
    adminLogin: "تسجيل دخول المدير",
    signInToManage: "سجل دخولك لإدارة المطاعم",
    signInAsAdmin: "تسجيل الدخول كمدير",

    // Home page
    revolutionizingRestaurant: "ثورة في إدارة المطاعم",
    streamlineOperations:
      "بسّط عمليات مطعمك مع نظام القائمة الرقمية الشامل. من عروض القوائم الأنيقة إلى أدوات الإدارة القوية.",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    chooseAccessLevel: "اختر مستوى الوصول",
    managingMultipleRestaurants:
      "سواء كنت تدير عدة مطاعم أو تدير مؤسستك الخاصة",
    systemAdministrator: "مدير النظام",
    manageMultipleRestaurants:
      "إدارة عدة مطاعم، الإشراف على العمليات، والتحكم في المنصة بالكامل",
    adminPassword: "كلمة مرور المدير",
    enterAdminPassword: "أدخل كلمة مرور المدير",
    accessAdminDashboard: "الوصول للوحة تحكم المدير",
    restaurantOwner: "صاحب المطعم",
    manageRestaurantMenu:
      "إدارة قائمة مطعمك، تحديث المعلومات، والتحكم في حضورك الرقمي",
    enterRestaurantName: "أدخل اسم مطعمك",
    enterPassword: "أدخل كلمة المرور",
    accessRestaurantDashboard: "الوصول للوحة تحكم المطعم",
    empoweringRestaurants: "تمكين المطاعم بالابتكار الرقمي",

    // Google Maps
    googleMapsUrl: "رابط خرائط جوجل",
    googleMapsEmbedUrl: "رابط تضمين خرائط جوجل",
    viewOnGoogleMaps: "عرض على خرائط جوجل",
  },
  en: {
    // Navigation
    menu: "Menu",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    backToMenu: "Back to Menu",
    viewLiveMenu: "View Live Menu",

    // Admin Dashboard
    adminDashboard: "Admin Dashboard",
    manageAllRestaurants: "Manage all restaurants in the system",
    addNewRestaurant: "Add New Restaurant",
    restaurantName: "Restaurant Name",
    restaurantPassword: "Restaurant Password",
    subdomainSlug: "Subdomain Slug",
    createRestaurant: "Create Restaurant",
    allRestaurants: "All Restaurants",
    noRestaurantsYet: "No restaurants yet",
    createFirstRestaurant: "Create your first restaurant",

    // Restaurant Dashboard
    restaurantManagement: "Restaurant Management",
    menuCategories: "Menu Categories",
    organizeMenu: "Organize your menu into categories for better navigation",
    addNewCategory: "Add New Category",
    addNewMenuItem: "Add New Menu Item",
    manageMenuItems: "Manage your menu items, pricing, and availability",
    aboutUsInformation: "About Us Information",
    tellCustomersAbout:
      "Tell your customers about your restaurant's story, mission, and values",
    restaurantAppearance: "Restaurant Appearance",
    customizeVisualIdentity:
      "Customize your restaurant's visual identity and branding",
    restaurantSettings: "Restaurant Settings",
    manageBasicInfo:
      "Manage your restaurant's basic information and access details",

    // Categories
    categories: "Categories",
    categoryName: "Category Name",
    categoryImage: "Category Image",
    addCategory: "Add Category",
    sortOrder: "Sort Order",

    // Menu Items
    menuItems: "Menu Items",
    itemName: "Item Name",
    itemImage: "Item Image",
    addMenuItem: "Add Menu Item",
    availability: "Availability",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    glutenFree: "Gluten Free",
    createCategoryFirst:
      "Please create at least one category before adding menu items.",
    noItemsInCategory: "No items in this category yet.",
    noItemsFound: "No items found.",

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
    total: "Total",
    yes: "Yes",
    no: "No",
    bilingual: "Bilingual",

    // Menu
    ourMenu: "Our Menu",
    menuComingSoon: "Menu Coming Soon",
    menuComingSoonDesc:
      "We're preparing something amazing for you. Please check back later!",
    noImage: "No image",
    items: "items",
    searchMenu: "Search menu",
    showAllCategories: "Show All Categories",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    cart: "Cart",
    ingredients: "Ingredients",
    allergens: "Allergens",

    // About sections
    ourStory: "Our Story",
    ourMission: "Our Mission",
    ourVision: "Our Vision",
    ourChef: "Our Chef",
    ourHistory: "Our History",
    visitUs: "Visit Us",

    // Contact
    address: "Address",
    phone: "Phone",
    email: "Email",
    location: "Location",

    // Appearance
    restaurantLogo: "Restaurant Logo",
    displayName: "Display Name",
    bannerColor: "Banner Color",
    bannerBackgroundImage: "Banner Background Image",
    updateAppearance: "Update Appearance",
    uploadSquareLogo: "Upload a square logo (recommended: 200x200px)",
    choosePrimaryColor:
      "Choose the primary color for your restaurant's header and accents",
    removeBackgroundImage: "Remove background image",

    // Settings
    restaurantUrl: "Restaurant URL",
    menuAvailableAt: "Your menu is available at:",
    dashboardAccess: "Dashboard Access",
    dashboardUrl: "Dashboard URL:",
    password: "Password",

    // Footer
    allRightsReserved: "All rights reserved",
    followUs: "Follow Us",
    quickLinks: "Quick Links",
    contactInfo: "Contact Info",

    // Forms
    required: "Required",
    optional: "Optional",
    leaveEmptyIfNo: "Leave empty if no sale price",
    briefDescription: "Brief description",
    tellStoryHow: "Tell the story of how your restaurant began...",
    whatIsRestaurantMission: "What is your restaurant's mission?",
    whatIsVisionFuture: "What is your vision for the future?",
    tellCustomersAboutChef: "Tell customers about your head chef...",
    shareHistoryHeritage:
      "Share the history and heritage of your restaurant...",
    getEmbedUrl:
      "Get the embed URL from Google Maps by clicking 'Share' → 'Embed a map'",

    // Status
    active: "Active",
    inactive: "Inactive",
    loading: "Loading...",
    loadingMenu: "Loading menu...",

    // Actions
    logout: "Logout",
    signOut: "Sign Out",
    backToHome: "Back to Home",

    // Login
    adminLogin: "Admin Login",
    signInToManage: "Sign in to manage restaurants",
    signInAsAdmin: "Sign In as Admin",

    // Home page
    revolutionizingRestaurant: "Revolutionizing Restaurant Management",
    streamlineOperations:
      "Streamline your restaurant operations with our comprehensive digital menu system. From elegant menu displays to powerful management tools.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    chooseAccessLevel: "Choose Your Access Level",
    managingMultipleRestaurants:
      "Whether you're managing multiple restaurants or running your own establishment",
    systemAdministrator: "System Administrator",
    manageMultipleRestaurants:
      "Manage multiple restaurants, oversee operations, and control the entire platform",
    adminPassword: "Admin Password",
    enterAdminPassword: "Enter admin password",
    accessAdminDashboard: "Access Admin Dashboard",
    restaurantOwner: "Restaurant Owner",
    manageRestaurantMenu:
      "Manage your restaurant menu, update information, and control your digital presence",
    enterRestaurantName: "Enter your restaurant name",
    enterPassword: "Enter password",
    accessRestaurantDashboard: "Access Restaurant Dashboard",
    empoweringRestaurants: "Empowering restaurants with digital innovation",

    // Google Maps
    googleMapsUrl: "Google Maps URL",
    googleMapsEmbedUrl: "Google Maps Embed URL",
    viewOnGoogleMaps: "View on Google Maps",
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
