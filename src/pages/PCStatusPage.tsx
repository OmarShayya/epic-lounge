import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Container, IconButton, Tooltip, Typography, alpha } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorOutline, EventAvailable, Refresh, EventBusy } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import PCGrid3D from "@/components/gaming/PCGrid3D";
import { STATUS_META, isPlayStation, reservationBadge, sortPcs, statusColor } from "@/components/gaming/statusMeta";
import { menuApi } from "../services/api";
import type { PCStats, PCStatus, StationType } from "../services/api";
import { tokens } from "@theme/theme";
import arenaPc from "@assets/games/arena-pc.webp";
import arenaPs5 from "@assets/games/arena-ps5.webp";

const POLL_MS = 30_000;

/* ------------------------------------------------------------------ */
/* Data: initial load + silent polling, paused while the tab is hidden */
/* ------------------------------------------------------------------ */

const usePCStatus = () => {
  const [pcs, setPcs] = useState<PCStatus[] | null>(null);
  const [stats, setStats] = useState<PCStats | null>(null);
  const [statsByType, setStatsByType] = useState<Partial<Record<StationType, PCStats>> | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setFetching(true);
    try {
      const data = await menuApi.getPCStatus();
      setPcs(data.pcs ?? []);
      setStats(data.stats ?? null);
      setStatsByType(data.statsByType ?? null);
      setError(null);
      setUpdatedAt(Date.now());
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the lounge right now.");
    } finally {
      inFlight.current = false;
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = undefined;
    };
    const start = () => {
      stop();
      timer = window.setInterval(load, POLL_MS);
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        load();
        start();
      }
    };

    load();
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [load]);

  return { pcs, stats, statsByType, fetching, error, updatedAt, reload: load };
};

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

const formatAgo = (seconds: number) => {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
};

const LiveIndicator: React.FC<{ updatedAt: number | null; stale: boolean }> = ({ updatedAt, stale }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  const color = stale ? tokens.amber : tokens.green;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        border: `1px solid ${tokens.border}`,
        background: tokens.surface,
        fontSize: "0.85rem",
        color: tokens.textMuted,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          color: alpha(color, 0.6),
          animation: stale ? "none" : "pulse-dot 2s infinite",
        }}
      />
      <Box component="span" sx={{ color: tokens.text, fontWeight: 600 }}>
        {stale ? "Offline" : "Live"}
      </Box>
      {updatedAt && (
        <Box component="span">· updated {formatAgo(Math.max(0, Math.round((now - updatedAt) / 1000)))}</Box>
      )}
    </Box>
  );
};

const AnimatedNumber: React.FC<{ value: number; color: string }> = ({ value, color }) => (
  <Box sx={{ position: "relative", height: { xs: 36, md: 46 }, overflow: "hidden" }}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: "block" }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: tokens.fontDisplay,
            fontWeight: 800,
            fontSize: { xs: "1.9rem", md: "2.5rem" },
            lineHeight: 1.15,
            color,
          }}
        >
          {value}
        </Typography>
      </motion.span>
    </AnimatePresence>
  </Box>
);

