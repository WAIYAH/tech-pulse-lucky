import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
  const whatsappNumber = "254715674828"; // Lucky Nakola's WhatsApp number
  const message = "Hi! I'm interested in joining the Tech Pulse Insider community!";

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
      <motion.div
        className="absolute -top-1 -right-1 bg-accent w-3 h-3 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />
    </motion.a>
  );
};

export default WhatsAppButton;
