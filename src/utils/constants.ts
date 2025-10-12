export const CONTACT_INFO = {
  phone: "+961 XXX XXX",
  email: "info@epiclounge.com",
  address: "Your Address, Lebanon",
};

export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
};

export const OPENING_HOURS = [
  { day: "Monday - Thursday", hours: "2:00 PM - 2:00 AM" },
  { day: "Friday - Saturday", hours: "2:00 PM - 4:00 AM" },
  { day: "Sunday", hours: "2:00 PM - 12:00 AM" },
];

export const FEATURES = [
  {
    title: "Premium Gaming Setup",
    description: "High-end PCs with RTX 4090 graphics cards",
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