const StatCard: React.FC<{ label: string; value: number; total: number; color: string; showBar?: boolean }> = ({
  label,
  value,
  total,
  color,
  showBar = true,
}) => (
  <Box
    sx={{
      p: { xs: 1.75, md: 2.5 },
      borderRadius: 4,
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 10px ${color}` }} />
      <Typography sx={{ color: tokens.textMuted, fontSize: { xs: "0.8rem", md: "0.88rem" }, fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
    <AnimatedNumber value={value} color={showBar ? color : tokens.text} />
    <Box sx={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <Box
        sx={{
          height: "100%",
          width: `${total > 0 ? (showBar ? (value / total) * 100 : 100) : 0}%`,
          background: showBar ? color : `linear-gradient(90deg, ${tokens.cyan}, ${tokens.purple})`,
          borderRadius: 3,
          transition: "width .6s cubic-bezier(.22,1,.36,1)",
        }}
      />
    </Box>
  </Box>
);

const StationCard: React.FC<{ pc: PCStatus; selected: boolean; onClick: () => void }> = ({ pc, selected, onClick }) => {
  const color = statusColor(pc.status);
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      sx={{
        all: "unset",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        p: { xs: 1.5, md: 1.75 },
        borderRadius: 3.5,
        background: selected ? alpha(color, 0.08) : tokens.surface,
        border: `1px solid ${selected ? alpha(color, 0.7) : tokens.border}`,
        transition: "background-color .2s ease, border-color .2s ease, transform .2s ease",
        "&:hover": { borderColor: selected ? color : tokens.borderStrong, background: selected ? alpha(color, 0.1) : tokens.surfaceHover },
        "&:active": { transform: "scale(0.98)" },
        "&:focus-visible": { outline: `2px solid ${tokens.cyan}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Typography
          sx={{
            fontFamily: tokens.fontDisplay,
            fontWeight: 700,
            fontSize: { xs: "0.88rem", md: "0.95rem" },
            color: tokens.text,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {pc.name}
        </Typography>
        <Box
          sx={{
            width: 9,
            height: 9,
            flexShrink: 0,
            borderRadius: "50%",
            background: color,
            color: alpha(color, 0.6),
            boxShadow: `0 0 10px ${alpha(color, 0.8)}`,
            animation: pc.status === "available" ? "pulse-dot 2.2s infinite" : "none",
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color, letterSpacing: "0.04em" }}>
        {STATUS_META[pc.status]?.label ?? pc.status}
      </Typography>
      <Typography sx={{ fontSize: "0.78rem", color: tokens.textDim, minHeight: "1.2em" }}>
        {pc.location || " "}
      </Typography>
      <ReservedBadge pc={pc} />
    </Box>
  );
};

/** "Reserved 8:00 PM" chip for stations with an upcoming booking. */
const ReservedBadge: React.FC<{ pc: PCStatus }> = ({ pc }) => {
  const text = reservationBadge(pc);
  if (!text) return null;
  return (
    <Box
      component="span"
      sx={{
        alignSelf: "flex-start",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        mt: 0.25,
        px: 0.9,
        py: 0.25,
        borderRadius: 999,
        fontSize: "0.72rem",
        fontWeight: 700,
        color: tokens.purpleBright,
        background: alpha(tokens.purple, 0.16),
        border: `1px solid ${alpha(tokens.purple, 0.4)}`,
        whiteSpace: "nowrap",
      }}
    >
      <EventBusy sx={{ fontSize: 13 }} />
      {text}
    </Box>
  );
};

/** Bigger card for a private PlayStation room. */
const RoomCard: React.FC<{ pc: PCStatus }> = ({ pc }) => {
  const color = statusColor(pc.status);
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        minHeight: { xs: 150, md: 180 },
        p: { xs: 2, md: 2.5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        border: `1px solid ${alpha(color, 0.45)}`,
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: `url(${arenaPs5}) 40% 25% / cover no-repeat`,
          opacity: 0.4,
          filter: pc.status === "available" ? "none" : "grayscale(0.6)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 75%)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: color,
              color: alpha(color, 0.6),
              boxShadow: `0 0 12px ${alpha(color, 0.8)}`,
              animation: pc.status === "available" ? "pulse-dot 2.2s infinite" : "none",
            }}
          />
          <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color, letterSpacing: "0.04em" }}>
            {STATUS_META[pc.status]?.label ?? pc.status}
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: tokens.fontDisplay, fontWeight: 800, fontSize: { xs: "1.1rem", md: "1.3rem" }, mt: 0.75 }}>
          {pc.name}
        </Typography>
        <Typography sx={{ color: tokens.textMuted, fontSize: "0.82rem" }}>
          {pc.pcNumber}
          {pc.location ? ` · ${pc.location}` : ""}
        </Typography>
        <ReservedBadge pc={pc} />
      </Box>
    </Box>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const PCStatusPage: React.FC = () => {
  const { pcs, stats, statsByType, fetching, error, updatedAt, reload } = usePCStatus();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // The 3D floor map and the PC grid only show PCs; PlayStation rooms get their own section
  const sorted = useMemo(() => (pcs ? sortPcs(pcs.filter((p) => !isPlayStation(p))) : []), [pcs]);
  const rooms = useMemo(() => (pcs ? sortPcs(pcs.filter(isPlayStation)) : []), [pcs]);
  const counts = useMemo(() => {
    if (statsByType?.pc) return statsByType.pc;
    if (stats) return stats;
    const list = sorted;
    return {
      total: list.length,
      available: list.filter((p) => p.status === "available").length,
      occupied: list.filter((p) => p.status === "occupied").length,
      maintenance: list.filter((p) => p.status === "maintenance").length,
    };
  }, [sorted, stats, statsByType]);
  const roomsFree = rooms.filter((r) => r.status === "available").length;

  const initialLoading = pcs === null && !error;
  const hasData = pcs !== null;

  const selectFromList = (id: string) => {
    setSelectedId((cur) => (cur === id ? null : id));
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Box sx={{ position: "relative", pt: { xs: 3, md: 6 }, pb: { xs: 8, md: 12 } }}>
      {/* CS2 key art fading in behind the header */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: "-60px", md: "-72px" },
          left: 0,
          right: 0,
          height: { xs: 340, md: 440 },
          pointerEvents: "none",
          background: `url(${arenaPc}) 85% 30% / cover no-repeat`,
          opacity: { xs: 0.3, md: 0.45 },
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 35%, #000 75%), linear-gradient(180deg, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.35) 35%, #000 75%), linear-gradient(180deg, #000 30%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex-start", md: "flex-end" },
              justifyContent: "space-between",
              gap: { xs: 2, md: 4 },
              mb: { xs: 3, md: 4 },
            }}
          >
            <Box>
              <Typography
                variant="overline"
                component="p"
                sx={{
                  color: tokens.cyan,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.25,
                  mb: 1,
                  "&::before": { content: '""', width: 18, height: 2, borderRadius: 2, background: tokens.cyan },
                }}
              >
                Live status
              </Typography>
              <Typography
                variant="h1"
                sx={{ fontSize: { xs: "2rem", sm: "2.6rem", md: "3.3rem" }, textTransform: "uppercase" }}
              >
                Live availability
              </Typography>
              <Typography sx={{ color: tokens.textMuted, mt: 1, fontSize: { xs: "0.98rem", md: "1.08rem" } }}>
                See which PCs and PS5 rooms are free right now — or book one ahead.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Button
                component={RouterLink}
                to="/reserve"
                variant="contained"
                startIcon={<EventAvailable />}
                sx={{ fontWeight: 700, order: { xs: 3, md: 0 }, width: { xs: "100%", sm: "auto" } }}
              >
                Reserve a station
              </Button>
              <LiveIndicator updatedAt={updatedAt} stale={!!error && hasData} />
              <Tooltip title="Refresh now">
                <IconButton
                  onClick={reload}
                  disabled={fetching}
                  aria-label="Refresh PC status"
                  sx={{
                    border: `1px solid ${tokens.border}`,
                    background: tokens.surface,
                    color: tokens.text,
                    "&:hover": { background: tokens.surfaceHover, borderColor: tokens.borderStrong },
                    "&.Mui-disabled": { color: tokens.cyan },
                  }}
                >
                  <Refresh
                    sx={{
                      fontSize: 20,
                      animation: fetching ? "spin 0.9s linear infinite" : "none",
                      "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        {/* Error (inline, keeps last known data) */}
        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Box
                role="alert"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  flexWrap: "wrap",
                  mb: 3,
                  px: 2,
                  py: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${alpha(tokens.red, 0.4)}`,
                  background: alpha(tokens.red, 0.08),
                }}
              >
                <ErrorOutline sx={{ color: tokens.red }} />
                <Typography sx={{ flex: 1, minWidth: 180, fontSize: "0.92rem" }}>
                  {error}{" "}
                  <Box component="span" sx={{ color: tokens.textMuted }}>
                    {hasData ? "Showing the last known status." : "Please try again in a moment."}
                  </Box>
                </Typography>
                <Button size="small" variant="outlined" onClick={reload} disabled={fetching}>
                  Retry
                </Button>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: { xs: 1.25, md: 2 },
            mb: { xs: 2.5, md: 3 },
          }}
        >
          {initialLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} className="skeleton" sx={{ height: { xs: 104, md: 126 }, borderRadius: 4 }} />
            ))
          ) : (
            <>
              <StatCard label="Available" value={counts.available} total={counts.total} color={STATUS_META.available.color} />
              <StatCard label="Occupied" value={counts.occupied} total={counts.total} color={STATUS_META.occupied.color} />
              <StatCard
                label="Maintenance"
                value={counts.maintenance}
                total={counts.total}
                color={STATUS_META.maintenance.color}
              />
              <StatCard label="Total PCs" value={counts.total} total={counts.total} color={tokens.cyan} showBar={false} />
            </>
          )}
        </Box>

        {/* 3D floor map */}
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ scrollMarginTop: 96 }}
        >
          {initialLoading ? (
            <Box className="skeleton" sx={{ height: { xs: 330, sm: 460, md: 600 }, borderRadius: { xs: 4, md: 6 } }} />
          ) : hasData ? (
            <PCGrid3D pcs={sorted} selectedId={selectedId} onSelect={setSelectedId} />
          ) : null}
        </motion.div>

        {/* All stations */}
        <Box sx={{ mt: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: { xs: "1.15rem", md: "1.4rem" }, textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              Gaming PCs
            </Typography>
            {hasData && (
              <Typography sx={{ color: tokens.textMuted, fontSize: "0.9rem" }}>
                <Box component="span" sx={{ color: STATUS_META.available.color, fontWeight: 700 }}>
                  {counts.available}
                </Box>{" "}
                of {counts.total} free
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
              gap: { xs: 1.25, md: 1.5 },
            }}
          >
            {initialLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <Box key={i} className="skeleton" sx={{ height: 92, borderRadius: 3.5 }} />
                ))
              : sorted.map((pc) => (
                  <StationCard
                    key={pc.pcNumber}
                    pc={pc}
                    selected={selectedId === pc.pcNumber}
                    onClick={() => selectFromList(pc.pcNumber)}
                  />
                ))}
          </Box>

          {hasData && sorted.length === 0 && (
            <Typography sx={{ color: tokens.textMuted, textAlign: "center", py: 6 }}>
              No stations are listed yet. Check back soon.
            </Typography>
          )}
        </Box>

        {/* PlayStation rooms */}
        {(initialLoading || rooms.length > 0) && (
          <Box sx={{ mt: { xs: 5, md: 7 } }}>
            <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2, mb: 2, flexWrap: "wrap" }}>
              <Typography variant="h3" sx={{ fontSize: { xs: "1.15rem", md: "1.4rem" }, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                PlayStation rooms
              </Typography>
              {hasData && (
                <Typography sx={{ color: tokens.textMuted, fontSize: "0.9rem" }}>
                  <Box component="span" sx={{ color: STATUS_META.available.color, fontWeight: 700 }}>
                    {statsByType?.playstation?.available ?? roomsFree}
                  </Box>{" "}
                  of {statsByType?.playstation?.total ?? rooms.length} free
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: `repeat(${Math.min(Math.max(rooms.length, 2), 3)}, 1fr)` },
                gap: { xs: 1.25, md: 2 },
              }}
            >
              {initialLoading
                ? Array.from({ length: 2 }).map((_, i) => <Box key={i} className="skeleton" sx={{ height: 170, borderRadius: 4 }} />)
                : rooms.map((pc) => <RoomCard key={pc.pcNumber} pc={pc} />)}
            </Box>
            {hasData && (
              <Button
                component={RouterLink}
                to="/reserve?type=playstation"
                variant="outlined"
                startIcon={<EventAvailable />}
                sx={{ mt: 2 }}
              >
                Book a PS5 room
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PCStatusPage;
