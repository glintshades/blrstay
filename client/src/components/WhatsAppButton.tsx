import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "919740565797";
  
  const message = encodeURIComponent(
    "Hi, I'm interested in booking a room at Blrstay PG in Yelahanka. Can you provide more details?"
  );
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-[#25D366]/50 group"
      aria-label="Chat on WhatsApp"
      data-testid="button-whatsapp"
    >
      <FaWhatsapp className="w-9 h-9 text-white" />
      
      <div className="absolute right-20 bg-white text-foreground px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        <span className="text-sm font-semibold">Chat with us on WhatsApp</span>
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white"></div>
      </div>
    </a>
  );
}
