import type { CartLine } from "@/components/CartProvider";
import { formatPrice } from "@/data/drops";

const DEFAULT_WHATSAPP = "5491100000000";

export function buildWhatsappLink(lines: CartLine[], subtotal: number) {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP)
    .replace(/\D/g, "")
    .trim();

  const detail = lines
    .map((line, index) => {
      const size = line.selectedSize ? ` | Talle: ${line.selectedSize}` : "";
      const color = line.selectedColorName
        ? ` | Color: ${line.selectedColorName}`
        : "";
      return `${index + 1}. ${line.name} x${line.quantity}${size}${color}`;
    })
    .join("\n");

  const message = [
    "Hola Dr. Shaq, quiero solicitar este pedido:",
    "",
    detail || "Sin productos seleccionados.",
    "",
    `Subtotal estimado: ${formatPrice(subtotal)}`,
  ].join("\n");

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

