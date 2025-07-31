"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

export default function MenuItemModal({ item, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const getLocalizedText = (item, field) => {
    if (!item) return "";
    if (language === "ar") {
      return item[`${field}Ar`] || item[field] || "";
    }
    return item[`${field}En`] || item[field] || "";
  };

  const formatPrice = (price) => {
    return `${Number.parseFloat(price).toFixed(0)} IQD`;
  };

  const convertToArabicNumerals = (num) => {
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => arabicNumerals[Number.parseInt(digit)]);
  };

  const handleAddToCart = () => {
    if (item) {
      for (let i = 0; i < quantity; i++) {
        addToCart(item);
      }
      onClose();
      setQuantity(1);
    }
  };

  if (!item) return null;

  const currentPrice = item.salePrice || item.price;
  const hasDiscount =
    item.salePrice &&
    Number.parseFloat(item.salePrice) < Number.parseFloat(item.price);
  const totalPrice = Number.parseFloat(currentPrice) * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-right">
            {getLocalizedText(item, "name")}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute left-4 top-4 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {item.image ? (
              <Image
                src={item.image || "/placeholder.svg"}
                alt={getLocalizedText(item, "name")}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-gray-400">{t("noImage")}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-center">
            <span className="text-2xl font-bold text-orange-600">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-500 line-through ml-2">
                {formatPrice(item.price)}
              </span>
            )}
          </div>

          {/* Description */}
          {getLocalizedText(item, "description") && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm">
                {getLocalizedText(item, "description")}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {getLocalizedText(item, "ingredients") && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("ingredients")}
              </h4>
              <p className="text-gray-600 text-sm">
                {getLocalizedText(item, "ingredients")}
              </p>
            </div>
          )}

          {/* Allergens */}
          {getLocalizedText(item, "allergens") && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("allergens")}
              </h4>
              <p className="text-red-600 text-sm">
                {getLocalizedText(item, "allergens")}
              </p>
            </div>
          )}

          {/* Dietary badges */}
          <div className="flex flex-wrap gap-2">
            {item.isVegetarian && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                {t("vegetarian")}
              </Badge>
            )}
            {item.isVegan && (
              <Badge
                variant="outline"
                className="text-green-700 border-green-700"
              >
                {t("vegan")}
              </Badge>
            )}
            {item.isGlutenFree && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                {t("glutenFree")}
              </Badge>
            )}
          </div>

          {/* Quantity and Total */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-medium">
                {language === "ar"
                  ? convertToArabicNumerals(quantity)
                  : quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-orange-600">{formatPrice(totalPrice)}</span>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3"
            disabled={!item.isAvailable}
          >
            {t("addToCart")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
