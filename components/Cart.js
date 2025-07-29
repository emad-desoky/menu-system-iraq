"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Cart() {
  const { getTotalPrice, getTotalItems, setIsOpen } = useCart();
  const { t, isRTL } = useLanguage();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  if (totalItems === 0) return null;

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 z-50 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg"
      style={{ [isRTL ? "left" : "right"]: "1rem" }}
    >
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        <Badge variant="secondary" className="bg-white text-orange-600">
          {totalItems}
        </Badge>
        <span className="font-semibold">${totalPrice.toFixed(2)}</span>
      </div>
    </Button>
  );
}
