export const CONTACT_INFO = {
  phone: "+961 70 292 859",
  email: "Nassimbfd123@gmail.com",
  address: "Sawfar, badghan, main road, near 'habibi cut'",
};

/** Chat with the lounge on WhatsApp (append `?text=` to prefill a message). */
export const LOUNGE_WHATSAPP = `https://wa.me/${CONTACT_INFO.phone.replace(/\D/g, "")}`;

export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
};

export const OPENING_HOURS = [
  { day: "Everyday", hours: "4:00 PM - Morning" },
];

export const FEATURES = [
  {
    title: "Premium Gaming Setup",
    description: "High-end PCs with RTX 5070 graphics cards, 32GB RAM, 244Hz monitors",
    icon: "🎮",
  },
  {
    title: "Comfortable Space",
    description: "Ergonomic gaming chairs and spacious stations",
    icon: "🪑",
  },
  {
    title: "Fast Internet",
    description: "Ultra-low latency fiber connection",
    icon: "⚡",
  },
  {
    title: "Food & Drinks",
    description: "Wide selection of snacks and beverages",
    icon: "🍕",
  },
  {
    title: "Tournaments",
    description: "Regular gaming competitions with prizes",
    icon: "🏆",
  },
  {
    title: "Private Rooms",
    description: "Book exclusive rooms for your squad",
    icon: "🚪",
  },
];

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  },
};
