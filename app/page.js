"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChefHat,
  Store,
  Smartphone,
  Users,
  ArrowRight,
  CheckCircle,
  Menu,
  QrCode,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
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

    // Landing Page
    features: "المميزات",
    benefits: "الفوائد",
    pricing: "الأسعار",
    getStarted: "ابدأ الآن",
    transformRestaurant: "حوّل مطعمك مع",
    digitalMenus: "القوائم الرقمية",
    landingDescription:
      "بسّط عمليات مطعمك مع نظام القائمة الرقمية الشامل. أدر عدة مواقع، حدّث القوائم فوراً، وقدم لعملائك تجربة طعام استثنائية.",
    startFreeTrial: "ابدأ التجربة المجانية",
    watchDemo: "شاهد العرض التوضيحي",

    // Features Section
    everythingYouNeed: "كل ما تحتاجه لإدارة مطعمك",
    powerfulFeatures: "مميزات قوية مصممة للمطاعم العصرية",
    qrCodeMenus: "قوائم رمز الاستجابة السريعة",
    qrCodeDescription:
      "تجربة طعام بدون لمس مع وصول فوري لقائمة رمز الاستجابة السريعة. يمكن للعملاء عرض قائمتك على هواتفهم فوراً.",
    multiLocationManagement: "إدارة المواقع المتعددة",
    multiLocationDescription:
      "أدر عدة مواقع مطاعم من لوحة تحكم واحدة. حدّث القوائم والأسعار والتوفر عبر جميع المواقع.",
    analyticsInsights: "التحليلات والرؤى",
    analyticsDescription:
      "تتبع أداء القائمة والعناصر الشائعة وتفضيلات العملاء مع تحليلات وتقارير مفصلة.",
    easyMenuUpdates: "تحديثات القائمة السهلة",
    easyUpdatesDescription:
      "حدّث عناصر قائمتك والأسعار والأوصاف في الوقت الفعلي. التغييرات تنعكس فوراً عبر جميع المنصات.",
    mobileOptimized: "محسّن للهاتف المحمول",
    mobileDescription:
      "تصميم جميل ومتجاوب يعمل بشكل مثالي على جميع الأجهزة. عملاؤك سيحبون التجربة السلسة.",
    staffManagement: "إدارة الموظفين",
    staffDescription:
      "تحكم في الوصول القائم على الأدوار لفريقك. المديرون وأصحاب المطاعم لديهم مستويات مختلفة من الوصول والصلاحيات.",

    // Benefits Section
    whyChooseEmenu: "لماذا تختار E-Menu؟",
    reducePrintingCosts: "تقليل تكاليف الطباعة",
    reducePrintingDescription:
      "تخلص من الحاجة للقوائم المطبوعة ووفر في تكاليف الطباعة. حدّث قائمتك رقمياً بدون إعادة طباعة.",
    improveCustomerExperience: "تحسين تجربة العملاء",
    improveExperienceDescription:
      "قدم للعملاء صوراً عالية الجودة وأوصافاً مفصلة ومعلومات التوفر في الوقت الفعلي.",
    increaseEfficiency: "زيادة الكفاءة",
    increaseEfficiencyDescription:
      "بسّط العمليات مع تحديثات القائمة الفورية وإدارة المخزون والتحكم المركزي عبر جميع المواقع.",
    contactlessAndSafe: "بدون لمس وآمن",
    contactlessDescription:
      "قدم تجربة طعام آمنة وبدون لمس مع قوائم رمز الاستجابة السريعة التي يمكن للعملاء الوصول إليها على أجهزتهم الخاصة.",

    // CTA Section
    readyToTransform: "مستعد لتحويل مطعمك؟",
    joinThousands:
      "انضم إلى آلاف المطاعم التي تستخدم بالفعل E-Menu لتعزيز تجربة عملائها وتبسيط عملياتها.",
    getStartedNow: "ابدأ الآن",
    scheduleDemo: "حدد موعد عرض توضيحي",

    // Footer
    empoweringRestaurants:
      "تمكين المطاعم بحلول القوائم الرقمية التي تعزز تجربة العملاء وتبسط العمليات",
    quickLinks: "روابط سريعة",
    support: "الدعم",
    helpCenter: "مركز المساعدة",
    contactUs: "اتصل بنا",
    documentation: "التوثيق",
    allRightsReserved: "جميع الحقوق محفوظة",

    // Access Page
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
    restaurantName: "اسم المطعم",
    enterRestaurantName: "أدخل اسم مطعمك",
    password: "كلمة المرور",
    enterPassword: "أدخل كلمة المرور",
    accessRestaurantDashboard: "الوصول للوحة تحكم المطعم",
    followUs: "تابعونا",
  },
  en: {
    // Navigation
    menu: "Menu",
    about: "About",
    contact: "Contact",
    dashboard: "Dashboard",
    backToMenu: "Back to Menu",
    viewLiveMenu: "View Live Menu",

    // Landing Page
    features: "Features",
    benefits: "Benefits",
    pricing: "Pricing",
    getStarted: "Get Started",
    transformRestaurant: "Transform Your Restaurant with",
    digitalMenus: "Digital Menus",
    landingDescription:
      "Streamline your restaurant operations with our comprehensive digital menu system. Manage multiple locations, update menus instantly, and provide customers with an exceptional dining experience.",
    startFreeTrial: "Start Free Trial",
    watchDemo: "Watch Demo",

    // Features Section
    everythingYouNeed: "Everything You Need to Manage Your Restaurant",
    powerfulFeatures: "Powerful features designed for modern restaurants",
    qrCodeMenus: "QR Code Menus",
    qrCodeDescription:
      "Contactless dining experience with instant QR code menu access. Customers can view your menu on their phones instantly.",
    multiLocationManagement: "Multi-Location Management",
    multiLocationDescription:
      "Manage multiple restaurant locations from a single dashboard. Update menus, prices, and availability across all locations.",
    analyticsInsights: "Analytics & Insights",
    analyticsDescription:
      "Track menu performance, popular items, and customer preferences with detailed analytics and reporting.",
    easyMenuUpdates: "Easy Menu Updates",
    easyUpdatesDescription:
      "Update your menu items, prices, and descriptions in real-time. Changes are instantly reflected across all platforms.",
    mobileOptimized: "Mobile Optimized",
    mobileDescription:
      "Beautiful, responsive design that works perfectly on all devices. Your customers will love the seamless experience.",
    staffManagement: "Staff Management",
    staffDescription:
      "Role-based access control for your team. Admins and restaurant owners have different levels of access and permissions.",

    // Benefits Section
    whyChooseEmenu: "Why Choose E-Menu?",
    reducePrintingCosts: "Reduce Printing Costs",
    reducePrintingDescription:
      "Eliminate the need for physical menus and save on printing costs. Update your menu digitally without reprinting.",
    improveCustomerExperience: "Improve Customer Experience",
    improveExperienceDescription:
      "Provide customers with high-quality images, detailed descriptions, and real-time availability information.",
    increaseEfficiency: "Increase Efficiency",
    increaseEfficiencyDescription:
      "Streamline operations with instant menu updates, inventory management, and centralized control across all locations.",
    contactlessAndSafe: "Contactless & Safe",
    contactlessDescription:
      "Provide a safe, contactless dining experience with QR code menus that customers can access on their own devices.",

    // CTA Section
    readyToTransform: "Ready to Transform Your Restaurant?",
    joinThousands:
      "Join thousands of restaurants already using E-Menu to enhance their customer experience and streamline operations.",
    getStartedNow: "Get Started Now",
    scheduleDemo: "Schedule Demo",

    // Footer
    empoweringRestaurants:
      "Empowering restaurants with digital menu solutions that enhance customer experience and streamline operations",
    quickLinks: "Quick Links",
    support: "Support",
    helpCenter: "Help Center",
    contactUs: "Contact Us",
    documentation: "Documentation",
    allRightsReserved: "All rights reserved",

    // Access Page
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
    restaurantName: "Restaurant Name",
    enterRestaurantName: "Enter your restaurant name",
    password: "Password",
    enterPassword: "Enter password",
    accessRestaurantDashboard: "Access Restaurant Dashboard",
    followUs: "Follow Us",
  },
};

