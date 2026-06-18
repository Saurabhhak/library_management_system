import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollContext } from "./ScrollContext";

/**
 * ScrollToTop — renders nothing, resets scroll on every route change.
 * Must be inside <ScrollProvider> and <BrowserRouter>.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  const { scrollToTop } = useScrollContext();

  useEffect(() => {
    scrollToTop("instant"); // no animation — instant page-like jump
  }, [pathname, scrollToTop]);

  return null;
}

export default ScrollToTop;
