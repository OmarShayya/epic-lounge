import { useCallback, useEffect, useRef, useState } from "react";
import { describeApiError, reservationApi } from "@/services/api";
import type { Availability, ReservationConfig, StationType } from "@/services/api";

export const useReservationConfig = () => {
  const [config, setConfig] = useState<ReservationConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setConfig(await reservationApi.getConfig());
    } catch (err) {
      setError(describeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { config, error, loading, reload: load };
};

const REFRESH_MS = 60_000;

/**
 * Availability for one night. Re-fetches when the inputs change and every minute
 * (paused while the tab is hidden). Out-of-order responses are ignored.
 */
export const useAvailability = (params: { type: StationType; date: string | null; duration: number } | null) => {
  const [data, setData] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);
  const key = params && params.date ? `${params.type}|${params.date}|${params.duration}` : null;
  const lastKey = useRef<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!params || !params.date) return;
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      try {
        const res = await reservationApi.getAvailability({ type: params.type, date: params.date, duration: params.duration });
        if (id !== requestId.current) return;
        setData(res);
        setError(null);
      } catch (err) {
        if (id !== requestId.current) return;
        setError(describeApiError(err).message);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  useEffect(() => {
    if (!key) return;
    if (lastKey.current !== key) {
      // New night / type / length: drop the old grid so stale times can't be picked
      setData(null);
      lastKey.current = key;
    }
    load();

    let timer: number | undefined;
    const start = () => {
      window.clearInterval(timer);
      timer = window.setInterval(() => load(true), REFRESH_MS);
    };
    const onVisibility = () => {
      if (document.hidden) window.clearInterval(timer);
      else {
        load(true);
        start();
      }
    };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [key, load]);

  return { data, loading: loading && !data, refreshing: loading && !!data, error, refresh: () => load(true) };
};
