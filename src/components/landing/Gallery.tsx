import React, { useEffect, useRef, useState } from "react";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos, PlayArrowRounded } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import SectionHeading from "@components/common/SectionHeading";
import Reveal from "@components/common/Reveal";
import { tokens } from "@theme/theme";

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

const galleryMedia: MediaItem[] = [
  { src: image1, type: "image", title: "Epic Lounge Interior", alt: "Epic Lounge gaming setup" },
  { src: video1, type: "video", title: "Gaming Station Tour", alt: "Video tour of gaming stations" },
  { src: image2, type: "image", title: "Premium Setup", alt: "Premium gaming equipment" },
  { src: video2, type: "video", title: "Gaming Experience", alt: "Gaming experience video" },
  { src: video3, type: "video", title: "Lounge Atmosphere", alt: "Lounge atmosphere video" },
  { src: video4, type: "video", title: "Facilities Showcase", alt: "Facilities showcase video" },
  { src: video5, type: "video", title: "Gaming Action", alt: "Gaming action video" },
];

/** Video that only loads its first frame up front and only plays while its slide is active. */
const SlideVideo: React.FC<{ src: string; label: string; active: boolean }> = ({ src, label, active }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => {
        /* autoplay blocked — the poster frame stays visible */
      });
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <video
      ref={ref}
      src={`${src}#t=0.1`}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
};

const navButtonSx = {
  width: 48,
  height: 48,
  color: tokens.text,
  background: tokens.bg,
  border: `1px solid ${tokens.borderStrong}`,
  "&:hover": { background: tokens.surfaceRaised, borderColor: tokens.text },
  "& svg": { fontSize: 18 },
};

const Gallery: React.FC = () => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box component="section" id="gallery" sx={{ py: { xs: 9, md: 14 }, overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
        >
          <SectionHeading
            overline="Gallery"
            title={
              <>
                Inside <span className="gradient-text">Epic Lounge</span>
              </>
            }
            subtitle="Take a quick tour of the stations, rooms and vibe."
          />
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ display: { xs: "none", md: "flex" }, mb: 6, flexShrink: 0 }}
          >
            <IconButton aria-label="Previous slide" onClick={() => swiper?.slidePrev()} sx={navButtonSx}>
              <ArrowBackIosNew />
            </IconButton>
            <IconButton aria-label="Next slide" onClick={() => swiper?.slideNext()} sx={navButtonSx}>
              <ArrowForwardIos />
            </IconButton>
          </Stack>
        </Stack>
      </Container>

      <Reveal y={40}>
        <Box
          data-cursor="Drag"
          sx={{
            "& .swiper": { overflow: "visible", px: { xs: 0, md: 2 } },
            "& .swiper-slide": {
              width: { xs: "82vw", sm: "70vw", md: 620 },
              maxWidth: 620,
              transition: "opacity .4s ease",
              opacity: 0.45,
            },
            "& .swiper-slide-active": { opacity: 1 },
          }}
        >
          <Swiper
            modules={[Autoplay, EffectCoverflow]}
            effect="coverflow"
            centeredSlides
            slidesPerView="auto"
            grabCursor
            loop
            speed={700}
            coverflowEffect={{ rotate: 28, stretch: 0, depth: 140, modifier: 1, slideShadows: false }}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            onSwiper={setSwiper}
            onSlideChange={(s) => setActiveIndex(s.realIndex)}
          >
            {galleryMedia.map((media) => (
              <SwiperSlide key={media.src}>
                {({ isActive }) => (
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 260, md: 420 },
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: `1px solid ${tokens.border}`,
                      background: tokens.surface,
                    }}
                  >
                    {media.type === "image" ? (
                      <Box
                        component="img"
                        src={media.src}
                        alt={media.alt}
                        loading="lazy"
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <SlideVideo src={media.src} label={media.alt} active={isActive} />
                    )}

                    {/* Caption */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        p: { xs: 2, md: 3 },
                        pt: 8,
                        background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, fontSize: { xs: "1rem", md: "1.15rem" } }}>
                        {media.title}
                      </Typography>
                      {media.type === "video" && (
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.25,
                            py: 0.4,
                            borderRadius: 999,
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: isActive ? "#000" : tokens.text,
                            background: isActive ? tokens.cyan : "rgba(255,255,255,0.1)",
                            backdropFilter: "blur(6px)",
                            flexShrink: 0,
                          }}
                        >
                          <PlayArrowRounded sx={{ fontSize: 16 }} />
                          {isActive ? "Playing" : "Video"}
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Reveal>

      {/* Progress dots */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: { xs: 3, md: 4 } }}>
        {galleryMedia.map((media, i) => (
          <Box
            key={media.src}
            component="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => swiper?.slideToLoop(i)}
            sx={{
              width: i === activeIndex ? 28 : 8,
              height: 8,
              p: 0,
              border: 0,
              borderRadius: 999,
              background: i === activeIndex ? tokens.cyan : tokens.borderStrong,
              transition: "width .35s ease, background-color .35s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Gallery;
