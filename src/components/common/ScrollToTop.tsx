import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * Automatically scrolls to top of page when:
 * 1. Page is refreshed
 * 2. Route changes
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top instantly on route change or page load
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
