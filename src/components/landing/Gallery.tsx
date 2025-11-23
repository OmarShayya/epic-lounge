import React, { useRef, useState, useEffect } from "react";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation } from "swiper/modules";
import { PlayCircle } from "@mui/icons-material";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const image1 = new URL(
  "../../assets/images/WhatsApp Image 2025-11-09 at 20.31.43.jpeg",
  import.meta.url
).href;
const image2 = new URL(
  "../../assets/images/WhatsApp Image 2025-11-09 at 20.31.44.jpeg",
  import.meta.url
).href;
const video1 = new URL(
  "../../assets/images/WhatsApp Video 2025-11-09 at 20.31.44.mp4",
  import.meta.url
).href;
const video2 = new URL(
  "../../assets/images/WhatsApp Video 2025-11-09 at 20.31.48.mp4",
  import.meta.url
).href;
const video3 = new URL(
  "../../assets/images/WhatsApp Video 2025-11-09 at 20.31.55.mp4",
  import.meta.url
).href;
const video4 = new URL(
  "../../assets/images/WhatsApp Video 2025-11-09 at 20.32.01.mp4",
  import.meta.url
).href;
const video5 = new URL(
  "../../assets/images/WhatsApp Video 2025-11-09 at 20.32.03.mp4",
  import.meta.url
).href;

interface MediaItem {
  src: string;
  type: "image" | "video";
  title: string;
  alt: string;
}

// Gallery media items
const galleryMedia: MediaItem[] = [
  {
    src: image1,
    type: "image",
    title: "Epic Lounge Interior",
    alt: "Epic Lounge gaming setup",
  },
  {
    src: video1,
    type: "video",
    title: "Gaming Station Tour",
    alt: "Video tour of gaming stations",
  },
  {
    src: image2,
    type: "image",
    title: "Premium Setup",
    alt: "Premium gaming equipment",
  },
  {
    src: video2,
    type: "video",
    title: "Gaming Experience",
    alt: "Gaming experience video",
  },
  {
    src: video3,
    type: "video",
    title: "Lounge Atmosphere",
    alt: "Lounge atmosphere video",
  },
  {
    src: video4,
    type: "video",
    title: "Facilities Showcase",
    alt: "Facilities showcase video",
  },
  {
    src: video5,
    type: "video",
    title: "Gaming Action",
    alt: "Gaming action video",
  },
];

// Lazy loading video component
const LazyVideo: React.FC<{
  src: string;
  alt: string;
  isActive: boolean;
}> = ({ src, alt, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive && isLoaded) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, user interaction needed
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isLoaded]);

  const handleLoadedData = () => {
    setIsLoaded(true);
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "400px" }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedData={handleLoadedData}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
      />
      {!isPlaying && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <PlayCircle
            sx={{
              fontSize: 80,
              color: "rgba(0,206,209,0.8)",
              filter: "drop-shadow(0 0 20px rgba(0,206,209,0.6))",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

const Gallery: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activeIndex, setActiveIndex] = useState(0);

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
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={true}
              loop={true}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              style={{ padding: "40px 0" }}
            >
              {galleryMedia.map((media, index) => (
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
                        "& .media-overlay": {
                          opacity: 1,
                        },
                        "& img": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  >
                    {/* Render Image or Video */}
                    {media.type === "image" ? (
                      <Box
                        component="img"
                        src={media.src}
                        alt={media.alt}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                      />
                    ) : (
                      <LazyVideo
                        src={media.src}
                        alt={media.alt}
                        isActive={activeIndex === index}
                      />
                    )}

                    {/* Overlay with Title */}
                    <Box
                      className="media-overlay"
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
                        {media.title}
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
