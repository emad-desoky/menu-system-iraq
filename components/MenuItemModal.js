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
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function MenuItemModal({ item, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();

  if (!item) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    onClose();
    setQuantity(1);
  };

  const currentPrice = item.salePrice || item.price;
  const hasDiscount =
    item.salePrice &&
    Number.parseFloat(item.salePrice) < Number.parseFloat(item.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{item.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {item.image && (
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.imageAlt || item.name}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-orange-600">
              ${Number.parseFloat(currentPrice).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-500 line-through">
                ${Number.parseFloat(item.price).toFixed(2)}
              </span>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="bg-red-500">
                {t("sale")}
              </Badge>
            )}
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("description")}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Ingredients */}
          {item.ingredients && (
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("ingredients")}</h3>
              <p className="text-gray-600">{item.ingredients}</p>
            </div>
          )}

          {/* Allergens */}
          {item.allergens && (
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("allergens")}</h3>
              <p className="text-red-600 font-medium">{item.allergens}</p>
            </div>
          )}

          {/* Dietary Information */}
          <div className="flex flex-wrap gap-2">
            {item.isVegetarian && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                {t("isVegetarian")}
              </Badge>
            )}
            {item.isVegan && (
              <Badge
                variant="outline"
                className="text-green-700 border-green-700"
              >
                {t("isVegan")}
              </Badge>
            )}
            {item.isGlutenFree && (
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-600"
              >
                {t("isGlutenFree")}
              </Badge>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="font-medium">{t("quantity")}:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{t("total")}</div>
              <div className="text-xl font-bold text-orange-600">
                ${(Number.parseFloat(currentPrice) * quantity).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
            disabled={!item.isAvailable}
          >
            {item.isAvailable ? t("addToCart") : t("notAvailable")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