const LanguageContext = createContext();

function LanguageProvider({ children }) {
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

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white"
    >
      {language === "ar" ? "EN" : "العربية"}
    </Button>
  );
}

function HomePageContent() {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-white ${isRTL ? "rtl" : "ltr"}`}>
      {/* Language Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">
                E-Menu
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                {t("features")}
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900">
                {t("benefits")}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                {t("pricing")}
              </a>
              <Link href="/access">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  {t("getStarted")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("transformRestaurant")}
              <span className="text-orange-600 block">{t("digitalMenus")}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t("landingDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/access">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-4"
                >
                  {t("startFreeTrial")}
                  <ArrowRight
                    className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-5 w-5`}
                  />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 bg-transparent"
              >
                {t("watchDemo")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t("everythingYouNeed")}
            </h2>
            <p className="text-xl text-gray-600">{t("powerfulFeatures")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QrCode className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("qrCodeMenus")}
                </h3>
                <p className="text-gray-600">{t("qrCodeDescription")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Store className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("multiLocationManagement")}
                </h3>
                <p className="text-gray-600">{t("multiLocationDescription")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("analyticsInsights")}
                </h3>
                <p className="text-gray-600">{t("analyticsDescription")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Menu className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("easyMenuUpdates")}
                </h3>
                <p className="text-gray-600">{t("easyUpdatesDescription")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("mobileOptimized")}
                </h3>
                <p className="text-gray-600">{t("mobileDescription")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("staffManagement")}
                </h3>
                <p className="text-gray-600">{t("staffDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t("whyChooseEmenu")}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle
                    className={`h-6 w-6 text-green-500 mt-1 ${
                      isRTL ? "ml-4" : "mr-4"
                    } flex-shrink-0`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("reducePrintingCosts")}
                    </h3>
                    <p className="text-gray-600">
                      {t("reducePrintingDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle
                    className={`h-6 w-6 text-green-500 mt-1 ${
                      isRTL ? "ml-4" : "mr-4"
                    } flex-shrink-0`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("improveCustomerExperience")}
                    </h3>
                    <p className="text-gray-600">
                      {t("improveExperienceDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle
                    className={`h-6 w-6 text-green-500 mt-1 ${
                      isRTL ? "ml-4" : "mr-4"
                    } flex-shrink-0`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("increaseEfficiency")}
                    </h3>
                    <p className="text-gray-600">
                      {t("increaseEfficiencyDescription")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircle
                    className={`h-6 w-6 text-green-500 mt-1 ${
                      isRTL ? "ml-4" : "mr-4"
                    } flex-shrink-0`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t("contactlessAndSafe")}
                    </h3>
                    <p className="text-gray-600">
                      {t("contactlessDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://www.wasserstrom.com/blog/wp-content/uploads/2020/05/HeaderBanner_BlogPost_Touchless-Menu2-1024x560.jpg"
                alt="Digital Menu Interface"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t("readyToTransform")}
          </h2>
          <p className="text-xl text-orange-100 mb-8">{t("joinThousands")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/access">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                {t("getStartedNow")}
                <ArrowRight
                  className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-5 w-5`}
                />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 text-lg px-8 py-4 bg-transparent"
            >
              {t("scheduleDemo")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <ChefHat className="h-8 w-8 text-orange-600" />
                <span
                  className={`${isRTL ? "mr-2" : "ml-2"} text-3xl font-bold`}
                >
                  E-Menu
                </span>
              </div>
              <p className="text-gray-400 mb-6 text-lg">
                {t("empoweringRestaurants")}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("quickLinks")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    {t("features")}
                  </a>
                </li>
                <li>
                  <a
                    href="#benefits"
                    className="hover:text-white transition-colors"
                  >
                    {t("benefits")}
                  </a>
                </li>
                <li>
                  <Link
                    href="/access"
                    className="hover:text-white transition-colors"
                  >
                    {t("getStarted")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t("support")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("helpCenter")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("contactUs")}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    {t("documentation")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 E-Menu. {t("allRightsReserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  );
}
