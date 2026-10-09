import { motion } from "framer-motion";
import { SiWhatsapp } from "react-icons/si";
import { useContent, whatsappLink } from "@/lib/site";

export function WhatsAppButton() {
  const { whatsappNumber } = useContent().global;

  return (
    <motion.a
      href={whatsappLink(whatsappNumber)}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#20ba5a] transition-colors"
      aria-label="Chat on WhatsApp"
      data-testid="link-whatsapp-floating"
    >
      <SiWhatsapp className="w-8 h-8" />
    </motion.a>
  );
}
