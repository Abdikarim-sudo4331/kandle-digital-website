import {
  BarChart, Camera, Globe, Layout, Mail, Megaphone, PenTool, Search, Share2,
  ShoppingCart, Smartphone, Target, TrendingUp, Video, type LucideIcon,
} from "lucide-react";
import type { serviceIcons } from "@shared/content";

export const iconMap: Record<(typeof serviceIcons)[number], LucideIcon> = {
  Search, Target, Share2, Globe, Layout, Megaphone, PenTool,
  BarChart, TrendingUp, Smartphone, Mail, Camera, Video, ShoppingCart,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name as keyof typeof iconMap] ?? Globe;
}
