import React from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

// Gallery images (you'll need to add actual images to public/images/gallery/)
const galleryImages = [
  {
    src: "/images/gallery/gaming-pcs.jpg",
    title: "High-End Gaming PCs",
    alt: "Gaming PC setup with RGB lighting",
  },
  {
    src: "/images/gallery/ps5-room.jpg",
    title: "Private PS5 Room",
    alt: "Cozy PS5 gaming room",
  },
  {
    src: "/images/gallery/billiards.jpg",
    title: "Professional Billiards",
    alt: "Billiard table",
  },
  {
    src: "/images/gallery/foosball.jpg",
    title: "Foosball Action",
    alt: "Foosball table",
  },
  {
    src: "/images/gallery/lan-party.jpg",
    title: "CS 1.6 LAN Setup",
    alt: "LAN gaming area",
  },
  {
    src: "/images/gallery/lounge.jpg",
    title: "Chill Zone",
    alt: "Comfortable lounge area",
  },
  {
    src: "/images/gallery/big-screen.jpg",
    title: "Football Viewing",
    alt: "Big screen for watching football",
  },
  {
    src: "/images/gallery/snacks.jpg",
    title: "Snacks & Coffee",
    alt: "Food and beverages",
  },
];

const Gallery: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "#0A1929",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glowing Background Effect */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          background:
            "radial-gradient(circle, rgba(0,206,209,0.15) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <Container maxWidth="xl" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Stack
            spacing={2}
            alignItems="center"
            textAlign="center"
            sx={{ mb: 8 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "Orbitron",
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                background: "linear-gradient(135deg, #00CED1 0%, #9B51E0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 40px rgba(155,81,224,0.3)",
              }}
            >
              INSIDE EPIC LOUNGE
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#B2BAC2",
                maxWidth: "700px",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Take a virtual tour of our amazing facilities
            </Typography>
          </Stack>
        </motion.div>

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Box
            sx={{
              position: "relative",
              "& .swiper": {
                pb: 6,
              },
              "& .swiper-slide": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "& .swiper-button-next, & .swiper-button-prev": {
                color: "#00CED1",
                "&::after": {
                  fontSize: "30px",
                },
                "&:hover": {
                  color: "#9B51E0",
                },
              },
            }}
          >
            <Swiper
              modules={[Autoplay, EffectCoverflow, Navigation]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={true}
              loop={true}
              style={{ padding: "40px 0" }}
            >
              {galleryImages.map((image, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    width: "600px",
                    maxWidth: "90vw",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      borderRadius: 4,
                      overflow: "hidden",
                      border: "2px solid rgba(0,206,209,0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        border: "2px solid rgba(0,206,209,0.8)",
                        boxShadow: "0 20px 60px rgba(0,206,209,0.4)",
                        "& .image-overlay": {
                          opacity: 1,
                        },
                        "& img": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      onError={(e: any) => {
                        // Fallback to placeholder if image doesn't exist
                        e.target.src = `https://via.placeholder.com/600x400/132F4C/00CED1?text=${encodeURIComponent(
                          image.title
                        )}`;
                      }}
                      sx={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />

                    {/* Overlay with Title */}
                    <Box
                      className="image-overlay"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(10,25,41,0.95) 0%, transparent 100%)",
                        p: 3,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          fontFamily: "Orbitron",
                          fontWeight: 700,
                          color: "#00CED1",
                          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                        }}
                      >
                        {image.title}
                      </Typography>
                    </Box>

                    {/* Corner Decoration */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 15,
                        left: 15,
                        width: 50,
                        height: 50,
                        borderTop: "3px solid #00CED1",
                        borderLeft: "3px solid #00CED1",
                        opacity: 0.6,
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 15,
                        right: 15,
                        width: 50,
                        height: 50,
                        borderBottom: "3px solid #9B51E0",
                        borderRight: "3px solid #9B51E0",
                        opacity: 0.6,
                      }}
                    />
                  </Box>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </motion.div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "#B2BAC2",
              mt: 6,
              fontSize: "1.1rem",
              fontStyle: "italic",
            }}
          >
            "Where Legends Are Made" 🎮
          </Typography>
        </motion.div>
      </Container>

      {/* Custom CSS for Swiper */}
      <style>{`
        .swiper-slide {
          transition: all 0.3s ease;
        }
        .swiper-slide-active {
          filter: brightness(1.1);
        }
        .swiper-slide:not(.swiper-slide-active) {
          filter: brightness(0.6);
        }
      `}</style>
    </Box>
  );
};

export default Gallery;
